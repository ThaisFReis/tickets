import React from 'react';
import PropTypes from 'prop-types';

const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity }) => {
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className="quantity-selector flex items-center">
      <h3 className="text-lg font-bold mr-4">Select Quantity</h3>
      <button
        onClick={handleDecrement}
        disabled={quantity <= 1}
        className="bg-gray-300 text-black px-3 py-1 rounded disabled:opacity-50"
        aria-label="-"
      >
        -
      </button>
      <span className="mx-4 text-lg">{quantity}</span>
      <button
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="bg-gray-300 text-black px-3 py-1 rounded disabled:opacity-50"
        aria-label="+"
      >
        +
      </button>
    </div>
  );
};

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  maxQuantity: PropTypes.number.isRequired,
};

export default QuantitySelector;
