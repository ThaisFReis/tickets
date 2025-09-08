import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConcertList from './ConcertList';
import * as EthersService from '../services/ethers';

// Mock the ethers service
vi.mock('../services/ethers');

describe('ConcertList Integration Test', () => {
  it('fetches and displays events from the smart contract', async () => {
    const mockEvents = [
        {
            eventId: 1n,
            name: 'Live Rock Fest',
            date: BigInt(Math.floor(Date.now() / 1000) + 3600),
            ticketPrice: 100000000000000000n, // 0.1 ETH in wei
            isAssignedSeating: false,
        },
    ];

    const mockContract = {
      getAllEvents: vi.fn().mockResolvedValue(mockEvents),
    };

    EthersService.getContract.mockResolvedValue(mockContract);

    render(<ConcertList />);

    // Check for a loading state initially
    expect(screen.getByText('Loading events...')).toBeInTheDocument();

    // Wait for the component to render the fetched data
    await waitFor(() => {
      expect(screen.getByText('Live Rock Fest')).toBeInTheDocument();
    });

    // Verify that the service and contract methods were called
    expect(EthersService.getContract).toHaveBeenCalled();
    expect(mockContract.getAllEvents).toHaveBeenCalled();
  });
});
