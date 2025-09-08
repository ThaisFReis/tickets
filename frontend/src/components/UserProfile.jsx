import React, { useState, useEffect } from 'react';
import { getContract, getSigner } from '../services/ethers';

const UserProfile = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const signer = await getSigner();
        if (!signer) {
            setLoading(false);
            return;
        };
        const userAddress = await signer.getAddress();
        const contract = await getContract();
        
        const tokenIds = await contract.getTicketsOfOwner(userAddress);
        
        const ticketDetails = await Promise.all(tokenIds.map(async (tokenId) => {
          const ticketInfo = await contract.tickets(tokenId);
          const eventInfo = await contract.events(ticketInfo.eventId);
          const isPast = new Date(Number(eventInfo.date) * 1000) < new Date();
          return {
            tokenId: Number(tokenId),
            name: eventInfo.name,
            date: Number(eventInfo.date),
            isPast,
          };
        }));

        setTickets(ticketDetails);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Loading your tickets...</div>;
  }

  const upcomingTickets = tickets.filter(ticket => !ticket.isPast);
  const pastTickets = tickets.filter(ticket => ticket.isPast);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
        {upcomingTickets.length > 0 ? (
          <ul className="space-y-2">
            {upcomingTickets.map(ticket => (
              <li key={ticket.tokenId} className="p-2 bg-gray-700 rounded">{ticket.name}</li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tickets.</p>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Past Events</h3>
        {pastTickets.length > 0 ? (
          <ul className="space-y-2">
            {pastTickets.map(ticket => (
              <li key={ticket.tokenId} className="p-2 bg-gray-600 rounded">{ticket.name}</li>
            ))}
          </ul>
        ) : (
          <p>No past tickets.</p>
        )}
      </section>
    </div>
  );
};

export default UserProfile;
