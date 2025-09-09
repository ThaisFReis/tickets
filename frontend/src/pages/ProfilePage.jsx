import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TicketCard from '../components/TicketCard';

const ProfilePage = ({ tickets, userAddress }) => {
    const [activeTab, setActiveTab] = useState('upcoming');

    const now = new Date();
    const upcomingTickets = tickets.filter(t => new Date(t.eventDate) >= now);
    const pastTickets = tickets.filter(t => new Date(t.eventDate) < now);

    const ticketsToShow = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="mb-12">
                <h1 className="text-6xl font-extrabold uppercase">My Tickets</h1>
                <p className="text-muted-foreground font-mono text-lg mt-2">{userAddress}</p>
            </div>

            <div className="mb-8 border-b-2 border-border/50">
                <nav className="-mb-0.5 flex space-x-8" aria-label="Tabs">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`tab-btn whitespace-nowrap pb-4 px-1 border-b-4 font-bold uppercase tracking-wider text-lg ${
                            activeTab === 'upcoming' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-muted-foreground hover:border-secondary hover:text-secondary'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button 
                        onClick={() => setActiveTab('past')}
                        className={`tab-btn whitespace-nowrap pb-4 px-1 border-b-4 font-bold uppercase tracking-wider text-lg ${
                            activeTab === 'past' 
                            ? 'border-primary text-primary' 
                            : 'border-transparent text-muted-foreground hover:border-secondary hover:text-secondary'
                        }`}
                    >
                        Past
                    </button>
                </nav>
            </div>

            {ticketsToShow.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ticketsToShow.map(ticket => (
                        <TicketCard 
                            key={ticket.tokenId}
                            eventName={ticket.eventName}
                            eventDate={ticket.eventDate}
                            eventImage={ticket.eventImage}
                            venue="Starlight Amphitheater" // Placeholder
                            isPast={activeTab === 'past'}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-12">
                    {activeTab === 'upcoming' 
                        ? "You don't have any tickets for upcoming events."
                        : "You don't have any tickets for past events."
                    }
                </p>
            )}
        </main>
    );
};

ProfilePage.propTypes = {
    tickets: PropTypes.array.isRequired,
    userAddress: PropTypes.string.isRequired,
};

export default ProfilePage;
