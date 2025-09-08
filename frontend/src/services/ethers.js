import { ethers } from 'ethers';
import contractAbi from '../contract-abi.json';
import contractAddress from '../contract-address.json';

let provider;
if (window.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.error("Please install MetaMask!");
  // Fallback to a read-only provider if MetaMask is not available
  provider = ethers.getDefaultProvider('http://localhost:8545');
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
    return new ethers.Contract(contractAddress.address, contractAbi, provider);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

const createEvent = async (name, date, ticketPrice, totalSupply, isAssignedSeating, totalSeats) => {
  try {
    const contract = await getContract(true);
    const transaction = await contract.createEvent(
      name,
      date,
      ethers.parseEther(ticketPrice),
      totalSupply,
      isAssignedSeating,
      totalSeats
    );
    await transaction.wait();
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

const buyTicket = async (eventId, seatId) => {
    try {
      const contract = await getContract(true);
      const eventDetails = await getEventDetails(eventId);
      const ticketPrice = eventDetails.ticketPrice;
      const transaction = await contract.buyTicket(eventId, seatId, { value: ticketPrice });
      await transaction.wait();
    } catch (error) {
      console.error("Error buying ticket:", error);
      throw error;
    }
  };

const getAllEvents = async () => {
  try {
    const contract = await getContract();
    return await contract.getAllEvents();
  } catch (error) {
    console.error("Error getting all events:", error);
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
  getAllEvents,
  getEventDetails,
  getTicketsOfOwner,
  isSeatSold,
  getOwnerOfTicket,
  getTokenURI,
};