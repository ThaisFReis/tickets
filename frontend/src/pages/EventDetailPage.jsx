import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import TicketTypeSelector from '../components/TicketTypeSelector';
import QuantitySelector from '../components/QuantitySelector';
import PurchaseSummary from '../components/PurchaseSummary';
import SeatSelectionMap from '../components/SeatSelectionMap'; // Re-import SeatSelectionMap
import { getEventTiers } from '../services/ethers';


const EventDetailPage = ({ event, onPurchase, onNavigateBack, walletConnected }) => {
    const [ticketTiers, setTicketTiers] = useState([]);
    const [isLoadingTiers, setIsLoadingTiers] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const loadTiers = async () => {
            if (!event?.id) return;
            try {
                setIsLoadingTiers(true);
                const tiers = await getEventTiers(event.id);
                setTicketTiers(tiers);
                if (tiers.length > 0) {
                    setSelectedTier(tiers[0]);
                }
            } catch (error) {
                console.error("Failed to fetch ticket tiers:", error);
            } finally {
                setIsLoadingTiers(false);
            }
        };
        loadTiers();
    }, [event]);

    const handleTierSelect = (tier) => {
        setSelectedTier(tier);
        setQuantity(1);
        setSelectedSeats([]);
    };
    
    const totalPrice = useMemo(() => {
        if (!selectedTier) return "0";
        const count = selectedTier.type === 'seated' ? selectedSeats.length : quantity;
        if (count === 0) return "0";
        const priceInWei = BigInt(selectedTier.price);
        return (BigInt(count) * priceInWei).toString();
    }, [selectedTier, quantity, selectedSeats]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <button 
                onClick={onNavigateBack} 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-semibold uppercase text-xs tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
            </button>
            <div className="grid grid-cols-1 lg:flex gap-12">
                <div className="lg:col-span-3 lg:w-1/3">
                    <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full rounded-2xl object-cover mb-6 border-2 border-border shadow-lg"
                    />
                    <h1 className="text-4xl font-extrabold uppercase text-glow2 w-full text-pretty">{event.name}</h1>
                    <p className="text-lg font-semibold mt-2">{event.location}</p>
                    <div className="mt-6 text-lg text-muted-foreground">
                        <p>{event.description}</p>
                    </div>
                </div>
                <div className="lg:col-span-2 lg:w-2/3">
                    <div className="glass-ui p-6 sticky top-28">
                        <h2 className="text-3xl font-bold uppercase mb-6">Select Tickets</h2>
                        
                        {isLoadingTiers ? <p>Loading tiers...</p> : (
                            <TicketTypeSelector
                                tiers={ticketTiers}
                                selectedTier={selectedTier}
                                onSelectTier={handleTierSelect}
                            />
                        )}

                        {selectedTier?.type === 'standing' && (
                          <QuantitySelector
                              quantity={quantity}
                              setQuantity={setQuantity}
                          />
                        )}

                        {selectedTier?.type === 'seated' && (
                          <SeatSelectionMap
                            event={event}
                            selectedTier={selectedTier}
                            selectedSeats={selectedSeats}
                            onSelectSeat={setSelectedSeats}
                            // soldSeats will come from the contract in a real app
                          />
                        )}
                        
                        <PurchaseSummary
                            totalPrice={totalPrice}
                            onPurchase={() => onPurchase(selectedSeats, totalPrice)}
                            walletConnected={walletConnected}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

EventDetailPage.propTypes = {
    event: PropTypes.object.isRequired,
    onPurchase: PropTypes.func.isRequired,
    onNavigateBack: PropTypes.func.isRequired,
    walletConnected: PropTypes.bool.isRequired,
};

export default EventDetailPage;
