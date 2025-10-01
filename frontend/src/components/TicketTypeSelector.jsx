import React from 'react';
import PropTypes from 'prop-types';

const TicketTypeSelector = ({ tiers, selectedTier, onSelectTier }) => {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-2 gap-3 mb-6">
      {tiers.map((tier) => {
        const isSoldOut = !tier.totalQuantity || tier.sold >= tier.totalQuantity;
        return (
          <button
            key={tier.tierId}
            onClick={() => !isSoldOut && onSelectTier(tier)}
            disabled={isSoldOut}
            className={`normal-bnt p-4 lg:p-3 text-[10px] rounded-xl lg:rounded-xl text-center font-semibold uppercase transition-colors lg:text-base ${
              selectedTier?.tierId === tier.tierId
                ? 'y2k-btn !rounded-xl'
                : 'border border-border'
            } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{tier.name}</span>
            {isSoldOut && <span className="text-xs block">(Sold Out)</span>}
          </button>
        );
      })}
    </div>
  );
};

TicketTypeSelector.propTypes = {
  tiers: PropTypes.arrayOf(
    PropTypes.shape({
      tierId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sold: PropTypes.number.isRequired,
      totalQuantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedTier: PropTypes.object,
  onSelectTier: PropTypes.func.isRequired,
};

export default TicketTypeSelector;
