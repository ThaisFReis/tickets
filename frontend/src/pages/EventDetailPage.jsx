import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import TicketTypeSelector from '../components/TicketTypeSelector';
import QuantitySelector from '../components/QuantitySelector';
import PurchaseSummary from '../components/PurchaseSummary';
import { getEventTiers } from '../services/ethers';


const EventDetailPage = ({ event, onPurchase, onNavigateBack, walletConnected }) => {
    const [ticketTiers, setTicketTiers] = useState([]);
    const [isLoadingTiers, setIsLoadingTiers] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const formattedDate = useMemo(() => {
        if (!event?.date) return '';
        return new Date(event.date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            year: 'numeric',
        });
    }, [event?.date]);

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
    };
    
    const totalPrice = useMemo(() => {
        if (!selectedTier) return "0";
        if (quantity === 0) return "0";
        const priceInWei = BigInt(selectedTier.price);
        return (BigInt(quantity) * priceInWei).toString();
    }, [selectedTier, quantity]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 pb-12">
            <button 
                onClick={onNavigateBack} 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 font-semibold uppercase text-xs tracking-widest"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
            </button>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-7/12">
                    <img 
                        src={event.image} 
                        alt={event.name} 
                        className="w-full h-auto aspect-[16/10] rounded-2xl object-cover mb-6 border-2 border-border shadow-lg"
                    />
                    <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-glow2 w-full text-pretty">{event.name}</h1>
                    <p className="text-md md:text-lg text-secondary font-semibold mt-2">{formattedDate}</p>
                    <p className="text-md md:text-lg font-semibold mt-2">{event.location}</p>
                    <div className="mt-6 text-md md:text-lg text-muted-foreground">
                        <p>{event.description}</p>
                    </div>
                </div>
                <div className="lg:w-5/12">
                    <div className="glass-ui p-6 lg:sticky top-28">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase mb-6">Select Tickets</h2>
                        
                        {isLoadingTiers ? <p>Loading tiers...</p> : (
                            <TicketTypeSelector
                                tiers={ticketTiers}
                                selectedTier={selectedTier}
                                onSelectTier={handleTierSelect}
                            />
                        )}

                        {selectedTier && (
                          <QuantitySelector
                              quantity={quantity}
                              setQuantity={setQuantity}
                              maxQuantity={selectedTier.totalQuantity - selectedTier.sold}
                          />
                        )}
                        
                        <PurchaseSummary
                            totalPrice={totalPrice}
                            onPurchase={() => onPurchase(selectedTier, quantity, totalPrice)}
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
