import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getEventTiers } from '../services/ethers';

const formatPrice = (priceInWeiString) => {
    const WEI_PER_ETH = 1000000000000000000;
    try {
        const priceInWei = BigInt(priceInWeiString);
        const priceInEth = Number(priceInWei) / WEI_PER_ETH;
        return priceInEth.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } catch (e) {
        console.error("Erro ao formatar preço:", e);
        return "0.00";
    }
};

const MOCK_VENUE_LAYOUT = {
    seatedSections: [
        { tierName: 'Arquibancada', name: 'Setor A', rows: 8, seatsPerRow: 16 },
        { tierName: 'Arquibancada', name: 'Setor B', rows: 8, seatsPerRow: 18 },
        { tierName: 'Camarote', name: 'Lounge VIP', rows: 4, seatsPerRow: 8, isVIP: true },
        { tierName: 'Plateia', name: 'Fileiras A-E', rows: 5, seatsPerRow: 12 },
    ],
    soldSeats: ['A-1-3', 'A-1-4', 'B-3-8', 'B-3-9', 'L-2-1', 'F-3-5']
};

function EventDetailPage({ event, onPurchase, walletConnected }) {
    const [ticketTiers, setTicketTiers] = useState([]);
    const [isLoadingTiers, setIsLoadingTiers] = useState(true);
    const [selectedTier, setSelectedTier] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const eventDate = new Date(event.date);
    const imageURL = `https://placehold.co/800x1200/1F2937/FFFFFF?text=${encodeURIComponent(event.name)}`;

    useEffect(() => {
        const loadTiers = async () => {
            if (!event?.id) return;
            try {
                setIsLoadingTiers(true);
                const tiers = await getEventTiers(event.id);
                setTicketTiers(tiers);
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

    const handleSeatSelect = (seatId) => {
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
    };

    const totalPrice = useMemo(() => {
        if (!selectedTier) return "0";
        const count = selectedTier.type === 'seated' ? selectedSeats.length : quantity;
        return (BigInt(count) * BigInt(selectedTier.price)).toString();
    }, [selectedTier, selectedSeats, quantity]);

    const sectionsForTier = MOCK_VENUE_LAYOUT.seatedSections.filter(s => s.tierName === selectedTier?.name);

    return (
        <div className="container mx-auto text-white">
            <div className="lg:flex gap-12">
                <div className="lg:w-1/3 mb-8 lg:mb-0">
                    <img src={imageURL} alt={event.name} className="rounded-lg shadow-2xl w-full" />
                    <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
                        <p className="text-md text-gray-400"><strong>Data:</strong> {eventDate.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    </div>
                </div>
                <div className="lg:w-2/3">
                    <h3 className="text-2xl font-bold mb-4">1. Escolha o tipo de ingresso</h3>
                    {isLoadingTiers ? <p>A carregar tipos de ingresso...</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {ticketTiers.map(tier => (
                                <div key={tier.tierId} onClick={() => handleTierSelect(tier)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedTier?.tierId === tier.tierId ? 'border-violet-500 bg-violet-900/50' : 'border-gray-700 bg-gray-800 hover:border-violet-600'}`}>
                                    <h4 className="font-bold text-xl">{tier.name}</h4>
                                    <p className="text-violet-400 text-lg">{formatPrice(tier.price)} ETH</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {selectedTier && (
                        <div>
                            <h3 className="text-2xl font-bold mb-4">2. Selecione seus ingressos</h3>
                            {selectedTier.type === 'standing' ? (
                                <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-between">
                                    <span className="text-lg">Quantidade:</span>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="bg-gray-700 rounded-full w-10 h-10 text-2xl">-</button>
                                        <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)} className="bg-gray-700 rounded-full w-10 h-10 text-2xl">+</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg overflow-x-auto">
                                    <div className="relative h-12 w-3/4 mx-auto mb-8 bg-gradient-to-t from-violet-800 to-violet-600 rounded-t-full shadow-[0_0_20px_5px_rgba(124,58,237,0.5)]"><div className="absolute inset-x-0 bottom-0 text-center text-white font-bold text-lg">PALCO</div></div>
                                    <div className="flex flex-col items-center gap-8">
                                        {sectionsForTier.map(section => (
                                            <div key={section.name} className="flex flex-col items-center gap-1.5">
                                                <h4 className="font-semibold text-gray-300 mb-2">{section.name}</h4>
                                                {Array.from({ length: section.rows }).map((_, rowIndex) => (
                                                    <div key={rowIndex} className="flex justify-center gap-1.5">
                                                        {Array.from({ length: section.seatsPerRow }).map((_, seatIndex) => {
                                                            const seatId = `${section.name.charAt(0)}-${rowIndex + 1}-${seatIndex + 1}`;
                                                            const isSold = MOCK_VENUE_LAYOUT.soldSeats.includes(seatId);
                                                            const isSelected = selectedSeats.includes(seatId);
                                                            let seatClass = `transition-colors duration-200 ${section.isVIP ? 'w-6 h-6 sm:w-7 sm:h-7 rounded-md' : 'w-4 h-4 sm:w-5 sm:h-5 rounded-t-md'}`;
                                                            if (isSold) seatClass += " bg-gray-600 cursor-not-allowed";
                                                            else if (isSelected) seatClass += " bg-violet-500 scale-110 shadow-lg cursor-pointer";
                                                            else seatClass += " bg-gray-400 hover:bg-violet-400 cursor-pointer";
                                                            return <div key={seatId} className={seatClass} onClick={() => !isSold && handleSeatSelect(seatId)}></div>
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400">
                                       <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-t-md bg-gray-400"></div> Disponível</div>
                                       <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-t-md bg-violet-500"></div> Selecionado</div>
                                       <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-t-md bg-gray-600"></div> Ocupado</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {totalPrice !== "0" && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 border-t border-gray-700">
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <h4 className="font-bold text-lg">{selectedTier.name}</h4>
                            <p className="text-xs text-gray-300 font-mono max-w-xs truncate">{selectedTier.type === 'seated' ? selectedSeats.join(', ') : `${quantity} Ingresso(s)`}</p>
                        </div>
                        <div className="text-center"><p className="text-gray-400">Total</p><p className="font-bold text-2xl text-violet-400">{formatPrice(totalPrice)} ETH</p></div>
                        <button onClick={() => onPurchase(event, selectedTier, selectedTier.type === 'seated' ? selectedSeats : quantity, totalPrice)} disabled={!walletConnected}
                            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {walletConnected ? `Comprar Ingresso(s)` : 'Conecte a Carteira'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

EventDetailPage.propTypes = {
    event: PropTypes.object.isRequired,
    onPurchase: PropTypes.func.isRequired,
    walletConnected: PropTypes.bool.isRequired,
};

export default EventDetailPage;
