import React from 'react';
import PropTypes from 'prop-types';

const TicketCard = ({ ticket, onSelectTicket, isPast }) => {
  return (
    <div className={`glass-ui ${isPast ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <img 
          src={ticket.eventImage} 
          alt={ticket.eventName} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-2xl font-bold uppercase">{ticket.eventName}</h3>
        <p className="text-md text-secondary font-medium mt-1">{ticket.venue || 'Decentralized Arena'}</p>
        <button 
          onClick={onSelectTicket}
          className="mt-4 w-full border-2 border-border py-3 rounded-full hover:bg-primary/20 font-semibold uppercase transition-colors"
        >
          View Ticket
        </button>
      </div>
    </div>
  );
};

TicketCard.propTypes = {
  ticket: PropTypes.object.isRequired,
  onSelectTicket: PropTypes.func.isRequired,
  isPast: PropTypes.bool,
};

export default TicketCard;
