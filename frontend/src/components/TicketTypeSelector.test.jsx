import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TicketTypeSelector from './TicketTypeSelector';

describe('TicketTypeSelector', () => {
  const mockTiers = [
    { typeId: 1, name: 'VIP', price: '100', quantity: 50, sold: 10 },
    { typeId: 2, name: 'General Admission', price: '50', quantity: 200, sold: 75 },
  ];

  it('renders a list of ticket tiers with their details', () => {
    render(<TicketTypeSelector tiers={mockTiers} onSelectTier={() => {}} />);

    // Check if VIP tier details are rendered
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText(/Price: 100/)).toBeInTheDocument();
    expect(screen.getByText(/Available: 40/)).toBeInTheDocument(); // 50 - 10

    // Check if General Admission tier details are rendered
    expect(screen.getByText('General Admission')).toBeInTheDocument();
    expect(screen.getByText(/Price: 50/)).toBeInTheDocument();
    expect(screen.getByText(/Available: 125/)).toBeInTheDocument(); // 200 - 75
  });

  it('calls the onSelectTier handler with the correct tier when a tier is selected', () => {
    const handleSelectTier = vi.fn();
    render(<TicketTypeSelector tiers={mockTiers} onSelectTier={handleSelectTier} />);

    // Find the select button for the VIP tier and click it
    const vipSelectButton = screen.getByRole('button', { name: /Select VIP/i });
    fireEvent.click(vipSelectButton);

    // Expect the handler to have been called with the VIP tier object
    expect(handleSelectTier).toHaveBeenCalledTimes(1);
    expect(handleSelectTier).toHaveBeenCalledWith(mockTiers[0]);
  });
});
