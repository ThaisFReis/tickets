import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../../App';
import * as EthersService from '../../services/ethers';
import { vi } from 'vitest';

// Mock the ethers service to prevent contract calls during snapshot testing
vi.mock('../../services/ethers');

describe('Spotlight Theme Snapshot Test', () => {
  it('renders the application with the new Spotlight theme', async () => {
    // Mock the event fetching to provide consistent data
    const mockEvents = [
      { eventId: 1n, name: 'Rock Fest 2025', date: BigInt(Math.floor(Date.now() / 1000) + 86400) },
    ];
    EthersService.fetchAllEvents.mockResolvedValue(mockEvents);

    const { asFragment } = render(<App />);
    
    // This will create a snapshot of the App component's DOM structure and styles
    // The first run will create the snapshot file. Subsequent runs will compare against it.
    expect(asFragment()).toMatchSnapshot();
  });
});
