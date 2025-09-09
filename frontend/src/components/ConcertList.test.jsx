import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConcertList from './ConcertList';
import * as EthersService from '../services/ethers';

vi.mock('../services/ethers');

describe('ConcertList', () => {
  it('fetches and displays a list of concerts', async () => {
    const mockEvents = [
      { eventId: 1n, name: 'Rock Fest 2025', date: BigInt(Math.floor(Date.now() / 1000) + 86400) },
      { eventId: 2n, name: 'Jazz Night', date: BigInt(Math.floor(Date.now() / 1000) + 172800) },
    ];

    EthersService.fetchAllEvents.mockResolvedValue(mockEvents);

    render(<ConcertList />);

    // Wait for events to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText('Rock Fest 2025')).toBeInTheDocument();
      expect(screen.getByText('Jazz Night')).toBeInTheDocument();
    });

    expect(EthersService.fetchAllEvents).toHaveBeenCalled();
  });
});
