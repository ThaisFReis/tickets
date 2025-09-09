import { ethers } from 'ethers';
import contractAbi from '../contract-abi.json';
import contractAddress from '../contract-address.json';

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

const buyTicket = async (eventId, typeId, seatIds, totalPrice) => {
  try {
    const contract = await getContract(true);
    const transaction = await contract.buyTicket(eventId, typeId, seatIds, { value: ethers.parseEther(totalPrice) });
    await transaction.wait();
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
      events.push({
        eventId: BigInt(i),
        name: eventDetails[0],
        date: eventDetails[1],
        organizer: eventDetails[2],
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

export {
  provider,
  getSigner,
  getContract,
  createEvent,
  buyTicket,
  fetchAllEvents,
  getEventDetails,
  getTicketsOfOwner,
  isSeatSold,
  getOwnerOfTicket,
  getTokenURI,
};
