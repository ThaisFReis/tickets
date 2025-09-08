import React from 'react';

const VenueMap = ({ venueData, soldSeats = [], onSeatSelect }) => {
  const isSeatSold = (seatId) => soldSeats.includes(seatId);

  const handleSeatClick = (seatId) => {
    if (!isSeatSold(seatId)) {
      onSeatSelect(seatId);
    }
  };

  return (
    <div className="venue-map p-4 bg-gray-800 rounded-lg">
      {venueData.sections.map((section) => (
        <div key={section.sectionName} className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">
            Section {section.sectionName}
          </h3>
          {section.rows.map((row) => (
            <div key={row.rowName} className="flex items-center mb-2">
              <span className="w-8 text-gray-400">R{row.rowName}</span>
              <div className="flex gap-2">
                {row.seats.map((seat) => {
                  const sold = isSeatSold(seat.seatId);
                  const seatLabel = `${section.sectionName}${row.rowName}-${seat.seatNumber}`;
                  return (
                    <div
                      key={seat.seatId}
                      className={`seat w-12 h-12 flex items-center justify-center rounded font-bold cursor-pointer
                        ${sold 
                          ? 'sold bg-red-500 text-gray-300 cursor-not-allowed' 
                          : 'available bg-green-500 hover:bg-green-400 text-white'
                        }`}
                      onClick={() => handleSeatClick(seat.seatId)}
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

export default VenueMap;
