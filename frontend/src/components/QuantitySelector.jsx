import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Minus } from 'lucide-react';

const QuantitySelector = ({ quantity, setQuantity }) => {
  const handleDecrement = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    // Assuming a max quantity of 10 for now
    setQuantity(q => Math.min(10, q + 1));
  };

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
          className="normal-bnt p-3 border border-border rounded-full transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default QuantitySelector;
