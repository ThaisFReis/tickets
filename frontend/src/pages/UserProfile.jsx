import React, { useState } from 'react';
import TicketCard from './TicketCard';
import Button from './Button';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Dummy data - this would be fetched from the blockchain
  const upcomingTickets = [
    { eventName: 'Rock Fest 2025', date: 'October 10, 2025', seatDetails: 'Section A, Row 5, Seat 12' },
    { eventName: 'Jazz Night', date: 'November 15, 2025', seatDetails: 'VIP Table 3, Seat 4' },
  ];

  const pastTickets = [
    { eventName: 'Classical Concert', date: 'January 5, 2025', seatDetails: 'Balcony, Row B, Seat 8' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-text-main mb-6">My Tickets</h2>
      
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 text-lg ${activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 text-lg ${activeTab === 'past' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
        >
          Past Events
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'upcoming' && upcomingTickets.map((ticket, index) => (
          <TicketCard key={index} {...ticket} />
        ))}
        {activeTab === 'past' && pastTickets.map((ticket, index) => (
          <TicketCard key={index} {...ticket} isPast />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
