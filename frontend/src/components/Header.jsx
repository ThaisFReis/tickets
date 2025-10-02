import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Hexagon, Menu, X } from 'lucide-react';

const Header = ({ walletConnected, userAddress, onConnectWallet, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTextVisible, setIsTextVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTextVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleNavClick = (page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-[#010408e1] fixed top-0 left-0 right-0 z-40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleNavClick('home')}
                        onMouseEnter={() => setIsTextVisible(true)}
                        onMouseLeave={() => setIsTextVisible(false)}
                    >
                        <Hexagon className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                        <div className="overflow-hidden">
                            <span className={`block whitespace-nowrap text-xl sm:text-2xl font-extrabold uppercase tracking-widest transition-all duration-1000 ease-out ${isTextVisible ? 'max-w-xs' : 'max-w-0'}`}>
                                EventHorizon
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="px-3 py-1 text-xs font-bold uppercase bg-yellow-500 text-black rounded-full">
                            Testnet
                        </span>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                            className="px-4 py-2 text-sm font-semibold uppercase hover:text-primary transition-colors"
                        >
                            Events
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick('profile'); }}
                            className="px-4 py-2 text-sm font-semibold uppercase hover:text-primary transition-colors"
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-background/90 backdrop-blur-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                        <span className="px-3 py-1 text-xs font-bold uppercase bg-yellow-500 text-black rounded-full mb-2">
                            Testnet
                        </span>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                            className="block px-3 py-2 rounded-md text-base font-medium uppercase hover:text-primary"
                        >
                            Events
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleNavClick('profile'); }}
                            className="block px-3 py-2 rounded-md text-base font-medium uppercase hover:text-primary"
                        >
                            My Tickets
                        </a>
                        <button
                            onClick={onConnectWallet}
                            className="y2k-btn px-6 py-3 text-sm w-full mt-4"
                        >
                            {walletConnected ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}` : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            )}
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