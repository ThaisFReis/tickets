import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../App'; // Using App as the main orchestrator
import * as EthersService from '../../services/ethers';

// Mock the ethers service
vi.mock('../../services/ethers');

describe('UserProfile Integration Test', () => {
  it('fetches and displays the user\'s upcoming and past tickets', async () => {
    const mockSigner = {
      getAddress: vi.fn().mockResolvedValue('0x1234567890123456789012345678901234567890'),
    };

    const mockUpcomingEvent = {
        name: 'Future Fest',
        date: BigInt(Math.floor(Date.now() / 1000) + 86400), // 1 day from now
    };
    const mockPastEvent = {
        name: 'Classic Rock Night',
        date: BigInt(Math.floor(Date.now() / 1000) - 86400), // 1 day ago
    };

    const mockContract = {
      getTicketsOfOwner: vi.fn().mockResolvedValue([1n, 2n]),
      tickets: vi.fn()
        .mockResolvedValueOnce({ eventId: 1n }) // Ticket 1
        .mockResolvedValueOnce({ eventId: 2n }), // Ticket 2
      events: vi.fn()
        .mockResolvedValueOnce(mockUpcomingEvent) // Event for Ticket 1
        .mockResolvedValueOnce(mockPastEvent),   // Event for Ticket 2
    };

    EthersService.getSigner.mockResolvedValue(mockSigner);
    EthersService.getContract.mockResolvedValue(mockContract);

    render(<App />);

    // Navigate to the profile page (assuming a button/link exists)
    const profileLink = screen.getByRole('link', { name: /my tickets/i });
    fireEvent.click(profileLink);

    // Wait for tickets to be displayed
    await waitFor(() => {
      expect(screen.getByText('Future Fest')).toBeInTheDocument();
      expect(screen.getByText('Classic Rock Night')).toBeInTheDocument();
    });

    // Check if they are in the correct sections
    const upcomingSection = screen.getByText('Upcoming Events').closest('section');
    const pastSection = screen.getByText('Past Events').closest('section');

    expect(within(upcomingSection).getByText('Future Fest')).toBeInTheDocument();
    expect(within(pastSection).getByText('Classic Rock Night')).toBeInTheDocument();
  });
});
