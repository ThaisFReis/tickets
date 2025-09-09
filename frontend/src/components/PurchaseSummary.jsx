import React from 'react';
import PropTypes from 'prop-types';

const PurchaseSummary = ({ summary, onConfirm, isPurchasing }) => {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-75 flex items-center justify-center">
      <div className="bg-surface rounded-lg shadow-xl border border-accent-secondary p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-center text-text-primary">Confirm Your Purchase</h3>
        <div className="space-y-2 text-text-primary">
          <div className="flex justify-between">
            <span className="font-semibold text-text-secondary">Ticket Type:</span>
            <span>{summary.tierName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-text-secondary">Quantity:</span>
            <span>{summary.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-text-secondary">Seats:</span>
            <span>{summary.seats.join(', ')}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <span className="font-bold">Total Price:</span>
            <span className="font-bold">{summary.totalPrice} ETH</span>
          </div>
        </div>
        <button 
          onClick={onConfirm}
          disabled={isPurchasing}
          className="w-full mt-6 btn-primary"
        >
          {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
        </button>
      </div>
    </div>
  );
};

PurchaseSummary.propTypes = {
  summary: PropTypes.shape({
    tierName: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    seats: PropTypes.arrayOf(PropTypes.number).isRequired,
    totalPrice: PropTypes.string.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  isPurchasing: PropTypes.bool.isRequired,
};

export default PurchaseSummary;
