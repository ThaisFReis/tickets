import React from 'react';
import PropTypes from 'prop-types';
import EventCard from '../components/EventCard';

const HomePage = ({ events, onSelectEvent, isLoading }) => {
  if (isLoading) {
    return <div className="text-center text-lg text-text-secondary">Loading events...</div>;
  }

  if (!events || events.length === 0) {
    return <div className="text-center text-lg text-text-secondary">No upcoming events found.</div>;
  }

  // Filter out any events that don't have a valid ID
  const validEvents = events.filter(event => event && typeof event.id === 'number' && !isNaN(event.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {validEvents.map(event => (
          <EventCard key={event.id} event={event} onSelectEvent={onSelectEvent} />
        ))}
      </div>
    </div>
  );
};

HomePage.propTypes = {
  events: PropTypes.array.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default HomePage;
