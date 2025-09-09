import React from "react";
import PropTypes from "prop-types";

const EventCard = ({ event, onSelectEvent }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  // Format date as YYYY-MM-DD HH-MM
  const formattedDate = `${eventDate.getFullYear()}-${String(
    eventDate.getMonth() + 1
  ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")} ${String(
    eventDate.getHours()
  ).padStart(2, "0")}-${String(eventDate.getMinutes()).padStart(2, "0")}`;

  const monthAbbr = eventDate
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const day = String(eventDate.getDate()).padStart(2, "0");

  return (
    <div
      className={`group glass-ui transition-all duration-300 ease-in-out flex flex-col gap-4 ${
        isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={() => !isPast && onSelectEvent(event)}
    >
      <div className="p-6 flex flex-col justify-around min-h-[370px]">
        <div className="relative">
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="absolute top-2 left-2 glass-ui !rounded-xl !py-2 !px-4 text-center">
            <p className="font-bold uppercase text-xs text-primary">
              {monthAbbr}
            </p>
            <p className="font-extrabold text-sm">{day}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xl font-bold uppercase text-pretty truncate group-hover:whitespace-normal group-hover:h-auto">
            {event.name}
          </h3>
          <p className="text-sm font-semibold mt-1">{event.location}</p>
        </div>

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
