import React from "react";
import PropTypes from "prop-types";

const TicketCard = ({ ticket, onSelectTicket, isPast }) => {
  const eventDate = new Date(ticket.eventDate);

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
    <div className={`glass-ui ${isPast ? "opacity-60" : ""}`}>
      <div className="p-4">
        <div className="relative">
          <img
            src={ticket.eventImage}
            alt={ticket.eventName}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="absolute top-2 left-2 glass-ui !rounded-xl !py-2 !px-4 text-center">
            <p className="font-bold uppercase text-xs text-primary">
              {monthAbbr}
            </p>
            <p className="font-extrabold text-sm">{day}</p>
          </div>
        </div>
        <h3 className="text-2xl font-bold uppercase">{ticket.eventName}</h3>
        <p className="text-md font-semibold mt-1">
          {ticket.venue}
        </p>
        <button
          onClick={onSelectTicket}
          disabled={isPast}
          className="normal-bnt mt-4 w-full border-2 border-border py-3 rounded-full hover:bg-primary/20 font-semibold uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPast ? 'Event Ended' : 'View Ticket'}
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
