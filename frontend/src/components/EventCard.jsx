import React from 'react';
import PropTypes from 'prop-types';

const EventCard = ({ event, onSelectEvent }) => {
    const eventDate = new Date(event.date);
    const isPast = eventDate < new Date();

    return (
        <div 
            className={`glass-ui ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !isPast && onSelectEvent(event)}
        >
            <div className="p-4">
                <img 
                    src={event.image} 
                    alt={event.name} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-bold uppercase">{event.name}</h3>
                <p className="text-md text-secondary font-semibold mt-1">{event.venue}</p>
                {isPast && <p className="text-destructive font-bold text-sm mt-2">EVENT ENDED</p>}
            </div>
        </div>
    );
};

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        venue: PropTypes.string.isRequired,
    }).isRequired,
    onSelectEvent: PropTypes.func.isRequired,
};

export default EventCard;
