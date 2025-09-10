import React from "react";
import PropTypes from "prop-types";
import { eventLocations } from "../locations-data";

// --- 1. Reusable Seat Component ---
const Seat = ({ id, status, isSelected, onSelect, disabled }) => { // 1. Adicione 'disabled' aqui
  const handleClick = () => {
    // 2. Verifique se está desabilitado ANTES de qualquer outra coisa
    if (disabled || status !== "available") {
      return;
    }
    onSelect(id);
  };

  const getSeatClassName = () => {
    let baseClass = "w-4 h-4 rounded-t-md transition-colors flex-shrink-0 ";
    // 3. Adicione uma classe para o estado desabilitado
    if (disabled) return baseClass + "bg-muted/50 cursor-not-allowed";
    if (status === "unavailable") return baseClass + "bg-muted cursor-not-allowed";
    if (isSelected) return baseClass + "bg-primary scale-110 transform";
    return baseClass + "bg-muted-foreground hover:bg-primary cursor-pointer";
  };

  return (
    <div
      className={getSeatClassName()}
      onClick={handleClick}
      aria-label={`Seat ${id}, Status: ${isSelected ? "Selected" : status}`}
      role="button"
      // 4. Acessibilidade: O tab index também deve considerar o estado 'disabled'
      tabIndex={status === "available" && !disabled ? 0 : -1}
    />
  );
};

Seat.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool, // Adicione esta linha
};

Seat.defaultProps = {
  disabled: false, // Defina um valor padrão
};

// --- Componente Principal do Layout do Estádio ---
const StarlightAmphitheaterLayout = ({
  onSelect,
  selectedSeats,
  tier,
  event,
}) => {
  const locationData = eventLocations.find(
    (loc) => loc.name === event.location
  );

  // Adicionando dados de layout para Mezzanine caso não existam em seu arquivo
  // O ideal é que isso venha de `eventLocations`
  if (locationData && locationData.seating["Mezzanine 1"]) {
    locationData.seating["Mezzanine 1"].layout = { rows: 8, seatsPerRow: 10 };
  }
  if (locationData && locationData.seating["Mezzanine 2"]) {
    locationData.seating["Mezzanine 2"].layout = { rows: 6, seatsPerRow: 10 };
  }

  if (!locationData) return <p>Dados de localização não encontrados.</p>;

  // --- Sub-componentes do Layout ---

  // Componente para a arquibancada principal (curva) - SEM ALTERAÇÕES
  const CurvedSeatingSection = ({ rows, seatsPerRow, tierName, isActive }) => (
    <div className="relative w-full bg-slate-500">
      <div className="flex flex-col items-center gap-1.5 py-4 bg-primary/5 rounded-b-[50%] overflow-hidden">
        <span className="text-sm font-bold text-primary/80 mb-2">{tierName}</span>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div className="flex justify-center gap-1.5" key={rowIndex} style={{ width: `${85 + rowIndex * 1.5}%` }}>
            {Array.from({ length: seatsPerRow }).map((_, seatIndex) => (
              <Seat key={`${tierName}-${rowIndex}-${seatIndex}`} id={`${tierName}-${rowIndex}-${seatIndex}`} status="available" isSelected={selectedSeats.includes(`${tierName}-${rowIndex}-${seatIndex}`)} onSelect={onSelect} disabled={!isActive} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // NOVO Componente para as arquibancadas LATERAIS (Mezzanine)
  const SideSeatingSection = ({ rows, seatsPerRow, tierName, isActive }) => {
    if (!rows || !seatsPerRow) return null; // Não renderiza se não houver layout
    return (
      <div className="relative">
        <div className="flex flex-col items-center gap-1.5 p-3 bg-primary/5 rounded-lg overflow-hidden">
          <span className="text-xs font-bold text-center text-primary/80 mb-2">{tierName}</span>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div className="flex justify-center gap-1.5" key={rowIndex}>
              {Array.from({ length: seatsPerRow }).map((_, seatIndex) => (
                <Seat key={`${tierName}-${rowIndex}-${seatIndex}`} id={`${tierName}-${rowIndex}-${seatIndex}`} status="available" isSelected={selectedSeats.includes(`${tierName}-${rowIndex}-${seatIndex}`)} onSelect={onSelect} disabled={!isActive} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Componente para áreas sem assentos (pista, camarotes) - SEM ALTERAÇÕES
  const StandingArea = ({ tierName, isActive, className = "" }) => (
    <div className={`p-4 text-center font-bold text-xs rounded-lg transition-all duration-300 border-2 ${isActive ? "bg-blue-500/20 border-blue-500 scale-105" : "bg-primary/10 border-transparent opacity-70"} ${className}`}>
      {tierName.toUpperCase()}
    </div>
  );

  // --- Estrutura JSX Principal ---
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-4 p-4 glass-ui !rounded-xl">
      {/* PALCO */}
      <div className="bg-foreground text-background text-sm font-bold px-20 py-3 rounded-t-xl shadow-lg z-10">
        PALCO
      </div>
      
      {/* CAMAROTES VIP (AO REDOR DO TOPO) */}
      <div className="w-full flex justify-between items-center px-4 -mb-4">
        <div className="flex gap-3">
          <StandingArea tierName="VIP Box" isActive={tier === "VIP Box"} className="w-24 h-16"/>
          <StandingArea tierName="VIP Box" isActive={tier === "VIP Box"} className="w-24 h-16"/>
        </div>
        <div className="flex gap-3">
          <StandingArea tierName="VIP Box" isActive={tier === "VIP Box"} className="w-24 h-16"/>
          <StandingArea tierName="VIP Box"isActive={tier === "VIP Box"} className="w-24 h-16"/>
          <StandingArea tierName="VIP Box" isActive={tier === "VIP Box"} className="w-24 h-16"/>
        </div>
      </div>

      {/* ESTRUTURA PRINCIPAL DO ESTÁDIO (Layout em "U") */}
      <div className="w-full flex justify-center items-end gap-3">
        {/* COLUNA ESQUERDA: Mezzanines */}
        <div className="w-[22.5%] flex flex-col-reverse gap-3">
          <SideSeatingSection {...locationData.seating["Mezzanine 1"]?.layout} tierName="Mezzanine 1" isActive={tier === "Mezzanine 1"} />
          <SideSeatingSection {...locationData.seating["Mezzanine 2"]?.layout} tierName="Mezzanine 2" isActive={tier === "Mezzanine 2"} />
        </div>

        {/* COLUNA CENTRAL: Pistas e Arquibancada Principal */}
        <div className="w-[55%] flex flex-col items-center gap-2">
            <StandingArea tierName="Premium Floor" isActive={tier === "Premium Floor"} className="w-full !p-8 !rounded-t-[50%]"/>
            <StandingArea tierName="General Admission Floor" isActive={tier === "General Admission Floor"} className="w-full !p-10 !rounded-t-[40%]"/>
            <CurvedSeatingSection {...locationData.seating["General Admission Lawn"].layout} tierName="General Admission Lawn" isActive={tier === "General Admission Lawn"}/>
        </div>

        {/* COLUNA DIREITA: Mezzanines */}
        <div className="w-[22.5%] flex flex-col-reverse gap-3">
          <SideSeatingSection {...locationData.seating["Mezzanine 1"]?.layout} tierName="Mezzanine 1" isActive={tier === "Mezzanine 1"} />
          <SideSeatingSection {...locationData.seating["Mezzanine 2"]?.layout} tierName="Mezzanine 2" isActive={tier === "Mezzanine 2"} />
        </div>
      </div>
    </div>
  );
};

const TheVelvetNoteLayout = ({ onSelect, selectedSeats, tier }) => {
  const levels = {
    Standard: { rows: 5, seatsPerRow: 15 }, // Simplified for clarity
    Balcony: [
      { id: "T1", seats: 13, position: { top: "30%", left: "23%" } },
      { id: "T2", seats: 17, position: { top: "50%", left: "16.5%" } },
      { id: "T3", seats: 20, position: { top: "70%", left: "11.5%" } },
    ],
  };

  if (!tier || !levels[tier]) return <p>Select a tier to see the layout.</p>;

  if (tier === "Standard") {
    const currentLevelData = levels.Standard;
    return (
      <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
        <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">
          STAGE
        </div>
        <div className="text-center font-bold uppercase">{tier}</div>
        {Array.from({ length: currentLevelData.rows }).map((_, rowIndex) => (
          <div className="flex justify-center gap-2" key={rowIndex}>
            {Array.from({ length: currentLevelData.seatsPerRow }).map(
              (_, seatIndex) => {
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
              }
            )}
          </div>
        ))}
      </div>
    );
  }

  const tables = levels.Balcony;
  return (
    <div className="relative w-full h-64 glass-ui !rounded-xl p-4">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full">
        STAGE
      </div>
      <div className="text-center font-bold uppercase">{tier}</div>
      {tables.map((table) => (
        <div
          className="absolute flex items-center justify-center gap-2"
          key={table.id}
          style={table.position}
        >
          {Array.from({ length: table.seats }).map((_, i) => {
            const seatId = `${table.id}-${i + 1}`;
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

const NeoKyotoConventionCenterLayout = ({ onSelect, selectedSeats }) => {
  return (
    <div className="flex flex-col items-center gap-2 p-4 glass-ui !rounded-xl">
      <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">
        AUDITORIUM STAGE
      </div>
      {Array.from({ length: 15 }).map((_, rowIndex) => (
        <div className="flex justify-center gap-2" key={rowIndex}>
          {Array.from({ length: 20 }).map((_, seatIndex) => {
            const seatId = `R${rowIndex + 1}-S${seatIndex + 1}`;
            const status =
              rowIndex > 5 && seatIndex > 5 && seatIndex < 15
                ? "unavailable"
                : "available";
            return (
              <Seat
                key={seatId}
                id={seatId}
                status={status}
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
      <div className="bg-foreground text-background text-xs font-bold px-8 py-1 rounded-full mb-4">
        STAGE
      </div>
      <div className="text-center font-bold uppercase">{tier}</div>
      {Array.from({ length: currentLevelData.rows }).map((_, rowIndex) => (
        <div className="flex justify-center gap-2" key={`${tier}-${rowIndex}`}>
          {Array.from({ length: currentLevelData.seatsPerRow / 2 }).map(
            (_, seatIndex) => {
              const seatId = `${tier}-L-${rowIndex + 1}-${seatIndex + 1}`;
              return (
                <Seat
                  key={seatId}
                  id={seatId}
                  status="available"
                  isSelected={selectedSeats.includes(seatId)}
                  onSelect={onSelect}
                />
              );
            }
          )}
          <div className="w-4"></div> {/* Aisle */}
          {Array.from({ length: currentLevelData.seatsPerRow / 2 }).map(
            (_, seatIndex) => {
              const seatId = `${tier}-R-${rowIndex + 1}-${seatIndex + 1}`;
              return (
                <Seat
                  key={seatId}
                  id={seatId}
                  status="available"
                  isSelected={selectedSeats.includes(seatId)}
                  onSelect={onSelect}
                />
              );
            }
          )}
        </div>
      ))}
    </div>
  );
};

// --- 3. Main Seat Selection Map Component ---
const SeatSelectionMap = ({
  event,
  selectedTier,
  selectedSeats,
  onSelectSeat,
}) => {
  const renderVenueLayout = () => {
    if (!selectedTier || selectedTier.type !== "seated") {
      return null;
    }

    switch (event.location) {
      case "Starlight Amphitheater":
        return (
          <StarlightAmphitheaterLayout
            onSelect={onSelectSeat}
            selectedSeats={selectedSeats}
            tier={selectedTier.name}
            event={event}
          />
        );
      case "The Velvet Note":
        return (
          <TheVelvetNoteLayout
            onSelect={onSelectSeat}
            selectedSeats={selectedSeats}
            tier={selectedTier.name}
          />
        );
      case "Neo-Kyoto Convention Center":
        return (
          <NeoKyotoConventionCenterLayout
            onSelect={onSelectSeat}
            selectedSeats={selectedSeats}
          />
        );
      case "The Grand Theatre":
        return (
          <TheGrandTheatreLayout
            onSelect={onSelectSeat}
            selectedSeats={selectedSeats}
            tier={selectedTier.name}
          />
        );
      default:
        return (
          <p className="text-muted-foreground text-center py-4">
            Seating map for {event.location} is not available.
          </p>
        );
    }
  };

  return (
    <div className="mt-6">
      <label className="font-semibold mb-2 block uppercase text-sm tracking-wider">
        Select Seats
      </label>
      {renderVenueLayout()}
      <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-t-md bg-muted-foreground/50"></div>{" "}
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-t-md bg-primary"></div> Selected
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-t-md bg-muted"></div> Unavailable
        </div>
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
