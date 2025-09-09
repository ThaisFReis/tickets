import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Button from './Button';

// This would typically come from a CMS or API
const venueLayout = {
  width: 800,
  height: 600,
  sections: [
    { id: 'a', name: 'Section A', seats: Array.from({ length: 50 }, (_, i) => ({ id: `a${i+1}`, x: 50 + (i % 10) * 30, y: 50 + Math.floor(i / 10) * 30 })) },
    { id: 'b', name: 'Section B', seats: Array.from({ length: 50 }, (_, i) => ({ id: `b${i+1}`, x: 450 + (i % 10) * 30, y: 50 + Math.floor(i / 10) * 30 })) },
    { id: 'c', name: 'Section C', seats: Array.from({ length: 100 }, (_, i) => ({ id: `c${i+1}`, x: 50 + (i % 20) * 35, y: 250 + Math.floor(i / 20) * 35 })) },
  ]
};

const Seat = ({ details, status, onClick }) => {
  const statusClasses = {
    available: 'stroke-text-secondary fill-transparent hover:fill-primary/50 cursor-pointer',
    sold: 'fill-background-secondary stroke-text-secondary cursor-not-allowed',
    selected: 'fill-primary stroke-white cursor-pointer',
  };

  return (
    <circle
      cx={details.x}
      cy={details.y}
      r="10"
      className={`transition-colors ${statusClasses[status]}`}
      onClick={() => status === 'available' && onClick(details.id)}
    />
  );
};

const SeatSelectionMap = ({ soldSeats = [], ticketPrice = 0 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const getSeatStatus = (seatId) => {
    if (soldSeats.includes(seatId)) return 'sold';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const totalPrice = (selectedSeats.length * ticketPrice).toFixed(2);

  return (
    <div className="w-full">
      <div className="relative border-2 border-background-secondary rounded-lg overflow-hidden">
        <TransformWrapper>
          <TransformComponent>
            <svg width={venueLayout.width} height={venueLayout.height} className="bg-background-main">
              {venueLayout.sections.map(section => (
                <g key={section.id}>
                  {section.seats.map(seat => (
                    <Seat
                      key={seat.id}
                      details={seat}
                      status={getSeatStatus(seat.id)}
                      onClick={handleSeatClick}
                    />
                  ))}
                </g>
              ))}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="bg-background-secondary p-4 mt-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="text-text-main font-bold text-lg">
            {selectedSeats.length} Seat{selectedSeats.length !== 1 && 's'} Selected
          </p>
          <p className="text-text-secondary">Total: ${totalPrice}</p>
        </div>
        <Button disabled={selectedSeats.length === 0}>
          Purchase Tickets
        </Button>
      </div>
    </div>
  );
};

SeatSelectionMap.propTypes = {
  soldSeats: PropTypes.arrayOf(PropTypes.string),
  ticketPrice: PropTypes.number,
};

export default SeatSelectionMap;
