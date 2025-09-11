import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PurchaseSummary from './PurchaseSummary';

describe('PurchaseSummary', () => {
  const mockSummaryData = {
    tierName: 'VIP',
    quantity: 2,
    seats: [10, 11],
    totalPrice: '1.0', // Assuming price is in ETH as a string
  };

  it('renders the purchase summary details correctly', () => {
    render(<PurchaseSummary summary={mockSummaryData} />);

    // Check that all the details are displayed
    expect(screen.getByText('Confirm Your Purchase')).toBeInTheDocument();
    expect(screen.getByText('Ticket Type:')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Seats:')).toBeInTheDocument();
    expect(screen.getByText('10, 11')).toBeInTheDocument();
    expect(screen.getByText('Total Price:')).toBeInTheDocument();
    expect(screen.getByText('1.0 ETH')).toBeInTheDocument();
  });

  it('displays a confirmation button', () => {
    render(<PurchaseSummary summary={mockSummaryData} />);
    
    const confirmButton = screen.getByRole('button', { name: /Confirm Purchase/i });
    expect(confirmButton).toBeInTheDocument();
  });
});
