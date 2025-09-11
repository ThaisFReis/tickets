import { ethers } from 'ethers';
import contractAbi from '../contract-abi.json';
import contractAddress from '../contract-address.json';
import { eventLocations } from '../locations-data';
import { eventsMetadata } from '../events-metadata';

let provider;
if (window.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.error("Please install MetaMask!");
  provider = new ethers.JsonRpcProvider('http://localhost:8545');
}

const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }
  const signer = await provider.getSigner();
  return signer;
};

const getContract = async (withSigner = false) => {
  try {
    if (withSigner) {
      const signer = await getSigner();
      return new ethers.Contract(contractAddress.address, contractAbi, signer);
    }
    const localProvider = new ethers.JsonRpcProvider('http://localhost:8545');
    return new ethers.Contract(contractAddress.address, contractAbi, localProvider);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

const createEvent = async (name, date, tierNames, tierPrices, tierQuantities) => {
  try {
    const contract = await getContract(true);
    const pricesInWei = tierPrices.map(price => ethers.parseEther(price));
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

const purchaseTickets = async (eventId, tier, quantity, totalPrice) => {
  try {
    const contract = await getContract(true);
    
    if (!tier || !tier.tierId) {
      throw new Error(`Invalid tier object provided for event ${eventId}`);
    }
    const tierId = tier.tierId;

    const transaction = await contract.purchaseTickets(eventId, tierId, quantity, { value: totalPrice });
    const receipt = await transaction.wait();
    return receipt;
  } catch (error) {
    console.error("Error buying ticket:", error);
    throw error;
  }
};

const fetchAllEvents = async () => {
  try {
    const contract = await getContract();
    const eventCount = await contract.nextEventId();
    const events = [];
    for (let i = 1; i < eventCount; i++) {
      const eventDetails = await contract.getEventDetails(i);
      const tiers = await getEventTiers(i, eventDetails); // Pass details to avoid re-fetching
      events.push({
        eventId: BigInt(i),
        name: eventDetails[0],
        date: eventDetails[1],
        organizer: eventDetails[2],
        tiers: tiers,
      });
    }
    return events;
  } catch (error) {
    console.error("Error fetching all events:", error);
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
    const eventMeta = eventsMetadata.find(e => e.name === eventName);
    const locationMeta = eventLocations.find(l => l.name === eventMeta?.location);

    const tiers = [];
    let i = 1;
    while (true) {
      try {
        const tier = await contract.getTicketTier(eventId, i);
        const tierName = tier.name;
        const tierType = locationMeta?.seating[tierName]?.type || 'standing';

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
    throw new Error("MetaMask is not installed. Please install it to use this app.");
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
    
    const eventMeta = eventsMetadata.find(e => e.name === eventName);
    if (!eventMeta) return [];

    const locationMeta = eventLocations.find(l => l.name === eventMeta.location);
    if (!locationMeta || !locationMeta.seating[tierName] || !locationMeta.seating[tierName].layout) {
      return []; // Not a seated tier or no layout defined
    }

    const layout = locationMeta.seating[tierName].layout;
    
    // Find the tierId that corresponds to the tierName
    const tiers = await getEventTiers(eventId, eventDetails);
    const tier = tiers.find(t => t.name === tierName);
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
        if (owner !== '0x0000000000000000000000000000000000000000') {
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
};
