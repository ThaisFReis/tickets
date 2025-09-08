# Tasks: Decentralized Concert Ticket Marketplace

**Input**: Design documents from `/specs/003-build-a-decentralized/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Path Conventions
- **Web app**: `backend/`, `frontend/`

## Phase 3.1: Setup
- [x] T001: Create the monorepo structure with `backend` and `frontend` directories.
- [x] T002: Initialize the Hardhat project in the `backend` directory and install dependencies (`@nomicfoundation/hardhat-toolbox`, `hardhat`).
- [x] T003: Initialize the React project with Vite and Tailwind CSS in the `frontend` directory and install dependencies (`ethers`, `react`, `react-dom`, `tailwindcss`, `postcss`, `autoprefixer`).
- [x] T004: [P] Configure linting and formatting for the Hardhat project (e.g., Solhint).
- [x] T005: [P] Configure linting and formatting for the React project (e.g., ESLint, Prettier).

## Phase 3.2: Backend - Smart Contract (TDD)
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T006: [P] Write a test in `backend/test/ConcertTicketMarketplace.test.js` to check that a new event can be created.
- [x] T007: [P] Write a test in `backend/test/ConcertTicketMarketplace.test.js` to check that a user can purchase a ticket.
- [x] T008: [P] Write a test in `backend/test/ConcertTicketMarketplace.test.js` to prevent purchasing a ticket for a sold-out event.
- [x] T009: [P] Write a test in `backend/test/ConcertTicketMarketplace.test.js` to prevent purchasing a ticket for a past event.
- [x] T010: Implement the `createEvent` function in `backend/contracts/ConcertTicketMarketplace.sol`.
- [x] T011: Implement the `purchaseTicket` function in `backend/contracts/ConcertTicketMarketplace.sol`.
- [x] T012: Implement the `getUpcomingEvents` function in `backend/contracts/ConcertTicketMarketplace.sol`.
- [x] T013: Create a deployment script in `backend/scripts/deploy.js`.

## Phase 3.3: Frontend - UI and Integration
- [x] T014: [P] Write a test in `frontend/src/components/ConcertList.test.jsx` to check that the component renders a list of concerts.
- [x] T015: [P] Write a test in `frontend/src/components/UserProfile.test.jsx` to check that the component renders the user's tickets.
- [x] T016: Create the `ConcertList` component in `frontend/src/components/ConcertList.jsx` to display available concerts.
- [x] T017: Create the `UserProfile` component in `frontend/src/components/UserProfile.jsx` to display the user's tickets.
- [x] T018: Implement the logic in `frontend/src/services/ethers.js` to connect to the smart contract and fetch data.
- [x] T019: Integrate the `ConcertList` component with the `ethers.js` service to display concerts from the smart contract.
- [x] T020: Integrate the `UserProfile` component with the `ethers.js` service to display the user's tickets.
- [x] T021: Implement the filtering and sorting functionality on the main page.
- [x] T022: Implement the wallet connection logic.

## Phase 3.4: Polish
- [x] T023: [P] Add comprehensive documentation to the `README.md` file.
- [x] T024: [P] Add unit tests for all utility functions.
- [ ] T025: Manually test the entire application flow as described in `quickstart.md`.

## Dependencies
- T001, T002, T003 must be completed before any other tasks.
- Backend tests (T006-T009) must be completed before backend implementation (T010-T012).
- Frontend tests (T014-T015) must be completed before frontend implementation (T016-T017).
- Backend implementation (T010-T013) must be completed before frontend integration (T018-T021).

## Parallel Example
```
# Launch T004 and T005 together:
Task: "Configure linting and formatting for the Hardhat project"
Task: "Configure linting and formatting for the React project"

# Launch T006-T009 together:
Task: "Write a test in backend/test/ConcertTicketMarketplace.test.js to check that a new event can be created."
Task: "Write a test in backend/test/ConcertTicketMarketplace.test.js to check that a user can purchase a ticket."
Task: "Write a test in backend/test/ConcertTicketMarketplace.test.js to prevent purchasing a ticket for a sold-out event."
Task: "Write a test in backend/test/ConcertTicketMarketplace.test.js to prevent purchasing a ticket for a past event."
```
