import React from 'react';
import PropTypes from 'prop-types';
import { Hexagon } from './Icons'; // Assuming you have a Hexagon icon

const Header = ({ walletConnected, userAddress, onConnectWallet, onNavigate }) => {
    return (
        <header className="bg-transparent fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => onNavigate('home')}
                    >
                        <Hexagon className="w-8 h-8 text-secondary animate-spin" style={{ animationDuration: '10s' }} />
                        <span className="text-2xl font-extrabold uppercase tracking-widest">TicketChain</span>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
                            className="px-4 py-2 text-sm font-semibold uppercase hover:text-secondary transition-colors"
                        >
                            Events
                        </a>
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onNavigate('profile'); }}
                            className="px-4 py-2 text-sm font-semibold uppercase hover:text-secondary transition-colors"
                        >
                            My Tickets
                        </a>
                        <button 
                            onClick={onConnectWallet}
                            className="y2k-btn px-6 py-3 text-xs flex items-center gap-2"
                        >
                            <span>
                                {walletConnected ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}` : 'Connect Wallet'}
                            </span>
                        </button>
                    </div>
                </div>
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