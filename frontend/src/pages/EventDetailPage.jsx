import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react'; // Using lucide-react, will need to install
import TicketTypeSelector from '../components/TicketTypeSelector';
import QuantitySelector from '../components/QuantitySelector';
import SeatSelectionMap from '../components/SeatSelectionMap';
import PurchaseSummary from '../components/PurchaseSummary';

// Mock data for now, will be replaced with actual data fetching
const MOCK_VENUE_LAYOUT = {
    seatedSections: [
        { tierName: 'Bleachers', name: 'Section A', rows: 8, seatsPerRow: 16 },
        { tierName: 'Bleachers', name: 'Section B', rows: 8, seatsPerRow: 18 },
        { tierName: 'VIP', name: 'VIP Lounge', rows: 4, seatsPerRow: 8, isVIP: true },
    ],
    soldSeats: ['A-1-3', 'A-1-4', 'B-3-8', 'B-3-9', 'V-2-1']
};


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
                // This is a placeholder for fetching real tier data
                // In the new design, we have 'Floor', 'Bleachers', 'VIP'
                const fetchedTiers = [
                    { tierId: 1, name: 'Floor', price: '10000000000000000', type: 'standing' },
                    { tierId: 2, name: 'Bleachers', price: '15000000000000000', type: 'seated' },
                    { tierId: 3, name: 'VIP', price: '30000000000000000', type: 'seated' },
                ];
                setTicketTiers(fetchedTiers);
                setSelectedTier(fetchedTiers[0]); // Select 'Floor' by default
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
        setSelectedSeats([]);
        setQuantity(1);
    };
    
    const totalPrice = useMemo(() => {
        if (!selectedTier) return "0";
        const count = selectedTier.type === 'seated' ? selectedSeats.length : quantity;
        if (count === 0) return "0";
        const priceInWei = BigInt(selectedTier.price);
        return (BigInt(count) * priceInWei).toString();
    }, [selectedTier, selectedSeats, quantity]);


    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <button 
                onClick={onNavigateBack} 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-semibold uppercase text-xs tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full rounded-2xl object-cover mb-6 border-2 border-border shadow-lg"
                    />
                    <h1 className="text-6xl font-extrabold uppercase text-glow">{event.name}</h1>
                    <p className="text-lg text-secondary font-semibold mt-2">{event.venue}</p>
                    <div className="mt-6 text-lg text-muted-foreground">
                        <p>{event.description}</p>
                    </div>
                </div>
                <div className="lg:col-span-2">
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
                                layout={MOCK_VENUE_LAYOUT}
                                selectedSeats={selectedSeats}
                                onSelectSeat={setSelectedSeats}
                                tierName={selectedTier.name}
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
