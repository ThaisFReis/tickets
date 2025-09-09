import React from 'react';
import PropTypes from 'prop-types';

const EventCard = ({ event, onSelectEvent }) => {
    const eventDate = new Date(event.date);
    const isPast = eventDate < new Date();

    return (
        <div 
            className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer ${isPast ? 'opacity-50' : ''}`}
            onClick={() => !isPast && onSelectEvent(event)}
        >
            <img className="w-full h-48 object-cover" src={event.image} alt={event.name} />
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{event.artist}</p>
                <p className="text-gray-400 text-sm mb-4">{new Date(event.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex justify-between items-center">
                    <span className="text-violet-400 font-bold">A partir de {event.tiers[0].price} ETH</span>
                     {isPast && <span className="text-red-500 font-bold text-sm">EVENTO ENCERRADO</span>}
                </div>
            </div>
        </div>
    );
};

EventCard.propTypes = {
    event: PropTypes.object.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
};

export default EventCard;
