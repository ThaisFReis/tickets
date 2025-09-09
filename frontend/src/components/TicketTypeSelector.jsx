import React from 'react';
import PropTypes from 'prop-types';

const TicketTypeSelector = ({ tiers, selectedTier, onSelectTier }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {tiers.map((tier) => (
        <button
          key={tier.tierId}
          onClick={() => onSelectTier(tier)}
          className={`normal-bnt p-3 rounded-xl text-center font-semibold uppercase transition-colors text-sm lg:text-base ${
            selectedTier?.tierId === tier.tierId
              ? 'border-2 border-primary bg-primary/20'
              : 'border border-border hover:bg-primary/10'
          }`}
        >
          <span>{tier.name}</span>
        </button>
      ))}
    </div>
  );
};

TicketTypeSelector.propTypes = {
  tiers: PropTypes.arrayOf(
    PropTypes.shape({
      tierId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedTier: PropTypes.object,
  onSelectTier: PropTypes.func.isRequired,
};

export default TicketTypeSelector;
