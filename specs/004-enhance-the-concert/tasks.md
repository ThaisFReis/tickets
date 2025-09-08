# Tasks for Assigned Seating Feature

## Phase 1: Smart Contract Modifications

### T001: [TEST] Create failing test for purchasing a specific seat [P]
- **File**: `backend/test/ConcertTicketMarketplace.test.js`
- **Details**: Write a test that attempts to purchase a specific seat and expects the ownership of that seat to be transferred to the buyer. This test should fail initially.

### T002: [IMPL] Add seat management to the smart contract
- **File**: `backend/contracts/ConcertTicketMarketplace.sol`
- **Details**: Modify the smart contract to include a mapping to track the owner of each seat for each concert.

### T003: [IMPL] Implement seat purchasing logic in the smart contract
- **File**: `backend/contracts/ConcertTicketMarketplace.sol`
- **Details**: Implement the function to purchase a specific seat. This function should update the seat ownership mapping.

### T004: [TEST] Create failing test for preventing double-booking [P]
- **File**: `backend/test/ConcertTicketMarketplace.test.js`
- **Details**: Write a test that attempts to purchase a seat that has already been sold. The test should expect the transaction to be reverted.

### T005: [IMPL] Add double-booking prevention to the smart contract
- **File**: `backend/contracts/ConcertTicketMarketplace.sol`
- **Details**: Add logic to the seat purchasing function to prevent a seat from being sold more than once.

## Phase 2: Frontend Development

### T006: [TEST] Create failing test for VenueMap component [P]
- **File**: `frontend/src/components/VenueMap.test.jsx`
- **Details**: Write a test that renders the `VenueMap` component and asserts that it displays the venue layout correctly based on mock data.

### T007: [IMPL] Create the VenueMap component
- **File**: `frontend/src/components/VenueMap.jsx`
- **Details**: Create a new React component that renders an interactive venue map using SVG based on the JSON structure defined in `research.md`.

### T008: [TEST] Create failing test for seat selection [P]
- **File**: `frontend/src/components/VenueMap.test.jsx`
- **Details**: Write a test that simulates a user clicking on a seat and asserts that the seat is marked as selected.

### T009: [IMPL] Implement seat selection logic
- **File**: `frontend/src/components/VenueMap.jsx`
- **Details**: Add logic to the `VenueMap` component to handle seat selection and de-selection.

## Phase 3: Integration

### T010: [IMPL] Fetch venue map data
- **File**: `frontend/src/components/ConcertList.jsx`
- **Details**: Modify the `ConcertList` component to fetch the venue map data (from a JSON file for now) and pass it to the `VenueMap` component.

### T011: [IMPL] Integrate frontend with smart contract for purchasing seats
- **File**: `frontend/src/services/ethers.js`
- **Details**: Add a function to the `ethers.js` service to call the new seat purchasing function in the smart contract.

### T012: [IMPL] Update UI to call the new smart contract function
- **File**: `frontend/src/components/VenueMap.jsx`
- **Details**: Update the `VenueMap` component to call the new `ethers.js` function when the user clicks the "Purchase" button.

### T013: [IMPL] Periodically poll for seat status updates
- **File**: `frontend/src/components/VenueMap.jsx`
- **Details**: Implement a polling mechanism to periodically fetch the latest seat status from the smart contract and update the UI.
