import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuantitySelector from './QuantitySelector';

describe('QuantitySelector', () => {
  it('renders with initial quantity and allows incrementing and decrementing', () => {
    const handleQuantityChange = vi.fn();
    render(
      <QuantitySelector
        quantity={2}
        onQuantityChange={handleQuantityChange}
        maxQuantity={5}
      />
    );

    // Check initial quantity
    expect(screen.getByText('2')).toBeInTheDocument();

    // Increment
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    expect(handleQuantityChange).toHaveBeenCalledWith(3);

    // Decrement
    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decrementButton);
    expect(handleQuantityChange).toHaveBeenCalledWith(1);
  });

  it('does not allow quantity to go below 1', () => {
    const handleQuantityChange = vi.fn();
    render(
      <QuantitySelector
        quantity={1}
        onQuantityChange={handleQuantityChange}
        maxQuantity={5}
      />
    );

    const decrementButton = screen.getByRole('button', { name: '-' });
    fireEvent.click(decrementButton);
    expect(handleQuantityChange).not.toHaveBeenCalled();
  });

  it('does not allow quantity to exceed maxQuantity', () => {
    const handleQuantityChange = vi.fn();
    render(
      <QuantitySelector
        quantity={5}
        onQuantityChange={handleQuantityChange}
        maxQuantity={5}
      />
    );

    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton);
    expect(handleQuantityChange).not.toHaveBeenCalled();
  });
});
