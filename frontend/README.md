# Decentralized Concert Ticket Marketplace

This project is a decentralized application (dApp) for buying and selling concert tickets as NFTs on the blockchain. It ensures verifiable ownership and transparent sales, supporting both general admission and assigned seating events.

## Key Features

-   **Wallet Integration:** Users connect via crypto wallets like MetaMask for identity and transactions.
-   **NFT Tickets:** Every ticket is minted as a unique ERC721 NFT, providing proof of ownership.
-   **Two Event Types:**
    -   **General Admission:** Standard entry tickets where total supply is tracked.
    -   **Assigned Seating:** Tickets correspond to a unique seat, with an interactive venue map for selection.
-   **On-Chain Logic:** The smart contract is the single source of truth, handling all business rules like preventing double-booking and sales for past/sold-out events.
-   **User Profile:** A dedicated page for users to view their upcoming and past ticket NFTs.

## Technology Stack

-   **Backend (Smart Contract):**
    -   **Solidity:** Language for the smart contract.
    -   **Hardhat:** Development environment for compiling, testing, and deploying.
    -   **OpenZeppelin Contracts:** For robust and secure ERC721 implementations.
-   **Frontend:**
    -   **React:** UI library for building the user interface.
    -   **Vite:** Fast frontend build tool and development server.
    -   **Ethers.js:** For all blockchain interactions from the frontend.
    -   **Tailwind CSS:** For styling the application.
-   **Testing:**
    -   **Hardhat (Chai):** For testing the Solidity smart contract.
    -   **Vitest & React Testing Library:** For testing the frontend components and integration.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   A crypto wallet browser extension (e.g., MetaMask)

### 1. Backend Setup

First, set up and deploy the smart contract.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Run a local Hardhat blockchain node
npx hardhat node
```

In a **new terminal**, deploy the contract to the local node:

```bash
# Navigate to the backend directory
cd backend

# Deploy the contract
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Frontend Setup

After the contract is deployed, set up the frontend.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

You will need to copy the contract's ABI and deployed address to the frontend. After deployment:
1.  Copy the ABI from `backend/artifacts/contracts/ConcertTicketMarketplace.sol/ConcertTicketMarketplace.json` to `frontend/src/contract-abi.json`.
2.  Copy the deployed address from `backend/deployment-address.json` to `frontend/src/contract-address.json`.

Finally, start the frontend development server:

```bash
# Start the app
npm run dev
```

You can now access the dApp at `http://localhost:5173` (or the address provided by Vite).

## Running Tests

The project follows a strict Test-Driven Development (TDD) methodology.

### Backend Tests

To run the smart contract tests:

```bash
cd backend
npm test
```

### Frontend Tests

To run the component and integration tests for the React app:

```bash
cd frontend
npm test
```
