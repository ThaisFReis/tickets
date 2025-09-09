import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from '../pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import ProfilePage from './pages/ProfilePage';
import TransactionModal from './components/TransactionModal';
import './index.css';

// Importa a função de busca de eventos
import { fetchAllEvents, connectWallet as apiConnectWallet, getTicketsOfOwner } from './services/ethers.js';

function App() {
    // Estado para os eventos reais
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState('home');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [ownedTickets, setOwnedTickets] = useState([]);
    
    const [modalState, setModalState] = useState('closed');
    const [purchaseDetails, setPurchaseDetails] = useState(null);

    // useEffect para buscar os eventos do contrato quando o app carregar
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setIsLoading(true);
                const fetchedEvents = await fetchAllEvents();
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to load events from contract:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    const handleConnectWallet = async () => {
        if (walletConnected) {
            setWalletConnected(false);
            setUserAddress('');
            setOwnedTickets([]);
        } else {
            const address = await apiConnectWallet();
            if (address) {
                setWalletConnected(true);
                setUserAddress(address);
                // Busca os ingressos do usuário após conectar
                const userTickets = await getTicketsOfOwner(address);
                setOwnedTickets(userTickets);
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
        window.scrollTo(0, 0);
    };

    const handlePurchase = (seats, totalPrice) => {
        setPurchaseDetails({ event: selectedEvent, seats, totalPrice });
        setModalState('confirm');
    };

    const handleConfirmPurchase = () => {
        setModalState('processing');
        // A lógica de compra real seria chamada aqui usando ethers.js
        setTimeout(() => {
            // ... simulação de compra ...
            setModalState('success');
            setTimeout(() => {
                setModalState('closed');
                setCurrentPage('profile');
                window.scrollTo(0, 0);
            }, 3000);
        }, 3000);
    };
    
    const renderPage = () => {
        switch (currentPage) {
            case 'event':
                return <EventDetailPage event={selectedEvent} onPurchase={handlePurchase} walletConnected={walletConnected}/>;
            case 'profile':
                return <ProfilePage tickets={ownedTickets}/>;
            case 'home':
            default:
                // CORREÇÃO: Passando a lista de eventos reais para a HomePage
                return <HomePage events={events} onSelectEvent={handleSelectEvent} isLoading={isLoading} />;
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen">
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