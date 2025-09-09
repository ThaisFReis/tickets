import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, CheckCircleIcon, XCircleIcon } from './Icons';

const TransactionModal = ({ modalState, setModalState, purchaseDetails, onConfirm }) => {
    if (modalState === 'closed') return null;

    const ModalContent = () => {
        switch (modalState) {
            case 'confirm':
                return (
                    <>
                        <h3 className="text-xl font-bold text-white mb-2">Confirmar Compra</h3>
                        <p className="text-gray-400 mb-4">Você está prestes a comprar {purchaseDetails.seats.length} ingresso(s) para o evento.</p>
                        <div className="bg-gray-700 p-4 rounded-lg mb-4 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400">Assentos:</span>
                                <span className="font-mono text-white">{purchaseDetails.seats.map(s => s.seatId).join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total:</span>
                                <span className="font-bold text-violet-400">{purchaseDetails.totalPrice} ETH</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Uma taxa de rede (gás) será aplicada para processar a transação na blockchain.</p>
                        <button onClick={onConfirm} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Confirmar na Carteira
                        </button>
                    </>
                );
            case 'processing':
                return (
                    <>
                        <Spinner />
                        <h3 className="text-xl font-bold text-white mt-4">A processar Transação...</h3>
                        <p className="text-gray-400 mt-2">A aguardar confirmação da blockchain. Isto pode levar alguns instantes.</p>
                         <a href="#" onClick={e=>e.preventDefault()} className="text-sm text-blue-400 hover:underline mt-4 block">Ver no Etherscan</a>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircleIcon />
                        <h3 className="text-xl font-bold text-white mt-4">Compra Concluída!</h3>
                        <p className="text-gray-400 mt-2">Os seus ingressos NFT foram criados e enviados para a sua carteira.</p>
                        <button onClick={() => setModalState('closed')} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Fechar
                        </button>
                    </>
                );
            case 'failed':
                 return (
                    <>
                        <XCircleIcon />
                        <h3 className="text-xl font-bold text-white mt-4">A Transação Falhou</h3>
                        <p className="text-gray-400 mt-2">Os seus fundos não foram debitados. Por favor, tente novamente.</p>
                         <button onClick={() => setModalState('closed')} className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                            Tentar Novamente
                        </button>
                    </>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
                <ModalContent />
            </div>
        </div>
    );
};

TransactionModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    setModalState: PropTypes.func.isRequired,
    purchaseDetails: PropTypes.object,
    onConfirm: PropTypes.func.isRequired,
};

export default TransactionModal;