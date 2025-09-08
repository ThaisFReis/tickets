import React, { useState, useEffect } from 'react';
import { getContract } from '../services/ethers';
import { ethers } from 'ethers';

const ConcertList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const contract = await getContract();
        const allEvents = await contract.getAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTicket = async (eventId) => {
    setPurchaseStatus('Purchasing...');
    try {
      const contract = await getContract(true); // Get contract with signer
      const event = events.find(e => e.eventId === eventId);
      const tx = await contract.buyTicket(eventId, 0, { value: event.ticketPrice });
      await tx.wait();
      setPurchaseStatus('Ticket purchased successfully!');
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      setPurchaseStatus('Purchase failed.');
    }
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upcoming Concerts</h2>
      {purchaseStatus && <p className="mb-4 text-green-400">{purchaseStatus}</p>}
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={Number(event.eventId)} className="p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p>Date: {new Date(Number(event.date) * 1000).toLocaleDateString()}</p>
            <p>Price: {ethers.formatEther(event.ticketPrice)} ETH</p>
            <button
              onClick={() => handleBuyTicket(event.eventId)}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
            >
              Buy Ticket
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConcertList;
