import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TicketTypeSelector from './TicketTypeSelector';
import QuantitySelector from './QuantitySelector';
import VenueMap from './VenueMap';
import { purchaseTickets, getEventTiers } from '../services/ethers';
import PurchaseSummary from './PurchaseSummary';

const PurchaseFlow = ({ eventData }) => {
  const [purchaseState, setPurchaseState] = useState({
    step: 1, // 1: Select Type, 2: Select Quantity, 3: Select Seats, 4: Confirm
    selectedTier: null, // Store the full tier object
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

  const [realTiers, setRealTiers] = useState([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);
  const [tierError, setTierError] = useState(null);

  // Load real tier data from contract
  useEffect(() => {
    const loadTiers = async () => {
      // Use eventId from eventData, or fallback to 1 if not provided
      const eventId = eventData?.eventId || 1;
      
      try {
        setIsLoadingTiers(true);
        setTierError(null);
        console.log('Loading tiers for event:', eventId);
        
        const tiers = await getEventTiers(eventId);
        console.log('Loaded tiers:', tiers);
        setRealTiers(tiers);
      } catch (error) {
        console.error('Error loading tiers:', error);
        setTierError(error.message);
        // If loading fails, don't block the UI - let it use mock data
      } finally {
        setIsLoadingTiers(false);
      }
    };

    loadTiers();
  }, [eventData]);

  // Use real tiers if available, otherwise fallback to mock data
  const tiersToUse = realTiers.length > 0 ? realTiers : [
    { tierId: 1, name: 'VIP', price: '0.5', totalQuantity: 50, sold: 10 },
    { tierId: 2, name: 'General Admission', price: '0.2', totalQuantity: 200, sold: 75 },
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
      selectedTier: tier, // Store the full tier object
      selectedTierId: tier.tierId,
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
      // Calculate total price in wei
      const pricePerTicket = parseFloat(purchaseState.selectedTierPrice);
      const totalPriceEth = pricePerTicket * purchaseState.quantity;
      const totalPriceWei = (totalPriceEth * 1e18).toString(); // Convert to wei
      
      // Create tier object with tierId property as expected by purchaseTickets
      const tierWithId = {
        ...purchaseState.selectedTier,
        tierId: purchaseState.selectedTierId
      };
      
      // Use eventId from eventData, or fallback to 1 if not provided
      const eventId = eventData?.eventId || 1;
      
      console.log('Attempting purchase with:', {
        eventId: eventId,
        tier: tierWithId,
        quantity: purchaseState.quantity,
        totalPriceWei
      });
      
      await purchaseTickets(
        eventId,
        tierWithId,
        purchaseState.quantity,
        totalPriceWei
      );
      setPurchaseState(prevState => ({ ...prevState, isPurchasing: false, purchaseSuccess: true }));
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseState(prevState => ({
        ...prevState,
        isPurchasing: false,
        error: `Purchase failed: ${error.message || 'Please try again.'}`
      }));
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

  if (isLoadingTiers) {
    return <div className="p-4">Loading ticket tiers...</div>;
  }

  if (tierError) {
    return <div className="p-4 text-red-500">Error loading tiers: {tierError}</div>;
  }

  return (
    <div className="purchase-flow-container p-4">
      {!eventData && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <strong>Debug Mode:</strong> Using mock event data (eventId: 1)
        </div>
      )}
      
      {purchaseState.step === 1 && (
        <TicketTypeSelector tiers={tiersToUse} onSelectTier={handleTierSelect} />
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
