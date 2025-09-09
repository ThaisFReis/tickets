import React from 'react';
import PropTypes from 'prop-types';

const VenueMap = ({
  venueData,
  soldSeats = [],
  onSeatSelect,
  selectedTierId,
  selectedSeats = [],
  quantity,
}) => {
  const handleSeatClick = (seatId, isClickable) => {
    if (isClickable) {
      onSeatSelect(seatId);
    }
  };

  return (
    <div className="venue-map p-4 bg-[#252525] rounded-lg">
      {venueData.sections.map((section) => (
        <div key={section.sectionName} className="mb-4">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Section {section.sectionName}
          </h3>
          {section.rows.map((row) => (
            <div key={row.rowName} className="flex items-center mb-2">
              <span className="w-8 text-text-secondary">R{row.rowName}</span>
              <div className="flex gap-2">
                {row.seats.map((seat) => {
                  const isSold = soldSeats.includes(seat.seatId);
                  const isSelected = selectedSeats.includes(seat.seatId);
                  const isTierMatch = section.tierId === selectedTierId;
                  const canSelectMore = selectedSeats.length < quantity;

                  let seatClass = 'bg-surface text-text-secondary cursor-not-allowed';
                  let isClickable = false;

                  if (isTierMatch) {
                    if (isSold) {
                      seatClass = 'bg-[#404040] text-text-secondary cursor-not-allowed';
                    } else if (isSelected) {
                      seatClass = 'bg-accent-primary text-white animate-pulse';
                      isClickable = true;
                    } else if (canSelectMore) {
                      seatClass = 'border border-text-secondary text-text-secondary hover:bg-accent-primary hover:text-white';
                      isClickable = true;
                    }
                  }
                  
                  const seatLabel = `${section.sectionName}${row.rowName}-${seat.seatNumber}`;

                  return (
                    <div
                      key={seat.seatId}
                      className={`seat w-12 h-12 flex items-center justify-center rounded font-bold transition-colors ${seatClass} ${isClickable ? 'cursor-pointer' : ''}`}
                      onClick={() => handleSeatClick(seat.seatId, isClickable)}
                    >
                      {seatLabel}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

VenueMap.propTypes = {
  venueData: PropTypes.object.isRequired,
  soldSeats: PropTypes.arrayOf(PropTypes.number),
  onSeatSelect: PropTypes.func.isRequired,
  selectedTierId: PropTypes.number.isRequired,
  selectedSeats: PropTypes.arrayOf(PropTypes.number),
  quantity: PropTypes.number.isRequired,
};

export default VenueMap;
