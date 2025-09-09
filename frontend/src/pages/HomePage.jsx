import React from 'react';
import PropTypes from 'prop-types';
import EventCard from '../components/EventCard';

const HomePage = ({ events, onSelectEvent, isLoading }) => {
  // Filter out any events that don't have a valid ID before rendering
  const validEvents = events.filter(event => event && typeof event.id === 'number' && !isNaN(event.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center mb-16">
            <h1 className="text-6xl md:text-8xl font-extrabold uppercase mb-4 text-glow">Enter the Concertverse</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">The next dimension of live events is here. Mint your access pass.</p>
            <div className="mt-8 max-w-md mx-auto">
                <input 
                    type="search" 
                    placeholder="Find your next experience..." 
                    className="glass-ui w-full px-5 py-3 text-center focus:ring-2 focus:ring-primary outline-none text-lg"
                />
            </div>
        </div>

        {isLoading && <div className="text-center text-lg text-muted-foreground">Loading events...</div>}
        {!isLoading && (!validEvents || validEvents.length === 0) && (
            <div className="text-center text-lg text-muted-foreground">No upcoming events found.</div>
        )}

        {!isLoading && validEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {validEvents.map(event => (
                    <EventCard key={event.id} event={event} onSelectEvent={onSelectEvent} />
                ))}
            </div>
        )}
    </div>
  );
};

HomePage.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default HomePage;
