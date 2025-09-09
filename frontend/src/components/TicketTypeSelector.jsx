import React from 'react';
import PropTypes from 'prop-types';

const TicketTypeSelector = ({ tiers, onSelectTier }) => {
  return (
    <div className="ticket-type-selector">
      <h3 className="text-lg font-bold mb-2">Select Ticket Type</h3>
      {tiers.map((tier) => (
        <div key={tier.typeId} className="tier-item border p-4 mb-2 rounded">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{tier.name}</p>
              <p className="text-sm text-gray-600">Price: {tier.price}</p>
              <p className="text-sm text-gray-600">Available: {tier.quantity - tier.sold}</p>
            </div>
            <button
              onClick={() => onSelectTier(tier)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              aria-label={`Select ${tier.name}`}
            >
              Select
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

TicketTypeSelector.propTypes = {
  tiers: PropTypes.arrayOf(
    PropTypes.shape({
      typeId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      sold: PropTypes.number.isRequired,
    })
  ).isRequired,
  onSelectTier: PropTypes.func.isRequired,
};

export default TicketTypeSelector;
