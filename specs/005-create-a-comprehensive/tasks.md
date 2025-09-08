# Project Tasks: Decentralized Concert Ticket Marketplace

**Feature**: Decentralized Concert Ticket Marketplace
**Date**: 2025-09-08

This document outlines the development tasks for building the dApp, following a strict TDD methodology.

---

## Phase 1: Backend (Smart Contract)

### T001: [Setup] Initialize Hardhat Project [P]
-   **File**: `backend/`
-   **Action**: Initialize a new Hardhat project. Create the initial directory structure.

### T002: [Setup] Create Initial Contract and Test Files [P]
-   **Files**:
    -   `backend/contracts/ConcertTicketMarketplace.sol`
    -   `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Create the initial empty contract and test files.

### T003: [TEST] Event Creation: General Admission
-   **File**: `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Write a failing test case to verify the creation of a general admission event.

### T004: [IMPL] Event Creation: General Admission
-   **File**: `backend/contracts/ConcertTicketMarketplace.sol`
-   **Action**: Implement the `createEvent` function to support general admission events. Make the test from T003 pass.

### T005: [TEST] Event Creation: Assigned Seating
-   **File**: `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Write a failing test case to verify the creation of an assigned seating event.

### T006: [IMPL] Event Creation: Assigned Seating
-   **File**: `backend/contracts/ConcertTicketMarketplace.sol`
-   **Action**: Extend the `createEvent` function to support assigned seating events. Make the test from T005 pass.

### T007: [TEST] Ticket Sales: General Admission
-   **File**: `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Write failing tests for purchasing a general admission ticket, including edge cases like "Sold Out" and "Event has passed".

### T008: [IMPL] Ticket Sales: General Admission
-   **File**: `backend/contracts/ConcertTicketMarketplace.sol`
-   **Action**: Implement the `buyTicket` function for general admission tickets. Make the tests from T007 pass.

### T009: [TEST] Ticket Sales: Assigned Seating
-   **File**: `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Write failing tests for purchasing an assigned seat ticket, including edge cases like "Seat already sold" and double-booking attempts.

### T010: [IMPL] Ticket Sales: Assigned Seating
-   **File**: `backend/contracts/ConcertTicketMarketplace.sol`
-   **Action**: Extend the `buyTicket` function to handle assigned seating. Make the tests from T009 pass.

### T011: [TEST] View Functions
-   **File**: `backend/test/ConcertTicketMarketplace.test.js`
-   **Action**: Write failing tests for view functions, such as `getEventDetails` and `getTicketsOfOwner`.

### T012: [IMPL] View Functions
-   **File**: `backend/contracts/ConcertTicketMarketplace.sol`
-   **Action**: Implement the view functions to retrieve event and ticket data. Make the tests from T011 pass.

---

## Phase 2: Frontend (UI Components)

### T013: [Setup] Initialize React + Vite Project [P]
-   **File**: `frontend/`
-   **Action**: Initialize a new React project using Vite. Install dependencies like Ethers.js and Tailwind CSS.

### T014: [TEST] ConcertList Component [P]
-   **File**: `frontend/src/components/ConcertList.test.jsx`
-   **Action**: Write a failing test to verify that the `ConcertList` component renders a list of events.

### T015: [IMPL] ConcertList Component [P]
-   **File**: `frontend/src/components/ConcertList.jsx`
-   **Action**: Implement the `ConcertList` component to display mock event data. Make the test from T014 pass.

### T016: [TEST] UserProfile Component [P]
-   **File**: `frontend/src/components/UserProfile.test.jsx`
-   **Action**: Write a failing test to verify that the `UserProfile` component renders upcoming and past tickets.

### T017: [IMPL] UserProfile Component [P]
-   **File**: `frontend/src/components/UserProfile.jsx`
-   **Action**: Implement the `UserProfile` component to display mock ticket data. Make the test from T016 pass.

### T018: [TEST] VenueMap Component [P]
-   **File**: `frontend/src/components/VenueMap.test.jsx`
-   **Action**: Write a failing test to verify that the `VenueMap` component renders an interactive seat map from JSON data.

### T019: [IMPL] VenueMap Component [P]
-   **File**: `frontend/src/components/VenueMap.jsx`
-   **Action**: Implement the `VenueMap` component. Make the test from T018 pass.

---

## Phase 3: Integration

### T020: [IMPL] Ethers.js Service [P]
-   **File**: `frontend/src/services/ethers.js`
-   **Action**: Create a service module to handle all interactions with the smart contract (e.g., connecting to the provider, creating a contract instance).

### T021: [TEST] Integration: Fetching Events
-   **File**: `frontend/src/components/ConcertList.test.jsx`
-   **Action**: Write a failing integration test to verify that the `ConcertList` component fetches and displays real event data from the local Hardhat network.

### T022: [IMPL] Integration: Fetching Events
-   **File**: `frontend/src/components/ConcertList.jsx`
-   **Action**: Integrate the `ethers` service to fetch and display event data. Make the test from T021 pass.

### T023: [TEST] Integration: Purchasing Tickets
-   **File**: `frontend/src/components/VenueMap.test.jsx` (or a new integration test file)
-   **Action**: Write a failing integration test to verify the end-to-end ticket purchase flow for both general admission and assigned seating.

### T024: [IMPL] Integration: Purchasing Tickets
-   **Files**:
    -   `frontend/src/components/ConcertList.jsx`
    -   `frontend/src/components/VenueMap.jsx`
-   **Action**: Implement the transaction logic for purchasing tickets. Make the test from T023 pass.

### T025: [TEST] Integration: User Profile
-   **File**: `frontend/src/components/UserProfile.test.jsx`
-   **Action**: Write a failing integration test to verify that the `UserProfile` component fetches and displays the user's actual tickets.

### T026: [IMPL] Integration: User Profile
-   **File**: `frontend/src/components/UserProfile.jsx`
-   **Action**: Integrate the `ethers` service to fetch and display the user's tickets. Make the test from T025 pass.

---

## Parallel Execution Examples

The following tasks can be run in parallel:

-   **Initial Setup**: `T001`, `T002`, `T013`
-   **Component Scaffolding**: `T014` & `T015`, `T016` & `T017`, `T018` & `T019` can be developed in parallel after the initial setup.
-   **Backend/Frontend Split**: Backend tasks (`T003` to `T012`) can be worked on in parallel with the initial frontend component tasks (`T014` to `T019`).