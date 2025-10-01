import React, { useState, useEffect } from 'react';
import { checkAndSwitchNetwork } from '../services/ethers';

const NetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState('checking');
    const [currentNetwork, setCurrentNetwork] = useState('');
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

    const BASE_SEPOLIA_CHAIN_ID = "0x14a34"; // 84532 in hex

    useEffect(() => {
        const checkNetwork = async () => {
            if (!window.ethereum) {
                setNetworkStatus('no-metamask');
                return;
            }

            try {
                const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                setCurrentNetwork(currentChainId);
                
                if (currentChainId === BASE_SEPOLIA_CHAIN_ID) {
                    setIsCorrectNetwork(true);
                    setNetworkStatus('correct');
                } else {
                    setIsCorrectNetwork(false);
                    setNetworkStatus('wrong');
                }
            } catch (error) {
                console.error('Error checking network:', error);
                setNetworkStatus('error');
            }
        };

        checkNetwork();

        // Listen for network changes
        if (window.ethereum) {
            window.ethereum.on('chainChanged', checkNetwork);
            return () => {
                window.ethereum.removeListener('chainChanged', checkNetwork);
            };
        }
    }, []);

    const handleSwitchNetwork = async () => {
        try {
            await checkAndSwitchNetwork();
            // checkNetwork will be called automatically due to chainChanged event
        } catch (error) {
            console.error('Failed to switch network:', error);
        }
    };

    if (networkStatus === 'checking') {
        return (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                <p>Checking network status...</p>
            </div>
        );
    }

    if (networkStatus === 'no-metamask') {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <p>⚠️ MetaMask not detected. Please install MetaMask to use this app.</p>
            </div>
        );
    }

    if (networkStatus === 'correct') {
        return (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>✅ Connected to Base Sepolia testnet</p>
            </div>
        );
    }

    if (networkStatus === 'wrong') {
        return (
            <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 text-purple-900 px-4 py-3 rounded-xl shadow-lg max-w-sm z-50">
                <p className="font-semibold text-sm mb-1">⚠️ Wrong network</p>
                <p className="text-purple-700 text-xs mb-2">Requires Base Sepolia. Current: {currentNetwork}</p>
                <button
                    onClick={handleSwitchNetwork}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-sm w-full"
                >
                    Switch Network
                </button>
            </div>
        );
    }

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>❌ Error checking network status. Please refresh the page.</p>
        </div>
    );
};

export default NetworkStatus;