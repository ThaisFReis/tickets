import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App'; // Using App as the main orchestrator
import * as EthersService from '../../services/ethers';

// Mock the ethers service
vi.mock('../../services/ethers');

describe('Ticket Purchase Integration Test', () => {
  it('handles the purchase of a general admission ticket', async () => {
    const mockGAEvent = {
        eventId: 1n,
        name: 'GA Rock Fest',
        date: BigInt(Math.floor(Date.now() / 1000) + 7200),
        ticketPrice: 100000000000000000n,
        isAssignedSeating: false,
        totalSupply: 100n,
    };

    const mockContract = {
      getAllEvents: vi.fn().mockResolvedValue([mockGAEvent]),
      buyTicket: vi.fn().mockResolvedValue({
        wait: () => Promise.resolve(), // Mock the wait() function for the transaction
      }),
    };

    EthersService.getContract.mockResolvedValue(mockContract);

    render(<App />);

    // Wait for the event to be displayed
    await waitFor(() => {
      expect(screen.getByText('GA Rock Fest')).toBeInTheDocument();
    });

    // Simulate clicking the "Buy Ticket" button
    const buyButton = screen.getByRole('button', { name: /buy ticket/i });
    fireEvent.click(buyButton);

    // Wait for the transaction to be "confirmed" and check the result
    await waitFor(() => {
      expect(mockContract.buyTicket).toHaveBeenCalledWith(1n, 0, { value: mockGAEvent.ticketPrice });
    });
    
    expect(screen.getByText(/ticket purchased successfully/i)).toBeInTheDocument();
  });
});
