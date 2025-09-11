import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PurchaseFlow from '../../components/PurchaseFlow'; // Test the flow directly
import * as EthersService from '../../services/ethers';

// Mock the ethers service
vi.mock('../../services/ethers');

describe('Multi-Step Ticket Purchase Integration Test', () => {
  it('allows a user to complete the full purchase flow', async () => {
    // Mock the buyTicket function to simulate a successful transaction
    EthersService.buyTicket.mockResolvedValue({
      wait: () => Promise.resolve(),
    });

    const mockEvent = { eventId: 1 }; // Pass a mock eventId

    render(<PurchaseFlow eventData={mockEvent} />);

    // Step 1: Select Ticket Type
    // The component uses mock data, so we can directly interact with it.
    const vipSelectButton = screen.getByRole('button', { name: /Select VIP/i });
    fireEvent.click(vipSelectButton);

    // Step 2: Select Quantity
    const incrementButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(incrementButton); // Increase quantity to 2
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // Step 3: Select Seats
    const seat1 = screen.getByText('VIPA-1');
    const seat2 = screen.getByText('VIPA-2');
    fireEvent.click(seat1);
    fireEvent.click(seat2);
    const confirmSeatsButton = screen.getByRole('button', { name: /Confirm Seats/i });
    fireEvent.click(confirmSeatsButton);

    // Step 4: Confirm Purchase
    // Verify the summary is correct
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('101, 102')).toBeInTheDocument();
    expect(screen.getByText('1 ETH')).toBeInTheDocument(); // 2 * 0.5

    // Click the final confirm button
    const confirmPurchaseButton = screen.getByRole('button', { name: /Confirm Purchase/i });
    fireEvent.click(confirmPurchaseButton);

    // Wait for the purchase to complete and check for success message
    await waitFor(() => {
      expect(EthersService.buyTicket).toHaveBeenCalledWith(
        1,      // eventId
        1,      // typeId for VIP
        [101, 102], // seatIds
        '1'     // totalPrice
      );
    });

    expect(screen.getByText('Purchase Successful!')).toBeInTheDocument();
  });
});
