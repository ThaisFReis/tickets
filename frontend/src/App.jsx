import React, { useState } from 'react';
import './App.css';
import ConcertList from './components/ConcertList';
import UserProfile from './components/UserProfile';

function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="App bg-gray-900 text-white min-h-screen p-8">
      <header className="App-header mb-8">
        <h1 className="text-4xl font-bold">Concert Ticket Marketplace</h1>
        <nav className="mt-4">
          <a href="#" onClick={() => setPage('home')} className="mr-4 text-lg hover:text-blue-400">Home</a>
          <a href="#" onClick={() => setPage('profile')} className="text-lg hover:text-blue-400" role="link">My Tickets</a>
        </nav>
      </header>
      <main>
        {page === 'home' && <ConcertList />}
        {page === 'profile' && <UserProfile />}
      </main>
    </div>
  );
}

export default App;
