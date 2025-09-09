import React from "react";
import PropTypes from "prop-types";

const EventCard = ({ event, onSelectEvent }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div
      className={`group glass-ui transition-all duration-300 ease-in-out ${
        isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => !isPast && onSelectEvent(event)}
    >
      <div className="p-6 flex flex-col justify-around min-h-[370px]">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl font-bold uppercase text-pretty h truncate group-hover:whitespace-normal group-hover:h-auto">
          {event.name}
        </h3>
        <p className="text-sm font-medium mt-1">{event.venue}</p>

        {isPast && (
          <p className="text-destructive font-bold text-sm mt-2">EVENT ENDED</p>
        )}
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
