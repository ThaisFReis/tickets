import React from 'react';
import PropTypes from 'prop-types';
import EventCard from '../components/EventCard';

const HomePage = ({ events, onSelectEvent }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-4xl font-bold text-white text-center mb-10">Próximos Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(event => (
                    <EventCard key={event.id} event={event} onSelectEvent={onSelectEvent} />
                ))}
            </div>
        </div>
    );
};

HomePage.propTypes = {
    events: PropTypes.array.isRequired,
    onSelectEvent: PropTypes.func.isRequired,
};

export default HomePage;
