import React, { useState, useEffect } from 'react';
import { fetchAllEvents } from '../services/ethers';
import { ethers } from 'ethers';
import PurchaseFlow from './PurchaseFlow'; // Import the new component

const ConcertList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const allEvents = await fetchAllEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (selectedEvent) {
    return (
      <div>
        <button onClick={() => setSelectedEvent(null)} className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-bold">
          &larr; Back to Events
        </button>
        <PurchaseFlow eventData={selectedEvent} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-text-primary">Upcoming Concerts</h2>
      <ul className="space-y-6">
        {events.map((event) => (
          <li key={Number(event.eventId)} className="bg-surface border border-border rounded-lg p-4 transition-shadow hover:shadow-glow">
            <h3 className="text-xl font-bold text-text-primary">{event.name}</h3>
            <p className="text-sm text-text-secondary">Date: {new Date(Number(event.date) * 1000).toLocaleDateString()}</p>
            {/* Price info will now be inside the purchase flow */}
            <button
              onClick={() => setSelectedEvent(event)}
              className="mt-4 btn-primary"
            >
              View Tickets
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConcertList;
;
