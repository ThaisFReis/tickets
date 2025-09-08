import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VenueMap from './VenueMap';

describe('VenueMap', () => {
  it('renders an interactive seat map and handles seat selection', () => {
    const mockVenueData = {
      sections: [
        {
          sectionName: 'A',
          rows: [
            {
              rowName: '1',
              seats: [
                { seatNumber: '1', seatId: 10101 },
                { seatNumber: '2', seatId: 10102 },
              ],
            },
          ],
        },
      ],
    };

    const mockSoldSeats = [10102];
    const onSeatSelect = vi.fn();

    render(
      <VenueMap
        venueData={mockVenueData}
        soldSeats={mockSoldSeats}
        onSeatSelect={onSeatSelect}
      />
    );

    // Check for rendered seats
    const availableSeat = screen.getByText('A1-1');
    const soldSeat = screen.getByText('A1-2');
    
    expect(availableSeat).toBeInTheDocument();
    expect(soldSeat).toBeInTheDocument();
    expect(soldSeat).toHaveClass('sold'); // Assuming a 'sold' class for styling

    // Simulate clicking an available seat
    fireEvent.click(availableSeat);
    expect(onSeatSelect).toHaveBeenCalledWith(10101);

    // Simulate clicking a sold seat
    fireEvent.click(soldSeat);
    // The handler should not be called again for a sold seat
    expect(onSeatSelect).toHaveBeenCalledTimes(1);
  });
});
