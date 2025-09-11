import React from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

const PurchaseSummary = ({ totalPrice, onPurchase, walletConnected }) => {
  
  const formatPrice = (priceInWeiString) => {
    if (!priceInWeiString || priceInWeiString === "0") return "0.0";
    try {
      return ethers.formatEther(priceInWeiString);
    } catch (e) {
      console.error("Error formatting price:", e);
      return "0.0";
    }
  };

  const isButtonDisabled = !walletConnected || totalPrice === "0";

  return (
    <div className='flex flex-col'>
      <div className="border-t border-border/50 my-6"></div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-muted-foreground uppercase font-semibold">Total</span>
        <span className="text-3xl font-bold text-glow">{formatPrice(totalPrice)} ETH</span>
      </div>
      <button 
        onClick={onPurchase}
        disabled={isButtonDisabled}
        className="y2k-btn w-4/5 py-4 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
      >
        {walletConnected ? 'Buy Tickets' : 'Connect Wallet'}
      </button>
    </div>
  );
};

PurchaseSummary.propTypes = {
  totalPrice: PropTypes.string.isRequired,
  onPurchase: PropTypes.func.isRequired,
  walletConnected: PropTypes.bool.isRequired,
};

export default PurchaseSummary;
