import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import TransactionModal from './components/TransactionModal';
import Footer from './components/Footer';
import { fetchAllEvents, connectWallet, purchaseTickets, fetchUserTickets } from './services/ethers';
import { eventsMetadata } from './events-metadata';
import './index.css';
import EventCardSkeleton from './components/EventCardSkeleton';

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
                
                const eventsWithDetails = fetchedEvents.map(event => {
                    const metadata = eventsMetadata.find(m => m.name === event.name) || {};
                    const dateObj = new Date(Number(event.date) * 1000);

                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const localDateString = `${year}-${month}-${day}`;

                    return {
                        ...event,
                        id: Number(event.eventId),
                        date: dateObj.toISOString(),
                        localDate: localDateString,
                        ...metadata,
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

    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                const address = accounts[0];
                setUserAddress(address);
                setWalletConnected(true);
            } else {
                setWalletConnected(false);
                setUserAddress('');
                setOwnedTickets([]);
            }
        };

        const handleChainChanged = () => {
            window.location.reload();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            const checkConnection = async () => {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        handleAccountsChanged(accounts);
                    }
                } catch (error) {
                    console.error("Error checking for wallet connection:", error);
                }
            };
            checkConnection();
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    useEffect(() => {
        const loadUserTickets = async () => {
            if (userAddress && events.length > 0) {
                try {
                    const tickets = await fetchUserTickets(userAddress);
                    const ticketsWithMetadata = tickets.map(ticket => {
                        const event = events.find(e => e.id === Number(ticket.eventId));
                        if (!event) return null;
                        return { 
                            ...ticket, 
                            eventName: event.name, 
                            eventDate: event.date, 
                            eventImage: event.image, 
                            venue: event.location 
                        };
                    }).filter(Boolean);
                    setOwnedTickets(ticketsWithMetadata);
                } catch (error) {
                    console.error("Failed to fetch user tickets:", error);
                }
            } else {
                setOwnedTickets([]);
            }
        };
        loadUserTickets();
    }, [userAddress, events]);

    const handleConnectWallet = async () => {
        if (walletConnected) {
            setWalletConnected(false);
            setUserAddress('');
            setOwnedTickets([]);
        } else {
            try {
                const { address } = await connectWallet();
                setUserAddress(address);
                setWalletConnected(true);
            } catch (error) {
                console.error("Failed to connect wallet:", error);
                alert("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.");
            }
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
        setSelectedEvent(null);
        window.scrollTo(0, 0);
    };

    const handleNavigateBack = () => {
        setCurrentPage('home');
        setSelectedEvent(null);
    }

    const handlePurchase = (tier, quantity, totalPrice) => {
        setPurchaseDetails({ 
            event: selectedEvent, 
            tier,
            quantity,
            totalPrice
        });
        setModalState('confirm');
    };

    const handleConfirmPurchase = async () => {
        if (!purchaseDetails) return;
        setModalState('processing');
        try {
            const { event, tier, quantity, totalPrice } = purchaseDetails;
            
            await purchaseTickets(event.id, tier, quantity, totalPrice);

            setModalState('success');

            const updatedTickets = await fetchUserTickets(userAddress);
             const ticketsWithMetadata = updatedTickets.map(ticket => {
                const event = events.find(e => e.id === Number(ticket.eventId));
                if (!event) return null;
                return { 
                    ...ticket, 
                    eventName: event.name, 
                    eventDate: event.date, 
                    eventImage: event.image, 
                    venue: event.location 
                };
            }).filter(Boolean);
            setOwnedTickets(ticketsWithMetadata);
            
            setTimeout(() => {
                setModalState('closed');
                setCurrentPage('profile');
                window.scrollTo(0, 0);
            }, 3000);
        } catch (error) {
            console.error("Purchase failed:", error);
            setModalState('error');
        }
    };
    
    const renderPage = () => {
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
        <div className="bg-background min-h-screen flex flex-col">
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
            <main className="flex-grow">
                {renderPage()}
            </main>
            <TransactionModal 
                modalState={modalState}
                setModalState={setModalState}
                purchaseDetails={purchaseDetails}
                onConfirm={handleConfirmPurchase}
            />
            <Footer />
        </div>
    );
}

export default App;
