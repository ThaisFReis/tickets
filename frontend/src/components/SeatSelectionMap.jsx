import React from 'react';
import PropTypes from 'prop-types';

// --- 1. Reusable Seat Component ---
const Seat = ({ id, status, isSelected, onSelect }) => {
  const handleClick = () => {
    if (status === 'available') {
      onSelect(id);
    }
  };

  const getSeatClassName = () => {
    let baseClass = "w-4 h-4 rounded-t-md transition-colors flex-shrink-0 ";
    if (status === 'unavailable') return baseClass + 'bg-muted cursor-not-allowed';
    if (isSelected) return baseClass + 'bg-primary scale-110 transform';
    return baseClass + 'bg-muted-foreground hover:bg-primary cursor-pointer';
  };

  return (
    <div
      className={getSeatClassName()}
      onClick={handleClick}
      aria-label={`Seat ${id}, Status: ${isSelected ? 'Selected' : status}`}
      role="button"
      tabIndex={status === 'available' ? 0 : -1}
    />
  );
};

// --- 2. Venue-Specific Layouts ---

const StarlightAmphitheaterLayout = ({ onSelect, selectedSeats, tier }) => {
  const sections = {
    'VIP Box': { rows: 2, seatsPerRow: 10, startAngle: -20 },
    'Floor': { rows: 5, seatsPerRow: 20, startAngle: -45 },
    'Bleachers': { rows: 8, seatsPerRow: 30, startAngle: -60 },
  };

  const section = sections[tier];
  if (!section) return <p>Select a tier to see the layout.</p>;

  return (
    <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
      <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">STAGE</div>
      {Array.from({ length: section.rows }).map((_, rowIndex) => (
        <div className="flex justify-center gap-2" key={rowIndex}>
          {Array.from({ length: section.seatsPerRow }).map((_, seatIndex) => {
            const seatId = `${tier.charAt(0)}-${rowIndex + 1}-${seatIndex + 1}`;
            return (
              <Seat
                key={seatId}
                id={seatId}
                status="available"
                isSelected={selectedSeats.includes(seatId)}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const TheVelvetNoteLayout = ({ onSelect, selectedSeats, tier }) => {
  const levels = {
    Standard: { rows: 5, seatsPerRow: 30 },
    Balcony: [
      { id: 'T1', seats: 13, position: { top: '30%', left: '23%' } },
      { id: 'T2', seats: 17, position: { top: '50%', left: '16.5%' } },
      { id: 'T3', seats: 20, position: { top: '70%', left: '11.5%' } },
    ],
  };

  if (!tier || !levels[tier]) return <p>Select a tier to see the layout.</p>;

  if (tier === 'Standard') {
    const currentLevelData = levels.Standard;
    return (
      <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
        <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">STAGE</div>
        <div className="text-center font-bold uppercase">{tier}</div>
        {Array.from({ length: currentLevelData.rows }).map((_, rowIndex) => (
          <div className="flex justify-center gap-2" key={rowIndex}>
            {Array.from({ length: currentLevelData.seatsPerRow }).map((_, seatIndex) => {
              const seatId = `${tier}-R${rowIndex + 1}-S${seatIndex + 1}`;
              return (
                <Seat
                  key={seatId}
                  id={seatId}
                  status="available"
                  isSelected={selectedSeats.includes(seatId)}
                  onSelect={onSelect}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Balcony layout
  const tables = levels.Balcony;
  return (
    <div className="relative w-full h-64 glass-ui !rounded-xl p-4">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full">STAGE</div>
      <div className="text-center font-bold uppercase">{tier}</div>
      {tables.map(table => (
        <div className="absolute flex items-center justify-center gap-2" key={table.id} style={table.position}>
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-xs">{table.id}</div>
          {Array.from({ length: table.seats }).map((_, i) => {
            const seatId = `${table.id}-${i + 1}`;
            return <Seat key={seatId} id={seatId} status="available" isSelected={selectedSeats.includes(seatId)} onSelect={onSelect} />;
          })}
        </div>
      ))}
    </div>
  );
};

const NeoKyotoConventionCenterLayout = ({ onSelect, selectedSeats }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
      <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">AUDITORIUM STAGE</div>
      {Array.from({ length: 15 }).map((_, rowIndex) => (
        <div className="flex justify-center gap-2" key={rowIndex}>
          {Array.from({ length: 20 }).map((_, seatIndex) => {
            const seatId = `R${rowIndex + 1}-S${seatIndex + 1}`;
            const status = (rowIndex > 5 && seatIndex > 5 && seatIndex < 15) ? 'unavailable' : 'available';
            return <Seat key={seatId} id={seatId} status={status} isSelected={selectedSeats.includes(seatId)} onSelect={onSelect} />;
          })}
        </div>
      ))}
    </div>
  );
};

const TheGrandTheatreLayout = ({ onSelect, selectedSeats, tier }) => {
  const levels = {
    Orchestra: { rows: 10, seatsPerRow: 24 },
    Mezzanine: { rows: 6, seatsPerRow: 28 },
    Balcony: { rows: 8, seatsPerRow: 32 },
  };

  const currentLevelData = levels[tier];
  if (!currentLevelData) return <p>Select a tier to see the layout.</p>;

  return (
    <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
      <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">STAGE</div>
      <div className="text-center font-bold uppercase">{tier}</div>
      {Array.from({ length: currentLevelData.rows }).map((_, rowIndex) => (
        <div className="flex justify-center gap-2" key={`${tier}-${rowIndex}`}>
          {Array.from({ length: currentLevelData.seatsPerRow / 2 }).map((_, seatIndex) => {
            const seatId = `${tier}-L-${rowIndex + 1}-${seatIndex + 1}`;
            return <Seat key={seatId} id={seatId} status="available" isSelected={selectedSeats.includes(seatId)} onSelect={onSelect} />;
          })}
          <div className="w-4"></div> {/* Aisle */}
          {Array.from({ length: currentLevelData.seatsPerRow / 2 }).map((_, seatIndex) => {
            const seatId = `${tier}-R-${rowIndex + 1}-${seatIndex + 1}`;
            return <Seat key={seatId} id={seatId} status="available" isSelected={selectedSeats.includes(seatId)} onSelect={onSelect} />;
          })}
        </div>
      ))}
    </div>
  );
};


// --- 3. Main Seat Selection Map Component ---
const SeatSelectionMap = ({ event, selectedTier, selectedSeats, onSelectSeat }) => {

  const renderVenueLayout = () => {
    if (!selectedTier || selectedTier.type !== 'seated') {
      return null; // Don't render a map for standing or unselected tiers
    }

    switch (event.location) {
      case 'Starlight Amphitheater':
        return <StarlightAmphitheaterLayout onSelect={onSelectSeat} selectedSeats={selectedSeats} tier={selectedTier.name} />;
      case 'The Velvet Note':
        return <TheVelvetNoteLayout onSelect={onSelectSeat} selectedSeats={selectedSeats} tier={selectedTier.name} />;
      case 'Neo-Kyoto Convention Center':
        return <NeoKyotoConventionCenterLayout onSelect={onSelectSeat} selectedSeats={selectedSeats} />;
      case 'The Grand Theatre':
        return <TheGrandTheatreLayout onSelect={onSelectSeat} selectedSeats={selectedSeats} tier={selectedTier.name} />;
      default:
        return <p className="text-muted-foreground text-center py-4">Seating map for {event.location} is not available.</p>;
    }
  };

  return (
    <div className="mt-6">
      <label className="font-semibold mb-2 block uppercase text-sm tracking-wider">Select Seats</label>
      {renderVenueLayout()}
      <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-muted-foreground/50"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-primary"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-t-md bg-muted"></div> Unavailable</div>
      </div>
    </div>
  );
};

SeatSelectionMap.propTypes = {
  event: PropTypes.object.isRequired,
  selectedTier: PropTypes.object,
  selectedSeats: PropTypes.array.isRequired,
  onSelectSeat: PropTypes.func.isRequired,
};

export default SeatSelectionMap;
