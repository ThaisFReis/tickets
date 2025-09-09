import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import VenueMap from '../components/VenueMap'; // Assuming VenueMap is in components

const EventDetailPage = ({ event, onPurchase, walletConnected }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatSelect = (seat) => {
        setSelectedSeats(prev =>
            prev.some(s => s.seatId === seat.seatId)
                ? prev.filter(s => s.seatId !== seat.seatId)
                : [...prev, seat]
        );
    };

    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0).toFixed(4);
    }, [selectedSeats]);

    // MOCK DATA FOR LAYOUT - In a real app, this would come from an API
    const MOCK_VENUE_LAYOUT = {
        eventId: 1,
        sections: [
            { name: 'Bloco A', rows: 5, seatsPerRow: 10, tierId: 2 },
            { name: 'Bloco B', rows: 5, seatsPerRow: 10, tierId: 2 },
            { name: 'Camarote', rows: 2, seatsPerRow: 10, tierId: 3 },
        ],
        soldSeats: ['A-1-3', 'A-1-4', 'B-3-8', 'B-3-9', 'C-1-5']
    };

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <div className="lg:flex gap-8">
                <div className="lg:w-1/3 mb-8 lg:mb-0">
                    <img src={event.image.replace('?text=', `?w=800&h=1200&text=`)} alt={event.name} className="rounded-lg shadow-2xl w-full" />
                </div>
                <div className="lg:w-2/3">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-2">{event.name}</h2>
                    <p className="text-xl text-gray-300 mb-4">{event.artist}</p>
                    <div className="text-lg text-gray-400 mb-6 space-y-2">
                        <p><strong>Data:</strong> {new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                        <p><strong>Local:</strong> {event.venue}</p>
                    </div>
                    <p className="text-gray-300 mb-8">{event.description}</p>
                    
                    {event.seatingType === 'assigned' ? (
                         <VenueMap
                             layout={MOCK_VENUE_LAYOUT}
                             soldSeats={MOCK_VENUE_LAYOUT.soldSeats}
                             selectedSeats={selectedSeats}
                             onSeatSelect={handleSeatSelect}
                             tiers={event.tiers}
                         />
                    ) : (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">Ingressos</h3>
                             {event.tiers.map(tier => (
                                <div key={tier.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-md mb-2">
                                     <div>
                                        <p className="font-bold">{tier.name}</p>
                                        <p className="text-sm text-gray-400">{tier.total} disponíveis</p>
                                     </div>
                                     <span className="font-bold text-violet-400">{tier.price} ETH</span>
                                 </div>
                            ))}
                            <p className="text-center mt-4 text-gray-400">Para eventos de entrada geral, a compra é simplificada.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 border-t border-gray-700">
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">Assentos Selecionados:</h4>
                            <p className="text-sm text-gray-300">{selectedSeats.map(s => s.seatId).join(', ')}</p>
                        </div>
                        <div className="text-center my-2 sm:my-0">
                            <p className="text-gray-400">Total</p>
                            <p className="font-bold text-2xl text-violet-400">{totalPrice} ETH</p>
                        </div>
                        <button 
                            onClick={() => onPurchase(selectedSeats, totalPrice)}
                            disabled={!walletConnected}
                            className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {walletConnected ? `Comprar ${selectedSeats.length} Ingresso(s)` : 'Conecte a Carteira'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

EventDetailPage.propTypes = {
    event: PropTypes.object.isRequired,
    onPurchase: PropTypes.func.isRequired,
    walletConnected: PropTypes.bool.isRequired,
};

export default EventDetailPage;
