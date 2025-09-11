import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity, maxQuantity }) => {
  const handleDecrement = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    setQuantity(q => Math.min(maxQuantity, q + 1));
  };

  const isMax = quantity >= maxQuantity;

  return (
    <div>
      <label className="font-semibold mb-2 block uppercase text-sm tracking-wider">Quantity</label>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrement}
          className="normal-bnt p-3 border border-border rounded-full transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
        <button 
          onClick={handleIncrement}
          disabled={isMax}
          className="normal-bnt p-3 border border-border rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </button>
      </div>
      {isMax && (
        <p className="text-destructive text-xs mt-2">
          No more tickets available for this tier.
        </p>
      )}
    </div>
  );
};

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  maxQuantity: PropTypes.number.isRequired,
};

export default QuantitySelector;
