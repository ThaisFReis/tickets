import React from 'react';
import PropTypes from 'prop-types';

const TicketCard = ({ eventName, date, seatDetails, isPast = false }) => {
  const cardClasses = `bg-background-secondary rounded-lg p-4 flex justify-between items-center transition-opacity ${isPast ? 'opacity-50' : ''}`;

  return (
    <div className={cardClasses}>
      <div>
        <h3 className={`text-xl font-bold ${isPast ? 'text-text-secondary' : 'text-text-main'}`}>{eventName}</h3>
        <p className="text-text-secondary mt-1">{date}</p>
        <p className="text-primary font-semibold">{seatDetails}</p>
      </div>
      {!isPast && (
        <div className="text-right">
          <p className="text-success font-bold">VALID</p>
          {/* Could add a QR code component here in the future */}
        </div>
      )}
    </div>
  );
};

TicketCard.propTypes = {
  eventName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  seatDetails: PropTypes.string.isRequired,
  isPast: PropTypes.bool,
};

export default TicketCard;
