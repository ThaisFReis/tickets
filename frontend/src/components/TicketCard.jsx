import React from 'react';
import PropTypes from 'prop-types';

const TicketCard = ({ eventName, venue, eventImage, isPast }) => {
  return (
    <div className={`glass-ui ${isPast ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <img 
          src={eventImage} 
          alt={eventName} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-2xl font-bold uppercase">{eventName}</h3>
        <p className="text-md text-secondary font-semibold mt-1">{venue}</p>
        <button className="mt-4 w-full border-2 border-border py-3 rounded-full hover:bg-primary/20 font-semibold uppercase transition-colors">
          View Ticket
        </button>
      </div>
    </div>
  );
};

TicketCard.propTypes = {
  eventName: PropTypes.string.isRequired,
  venue: PropTypes.string.isRequired,
  eventImage: PropTypes.string.isRequired,
  isPast: PropTypes.bool,
};

export default TicketCard;
