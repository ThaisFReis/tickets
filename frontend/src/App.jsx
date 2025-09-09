import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import TransactionModal from './components/TransactionModal';
import { fetchAllEvents } from './services/ethers';
import { eventsMetadata } from './events-metadata'; // Import the metadata
import './index.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [ownedTickets, setOwnedTickets] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [modalState, setModalState] = useState('closed');
    const [purchaseDetails, setPurchaseDetails] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                const fetchedEvents = await fetchAllEvents();
                
                // Merge on-chain data with off-chain metadata
                const eventsWithDetails = fetchedEvents.map(event => {
                    const metadata = eventsMetadata.find(m => m.name === event.name) || {};
                    return {
                        id: Number(event.eventId),
                        name: event.name,
                        date: new Date(Number(event.date) * 1000).toISOString(),
                        ...metadata, // Add location, description, image, etc.
                    };
                });

                setEvents(eventsWithDetails);
                setError(null);
            } catch (err) {
                console.error("Error fetching events from contract:", err);
                setError("Failed to load events. Please ensure you're connected to the correct network.");
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const handleConnectWallet = () => {
        if (walletConnected) {
            setWalletConnected(false);
            setUserAddress('');
        } else {
            // In a real app, you would use ethers.js here
            setWalletConnected(true);
            setUserAddress('0x1a2b...c3d4');
        }
    };
    
    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setCurrentPage('event');
        window.scrollTo(0, 0);
    };
    
    const handleNavigate = (page) => {
        if (page === 'profile' && !walletConnected) {
            alert('Por favor, conecte a sua carteira para ver os seus ingressos.');
            return;
        }
        setCurrentPage(page);
        setSelectedEvent(null); // Reset selected event when navigating away
        window.scrollTo(0, 0);
    };

    const handleNavigateBack = () => {
        setCurrentPage('home');
        setSelectedEvent(null);
    }

    const handlePurchase = (seats, totalPrice) => {
        setPurchaseDetails({ event: selectedEvent, seats, totalPrice });
        setModalState('confirm');
    };

    const handleConfirmPurchase = () => {
        setModalState('processing');
        // Simulate blockchain transaction
        setTimeout(() => {
            const newTickets = (purchaseDetails.seats.length > 0 ? purchaseDetails.seats : [{seatId: 'Floor'}]).map((seat, index) => ({
                tokenId: `NFT-${Date.now()}-${index}`,
                eventId: purchaseDetails.event.id,
                eventName: purchaseDetails.event.name,
                eventDate: purchaseDetails.event.date,
                eventImage: purchaseDetails.event.image,
                venue: purchaseDetails.event.location,
                seatId: seat.seatId,
            }));

            setOwnedTickets(prev => [...prev, ...newTickets]);
            setModalState('success');
            
            // After success, close modal and navigate to profile
            setTimeout(() => {
                setModalState('closed');
                setCurrentPage('profile');
                window.scrollTo(0, 0);
            }, 3000);
        }, 3000);
    };
    
    const renderPage = () => {
        if (loading) return <div className="text-center text-lg text-muted-foreground pt-48">Loading events...</div>;
        if (error) return <div className="text-center text-red-500 pt-48">{error}</div>;

        switch (currentPage) {
            case 'event':
                return <EventDetailPage 
                            event={selectedEvent} 
                            onPurchase={handlePurchase} 
                            walletConnected={walletConnected}
                            onNavigateBack={handleNavigateBack}
                        />;
            case 'profile':
                return <ProfilePage tickets={ownedTickets} userAddress={userAddress} />;
            case 'home':
            default:
                return <HomePage events={events} onSelectEvent={handleSelectEvent} isLoading={loading} />;
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="gradient-bg">
                <div className="shape1"></div>
                <div className="shape2"></div>
            </div>
            <Header
                walletConnected={walletConnected}
                userAddress={userAddress}
                onConnectWallet={handleConnectWallet}
                onNavigate={handleNavigate}
            />
            <main>
                {renderPage()}
            </main>
            <TransactionModal 
                modalState={modalState}
                setModalState={setModalState}
                purchaseDetails={purchaseDetails}
                onConfirm={handleConfirmPurchase}
            />
        </div>
    );
}

export default App;
