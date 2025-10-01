import { ethers } from "ethers";
import contractAbi from "../contract-abi.json";
import contractAddress from "../contract-address.json";
import { eventLocations } from "../locations-data";
import { eventsMetadata } from "../events-metadata";

let provider;
if (window.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.error("Please install MetaMask!");
  // Base Sepolia RPC endpoint as fallback
  provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
}

const BASE_SEPOLIA_CHAIN_ID = "0x7a69"; // 31337 in hex (Hardhat local network)
const BASE_SEPOLIA_RPC = "http://127.0.0.1:8545"; // Local Hardhat network

const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  const signer = await provider.getSigner();
  return signer;
};

const checkAndSwitchNetwork = async () => {
  if (!window.ethereum) {
    console.warn("MetaMask not detected, using fallback provider");
    return;
  }

  try {
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current chain ID:", currentChainId);
    console.log("Expected chain ID:", BASE_SEPOLIA_CHAIN_ID);
    
    if (currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
      console.log("Wrong network detected, attempting to switch to Hardhat local network...");
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        });
        console.log("Successfully switched to Base Sepolia");
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log("Base Sepolia not added to MetaMask, attempting to add...");
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: 'Hardhat Local',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [BASE_SEPOLIA_RPC],
                blockExplorerUrls: ['http://localhost:8545/'],
              }],
            });
            console.log("Successfully added and switched to Hardhat Local");
          } catch (addError) {
            console.error("Failed to add Base Sepolia network:", addError);
          }
        } else {
          console.error("Failed to switch network:", switchError);
        }
      }
    } else {
      console.log("Already connected to Hardhat Local");
    }
  } catch (error) {
    console.error("Error checking network:", error);
  }
};

const getContract = async (withSigner = false) => {
  try {
    // Check network before creating contract
    await checkAndSwitchNetwork();
    
    if (withSigner) {
      const signer = await getSigner();
      return new ethers.Contract(contractAddress.address, contractAbi, signer);
    }
    // Use the global provider
    return new ethers.Contract(contractAddress.address, contractAbi, provider);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

const createEvent = async (
  name,
  date,
  tierNames,
  tierPrices,
  tierQuantities
) => {
  try {
    const contract = await getContract(true);
    const pricesInWei = tierPrices.map((price) => ethers.parseEther(price));
    const transaction = await contract.createEvent(
      name,
      date,
      tierNames,
      pricesInWei,
      tierQuantities
    );
    await transaction.wait();
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const purchaseTickets = async (eventId, tier, quantity, totalPriceWei) => {
  try {
    const contract = await getContract(true);

    // Handle both tier object and direct tierId
    let tierId;
    if (typeof tier === 'object' && tier.tierId) {
      tierId = tier.tierId;
    } else if (typeof tier === 'number') {
      tierId = tier;
    } else {
      throw new Error(`Invalid tier provided for event ${eventId}. Expected tier object with tierId or number.`);
    }

    console.log('Purchase parameters:', {
      eventId,
      tierId,
      quantity,
      totalPriceWei
    });

    // First, let's validate the contract state
    try {
      console.log('Validating contract state...');
      
      // Check if event exists
      const eventCount = await contract.nextEventId();
      console.log('Next event ID from contract:', eventCount.toString());
      
      if (eventId >= Number(eventCount)) {
        throw new Error(`Event ${eventId} does not exist. Latest event ID is ${Number(eventCount) - 1}`);
      }

      // Get event details
      const eventDetails = await contract.getEventDetails(eventId);
      console.log('Event details:', eventDetails);
      
      // Check event date validation - this might be the issue
      const eventDate = Number(eventDetails[1]); // eventDetails[1] is the date
      const currentTimestamp = Math.floor(Date.now() / 1000);
      
      // Get the actual blockchain timestamp
      const latestBlock = await provider.getBlock('latest');
      const blockTimestamp = latestBlock.timestamp;
      
      console.log('Event date (timestamp):', eventDate);
      console.log('Current timestamp (local):', currentTimestamp);
      console.log('Block timestamp (blockchain):', blockTimestamp);
      console.log('Event is in the future (local check):', eventDate > currentTimestamp);
      console.log('Event is in the future (blockchain check):', eventDate > blockTimestamp);
      
      if (eventDate <= blockTimestamp) {
        throw new Error(`Event has already passed according to blockchain time. Event date: ${new Date(eventDate * 1000).toISOString()}, Block time: ${new Date(blockTimestamp * 1000).toISOString()}`);
      }

      // Check if tier exists
      try {
        const tierDetails = await contract.getTicketTier(eventId, tierId);
        console.log('Tier details:', tierDetails);
        
        // Validate tier availability - Convert BigInt to Number for comparison
        const soldCount = Number(tierDetails.sold);
        const totalQuantity = Number(tierDetails.quantity);
        
        console.log('Tier validation:', {
          tierId,
          soldCount,
          totalQuantity,
          requestedQuantity: quantity,
          available: totalQuantity - soldCount
        });
        
        if (soldCount >= totalQuantity) {
          throw new Error(`Tier ${tierId} is sold out`);
        }
        
        if (soldCount + quantity > totalQuantity) {
          throw new Error(`Not enough tickets available. Only ${totalQuantity - soldCount} tickets left`);
        }
        
        // Validate price - Handle BigInt arithmetic properly
        const expectedPrice = tierDetails.price * BigInt(quantity);
        console.log('Price validation:', {
          tierPrice: tierDetails.price.toString(),
          quantity,
          expectedPrice: expectedPrice.toString(),
          providedPrice: totalPriceWei,
          sufficient: BigInt(totalPriceWei) >= expectedPrice
        });
        
        if (BigInt(totalPriceWei) < expectedPrice) {
          throw new Error(`Insufficient payment. Expected: ${expectedPrice.toString()} wei, provided: ${totalPriceWei} wei`);
        }
        
      } catch (tierError) {
        if (tierError.message.includes('Tier not found')) {
          throw new Error(`Tier ${tierId} does not exist for event ${eventId}`);
        }
        throw tierError;
      }

    } catch (validationError) {
      console.error('Contract state validation failed:', validationError);
      throw validationError;
    }

    // Try a static call first to get the actual revert reason
    try {
      console.log('Trying static call to get revert reason...');
      await contract.purchaseTickets.staticCall(
        eventId,
        tierId,
        quantity,
        { value: totalPriceWei }
      );
      console.log('Static call successful - transaction should work');
    } catch (staticError) {
      console.error('Static call failed:', staticError);
      
      // Try to extract more meaningful error from static call
      if (staticError.reason) {
        throw new Error(`Contract validation failed: ${staticError.reason}`);
      }
      if (staticError.message.includes('Event not found')) {
        throw new Error(`Event ${eventId} does not exist`);
      }
      if (staticError.message.includes('Invalid ticket tier')) {
        throw new Error(`Ticket tier ${tierId} does not exist for event ${eventId}`);
      }
      if (staticError.message.includes('Event has already passed')) {
        throw new Error('Event has already passed');
      }
      if (staticError.message.includes('Insufficient payment')) {
        throw new Error('Insufficient payment amount');
      }
      if (staticError.message.includes('Not enough tickets available')) {
        throw new Error('Not enough tickets available for purchase');
      }
      
      throw new Error(`Transaction would fail: ${staticError.message}`);
    }

    // Estimate gas first to catch any contract-level issues
    try {
      console.log('Estimating gas for purchase with params:', {
        eventId,
        tierId,
        quantity,
        value: totalPriceWei
      });
      
      const gasEstimate = await contract.purchaseTickets.estimateGas(
        eventId,
        tierId,
        quantity,
        { value: totalPriceWei }
      );
      console.log('Gas estimate successful:', gasEstimate.toString());
    } catch (estimateError) {
      console.error('Gas estimation failed:', estimateError);
      
      // Provide more specific error messages based on common failure reasons
      if (estimateError.message.includes('Event not found')) {
        throw new Error(`Event ${eventId} does not exist`);
      }
      if (estimateError.message.includes('Invalid ticket tier')) {
        throw new Error(`Ticket tier ${tierId} does not exist for event ${eventId}`);
      }
      if (estimateError.message.includes('Insufficient payment')) {
        throw new Error('Insufficient payment amount');
      }
      if (estimateError.message.includes('Not enough tickets available')) {
        throw new Error('Not enough tickets available for purchase');
      }
      if (estimateError.message.includes('Event has already passed')) {
        throw new Error('Event has already passed');
      }
      
      throw new Error(`Transaction validation failed: ${estimateError.message}`);
    }

    console.log('Attempting transaction with explicit gas limit...');
    const transaction = await contract.purchaseTickets(
      eventId,
      tierId,
      quantity,
      {
        value: totalPriceWei,
        gasLimit: 300000 // Explicit gas limit to bypass estimation issues
      }
    );
    console.log('Transaction sent:', transaction.hash);
    const receipt = await transaction.wait();
    console.log('Transaction confirmed:', receipt);
    return receipt;
  } catch (error) {
    console.error("Error buying ticket:", error);
    throw error;
  }
};
const fetchAllEvents = async () => {
  try {
    // Check network first
    await checkAndSwitchNetwork();
    
    // Log 1: Verificando se o objeto do contrato foi criado
    const contract = await getContract();
    console.log("1. Objeto do Contrato criado:", contract);
    console.log("Endereço do contrato que está sendo chamado:", contract.target);

    // Log current network info
    if (window.ethereum) {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log("Current network chain ID:", currentChainId);
      console.log("Expected Hardhat Local chain ID:", BASE_SEPOLIA_CHAIN_ID);
    }

    // Log 2: Tentando chamar a primeira função do contrato
    console.log("2. Chamando a função 'nextEventId' no contrato...");
    const eventCount = await contract.nextEventId();
    
    // Log 3: Verificando o resultado da chamada
    // Se chegarmos aqui, a conexão funcionou!
    console.log("3. Sucesso! O valor de 'nextEventId' é:", eventCount.toString());

    const events = [];
    for (let i = 1; i < eventCount; i++) {
      console.log(`4. Buscando detalhes para o evento de ID: ${i}`);
      const eventDetails = await contract.getEventDetails(i);
      console.log(`5. Detalhes recebidos para o evento ${i}:`, eventDetails);

      const tiers = await getEventTiers(i, eventDetails);
      events.push({
        eventId: BigInt(i),
        name: eventDetails[0],
        date: eventDetails[1],
        organizer: eventDetails[2],
        tiers: tiers,
      });
    }
    console.log("6. Array final de eventos montado:", events);
    return events;
  } catch (error) {
    console.error("Error fetching all events:", error);
    console.log("Ocorreu um erro DENTRO da função fetchAllEvents.");
    
    // Additional debugging info
    if (error.code === 'BAD_DATA') {
      console.error("BAD_DATA error detected. This usually means:");
      console.error("1. Contract not deployed on current network");
      console.error("2. Wrong contract address");
      console.error("3. Contract function doesn't exist");
      console.error("4. Network connection issues");
    }
    
    throw error;
  }
};

const getEventDetails = async (eventId) => {
  try {
    const contract = await getContract();
    return await contract.getEventDetails(eventId);
  } catch (error) {
    console.error("Error getting event details:", error);
    throw error;
  }
};

const getEventTiers = async (eventId, eventDetails) => {
  try {
    const contract = await getContract();
    // If eventDetails are not provided, fetch them. This makes the function more robust.
    if (!eventDetails) {
      eventDetails = await contract.getEventDetails(eventId);
    }
    const eventName = eventDetails[0];
    const eventMeta = eventsMetadata.find((e) => e.name === eventName);
    const locationMeta = eventLocations.find(
      (l) => l.name === eventMeta?.location
    );

    const tiers = [];
    let i = 1;
    while (true) {
      try {
        const tier = await contract.getTicketTier(eventId, i);
        const tierName = tier.name;
        const tierType = locationMeta?.seating[tierName]?.type || "standing";

        tiers.push({
          tierId: Number(tier.typeId),
          name: tierName,
          price: tier.price.toString(),
          totalQuantity: Number(tier.quantity),
          sold: Number(tier.sold),
          type: tierType,
        });
        i++;
      } catch {
        break; // Assumes error means no more tiers
      }
    }
    return tiers;
  } catch (error) {
    console.error("Error fetching event tiers:", error);
    throw error;
  }
};

const getTicketsOfOwner = async (owner) => {
  try {
    const contract = await getContract();
    return await contract.getTicketsOfOwner(owner);
  } catch (error) {
    console.error("Error getting tickets of owner:", error);
    throw error;
  }
};

const isSeatSold = async (eventId, seatId) => {
  try {
    const contract = await getContract();
    return await contract.isSeatSold(eventId, seatId);
  } catch (error) {
    console.error("Error checking if seat is sold:", error);
    throw error;
  }
};

const getOwnerOfTicket = async (tokenId) => {
  try {
    const contract = await getContract();
    return await contract.ownerOf(tokenId);
  } catch (error) {
    console.error("Error getting owner of ticket:", error);
    throw error;
  }
};

const getTokenURI = async (tokenId) => {
  try {
    const contract = await getContract();
    return await contract.tokenURI(tokenId);
  } catch (error) {
    console.error("Error getting token URI:", error);
    throw error;
  }
};

const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error(
      "MetaMask is not installed. Please install it to use this app."
    );
  }
  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];
    const signer = await provider.getSigner();
    return { signer, address };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw new Error("Wallet connection was rejected.");
  }
};

const fetchUserTickets = async (userAddress) => {
  try {
    const contract = await getContract();
    const ticketIds = await contract.getTicketsOfOwner(userAddress);

    const tickets = await Promise.all(
      ticketIds.map(async (tokenId) => {
        const details = await contract.getTicketDetails(tokenId);
        return {
          tokenId: tokenId.toString(),
          eventId: details.eventId.toString(),
          tierName: details.tierName,
          seatId: details.seatId,
        };
      })
    );
    return tickets;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return [];
  }
};

const fetchSoldSeatsForTier = async (eventId, tierName) => {
  try {
    const contract = await getContract();
    const eventDetails = await contract.getEventDetails(eventId);
    const eventName = eventDetails[0];

    const eventMeta = eventsMetadata.find((e) => e.name === eventName);
    if (!eventMeta) return [];

    const locationMeta = eventLocations.find(
      (l) => l.name === eventMeta.location
    );
    if (
      !locationMeta ||
      !locationMeta.seating[tierName] ||
      !locationMeta.seating[tierName].layout
    ) {
      return []; // Not a seated tier or no layout defined
    }

    const layout = locationMeta.seating[tierName].layout;

    // Find the tierId that corresponds to the tierName
    const tiers = await getEventTiers(eventId, eventDetails);
    const tier = tiers.find((t) => t.name === tierName);
    if (!tier) return [];
    const tierId = tier.tierId;

    const soldSeats = [];
    for (let i = 0; i < layout.rows; i++) {
      for (let j = 0; j < layout.seatsPerRow; j++) {
        // This seatId construction must match the one in SeatSelectionMap.jsx
        const seatIdString = `${tierName}-${i}-${j}`;
        // The contract needs a numerical seatId. We can derive it from the loop indices.
        const seatIndex = i * layout.seatsPerRow + j;

        const owner = await contract.getSeatOwner(eventId, tierId, seatIndex);
        if (owner !== "0x0000000000000000000000000000000000000000") {
          soldSeats.push(seatIdString);
        }
      }
    }
    return soldSeats;
  } catch (error) {
    console.error("Error fetching sold seats:", error);
    return [];
  }
};

export {
  provider,
  getSigner,
  getContract,
  connectWallet,
  createEvent,
  purchaseTickets,
  fetchAllEvents,
  fetchUserTickets,
  fetchSoldSeatsForTier,
  getEventDetails,
  getEventTiers,
  getTicketsOfOwner,
  isSeatSold,
  getOwnerOfTicket,
  getTokenURI,
  checkAndSwitchNetwork,
};
