import React from 'react';
import PropTypes from 'prop-types';
import { WalletIcon } from './Icons';

const Header = ({ walletConnected, userAddress, onConnectWallet, onNavigate }) => {
    return (
        <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center text-white">
                <h1 className="text-2xl font-bold text-violet-400 cursor-pointer" onClick={() => onNavigate('home')}>TicketChain</h1>
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="hover:text-violet-400" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>Eventos</a>
                    <a href="#" className="hover:text-violet-400" onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}>Meus Ingressos</a>
                </nav>
                <button
                    onClick={onConnectWallet}
                    className="flex items-center bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    <WalletIcon />
                    {walletConnected ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}` : 'Conectar Carteira'}
                </button>
            </div>
        </header>
    );
};

Header.propTypes = {
    walletConnected: PropTypes.bool,
    userAddress: PropTypes.string,
    onConnectWallet: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
};

export default Header;