import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import { getSigner } from '../services/ethers'; // Assuming you have a connect wallet function here

const Homepage = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  // Dummy data for event cards
  const events = [
    { imageUrl: 'https://via.placeholder.com/400x200', title: 'Rock Fest 2025', date: 'October 10, 2025', location: 'City Stadium', price: 50 },
    { imageUrl: 'https://via.placeholder.com/400x200', title: 'Jazz Night', date: 'November 15, 2025', location: 'The Jazz Club', price: 30 },
    { imageUrl: 'https://via.placeholder.com/400x200', title: 'Classical Concert', date: 'January 5, 2025', location: 'Symphony Hall', price: 75 },
    { imageUrl: 'https://via.placeholder.com/400x200', title: 'EDM Party', date: 'December 31, 2025', location: 'Warehouse District', price: 100 },
  ];

  const connectWallet = async () => {
    try {
      const signer = await getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-text-main">Events</h1>
        {walletAddress ? (
          <div className="bg-background-secondary text-text-main font-semibold py-2 px-4 rounded-lg">
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </header>

      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          placeholder="Search events..."
          className="flex-grow bg-background-secondary p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input 
          type="date"
          className="bg-background-secondary p-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {/* Add more filters as needed */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
