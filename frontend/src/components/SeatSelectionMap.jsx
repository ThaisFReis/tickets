import React from 'react';
import PropTypes from 'prop-types';

const SeatSelectionMap = ({ layout, selectedSeats, onSelectSeat, tierName }) => {
  // This is a placeholder for a real seat map.
  // For now, it's just a styled box.
  
  const handleSeatClick = (seatId) => {
    onSelectSeat(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  // A very basic representation of seats for demonstration
  const renderSeats = () => {
    const tierLayout = layout.seatedSections.find(s => s.tierName === tierName);
    if (!tierLayout) return <p>No layout available for this tier.</p>;
    
    return Array.from({ length: tierLayout.rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-1.5">
        {Array.from({ length: tierLayout.seatsPerRow }).map((_, seatIndex) => {
          const seatId = `${tierLayout.name.charAt(0)}-${rowIndex + 1}-${seatIndex + 1}`;
          const isSold = layout.soldSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          let seatClass = 'w-4 h-4 rounded-t-md transition-colors';
          if (isSold) seatClass += ' bg-muted cursor-not-allowed';
          else if (isSelected) seatClass += ' bg-primary scale-110';
          else seatClass += ' bg-muted-foreground/50 hover:bg-primary/50 cursor-pointer';

          return <div key={seatId} className={seatClass} onClick={() => !isSold && handleSeatClick(seatId)} />;
        })}
      </div>
    ));
  };

  return (
    <div>
      <label className="font-semibold mb-2 block uppercase text-sm tracking-wider">Select Seats</label>
      <div className="aspect-video bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border">
        <div className="bg-foreground/80 text-background text-xs font-bold px-4 py-1 rounded-full mb-4">STAGE</div>
        <div className="flex flex-col gap-1.5 w-full">
          {renderSeats()}
        </div>
      </div>
       <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
           <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-muted-foreground/50"></div> Available</div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-primary"></div> Selected</div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-muted"></div> Sold</div>
        </div>
    </div>
  );
};

SeatSelectionMap.propTypes = {
  layout: PropTypes.object.isRequired,
  selectedSeats: PropTypes.array.isRequired,
  onSelectSeat: PropTypes.func.isRequired,
  tierName: PropTypes.string.isRequired,
};

export default SeatSelectionMap;
