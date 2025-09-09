import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TicketTypeSelector from './TicketTypeSelector';
import QuantitySelector from './QuantitySelector';
import VenueMap from './VenueMap';
import { buyTicket } from '../services/ethers';
import PurchaseSummary from './PurchaseSummary';

const PurchaseFlow = ({ eventData }) => {
  const [purchaseState, setPurchaseState] = useState({
    step: 1, // 1: Select Type, 2: Select Quantity, 3: Select Seats, 4: Confirm
    selectedTierId: null,
    selectedTierName: '',
    selectedTierPrice: '0',
    quantity: 1,
    selectedSeats: [],
    totalPrice: '0',
    isPurchasing: false,
    error: null,
    purchaseSuccess: false,
  });

  // Dummy data for now - this will be replaced with real contract data
  const mockTiers = [
      { typeId: 1, name: 'VIP', price: '0.5', quantity: 50, sold: 10 },
      { typeId: 2, name: 'General Admission', price: '0.2', quantity: 200, sold: 75 },
  ];

  const mockVenueData = {
    sections: [
      { sectionName: 'VIP', tierId: 1, rows: [{ rowName: 'A', seats: [{ seatNumber: '1', seatId: 101 }, { seatNumber: '2', seatId: 102 }] }] },
      { sectionName: 'GA', tierId: 2, rows: [{ rowName: 'B', seats: [{ seatNumber: '1', seatId: 201 }, { seatNumber: '2', seatId: 202 }] }] },
    ],
  };

  const handleTierSelect = (tier) => {
    setPurchaseState(prevState => ({
      ...prevState,
      step: 2,
      selectedTierId: tier.typeId,
      selectedTierName: tier.name,
      selectedTierPrice: tier.price,
    }));
  };

  const handleQuantityChange = (newQuantity) => {
    setPurchaseState(prevState => ({
      ...prevState,
      quantity: newQuantity,
    }));
  };
  
  const handleSeatSelect = (seatId) => {
    setPurchaseState(prevState => {
      const newSelectedSeats = prevState.selectedSeats.includes(seatId)
        ? prevState.selectedSeats.filter(s => s !== seatId)
        : [...prevState.selectedSeats, seatId];
      return { ...prevState, selectedSeats: newSelectedSeats };
    });
  };

  const handlePurchase = async () => {
    setPurchaseState(prevState => ({ ...prevState, isPurchasing: true, error: null }));
    try {
      const totalPrice = (parseFloat(purchaseState.selectedTierPrice) * purchaseState.quantity).toString();
      await buyTicket(
        eventData.eventId, // Assuming eventData is passed as a prop
        purchaseState.selectedTierId,
        purchaseState.selectedSeats,
        totalPrice
      );
      setPurchaseState(prevState => ({ ...prevState, isPurchasing: false, purchaseSuccess: true }));
    } catch (error) {
      console.error(error);
      setPurchaseState(prevState => ({ ...prevState, isPurchasing: false, error: 'Purchase failed. Please try again.' }));
    }
  };

  const goToNextStep = () => {
    setPurchaseState(prevState => ({ ...prevState, step: prevState.step + 1 }));
  };
  
  const goToPreviousStep = () => {
    setPurchaseState(prevState => ({ ...prevState, step: prevState.step - 1 }));
  };


  if (purchaseState.purchaseSuccess) {
    return <div className="text-green-500 font-bold">Purchase Successful!</div>;
  }

  return (
    <div className="purchase-flow-container p-4">
      {purchaseState.step === 1 && (
        <TicketTypeSelector tiers={mockTiers} onSelectTier={handleTierSelect} />
      )}

      {purchaseState.step === 2 && (
        <div>
          <QuantitySelector 
            quantity={purchaseState.quantity} 
            onQuantityChange={handleQuantityChange}
            maxQuantity={10} // Dummy max quantity
          />
          <button onClick={goToPreviousStep} className="mt-4 mr-2 bg-gray-500 text-white px-4 py-2 rounded">Back</button>
          <button onClick={goToNextStep} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Next</button>
        </div>
      )}

      {purchaseState.step === 3 && (
        <div>
          <VenueMap 
            venueData={mockVenueData}
            soldSeats={[]} // Dummy sold seats
            onSeatSelect={handleSeatSelect}
            selectedTierId={purchaseState.selectedTierId}
            selectedSeats={purchaseState.selectedSeats}
            quantity={purchaseState.quantity}
          />
          <button onClick={goToPreviousStep} className="mt-4 mr-2 bg-gray-500 text-white px-4 py-2 rounded">Back</button>
          <button onClick={goToNextStep} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" disabled={purchaseState.selectedSeats.length !== purchaseState.quantity}>
            Confirm Seats
          </button>
        </div>
      )}

      {purchaseState.step === 4 && (
        <div>
          <PurchaseSummary 
            summary={{
              tierName: purchaseState.selectedTierName,
              quantity: purchaseState.quantity,
              seats: purchaseState.selectedSeats,
              totalPrice: (parseFloat(purchaseState.selectedTierPrice) * purchaseState.quantity).toString(),
            }} 
            onConfirm={handlePurchase}
            isPurchasing={purchaseState.isPurchasing}
          />
          {purchaseState.error && <div className="text-red-500 mt-2">{purchaseState.error}</div>}
          <button onClick={goToPreviousStep} className="mt-4 mr-2 btn-secondary" disabled={purchaseState.isPurchasing}>Back</button>
        </div>
      )}
    </div>
  );
};

PurchaseFlow.propTypes = {
  eventData: PropTypes.object, // Not used yet, but will be needed
};

export default PurchaseFlow;
