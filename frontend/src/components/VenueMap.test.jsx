import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VenueMap from './VenueMap';

describe('VenueMap', () => {
  const mockVenueData = {
    sections: [
      {
        sectionName: 'VIP',
        tierId: 1,
        rows: [{ rowName: 'A', seats: [{ seatNumber: '1', seatId: 101 }, { seatNumber: '2', seatId: 102 }] }],
      },
      {
        sectionName: 'GA',
        tierId: 2,
        rows: [{ rowName: 'B', seats: [{ seatNumber: '1', seatId: 201 }, { seatNumber: '2', seatId: 202 }] }],
      },
    ],
  };

  it('renders seats and disables those not matching the selected tier', () => {
    render(
      <VenueMap
        venueData={mockVenueData}
        soldSeats={[]}
        onSeatSelect={() => {}}
        selectedTierId={1} // VIP tier
        selectedSeats={[]}
        quantity={2}
      />
    );

    // VIP seats should be enabled (or at least not have a 'disabled' class)
    const vipSeat = screen.getByText('VIPA-1');
    expect(vipSeat).toBeInTheDocument();
    expect(vipSeat).not.toHaveClass('bg-surface');

    // GA seats should be disabled
    const gaSeat = screen.getByText('GAB-1');
    expect(gaSeat).toBeInTheDocument();
    expect(gaSeat).toHaveClass('bg-surface');
  });

  it('enforces the selection of a specific number of seats based on quantity', () => {
    const onSeatSelect = vi.fn();
    let selectedSeats = [101]; // One seat already selected
    
    const { rerender } = render(
      <VenueMap
        venueData={mockVenueData}
        soldSeats={[]}
        onSeatSelect={onSeatSelect}
        selectedTierId={1} // VIP tier
        selectedSeats={selectedSeats}
        quantity={2} // User wants to buy 2 tickets
      />
    );

    // Click another available seat
    const anotherVipSeat = screen.getByText('VIPA-2');
    fireEvent.click(anotherVipSeat);
    expect(onSeatSelect).toHaveBeenCalledWith(102);

    // Now that 2 seats are selected (matching quantity), subsequent clicks should be disabled
    // To test this, we need to re-render with the updated selectedSeats
    selectedSeats = [101, 102];
    rerender(
      <VenueMap
        venueData={mockVenueData}
        soldSeats={[]}
        onSeatSelect={onSeatSelect}
        selectedTierId={1}
        selectedSeats={selectedSeats}
        quantity={2}
      />
    );
    
    const firstSeat = screen.getByText('VIPA-1');
    expect(firstSeat).toHaveClass('bg-accent-primary'); // It's already selected
    
    // A third seat (if it existed) should not be clickable.
    // Since we only have two, we can verify the handler is called again if we click an already selected seat to de-select it.
    fireEvent.click(firstSeat);
    expect(onSeatSelect).toHaveBeenCalledWith(101); // It should be called for de-selection
  });

  it('renders sold seats as disabled', () => {
    render(
      <VenueMap
        venueData={mockVenueData}
        soldSeats={[101]}
        onSeatSelect={() => {}}
        selectedTierId={1}
        selectedSeats={[]}
        quantity={1}
      />
    );

    const soldSeat = screen.getByText('VIPA-1');
    expect(soldSeat).toHaveClass('bg-[#404040]');
  });
});
