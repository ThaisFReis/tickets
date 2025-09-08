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

# Deploy the contract (this will automatically create sample events and copy files to frontend)
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

The deployment script automatically handles copying the contract ABI and address to the frontend, so no manual file copying is needed.

Start the frontend development server:

```bash
# Start the app
npm run dev
```

You can now access the dApp at `http://localhost:5173` (or the address provided by Vite). The deployment script has already created two sample events for testing:
- **Rock Fest 2025** - General admission event with 100 tickets at 0.05 ETH each
- **Jazz Night** - Assigned seating event with 150 seats at 0.1 ETH each

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

## Troubleshooting

### Common Issues

**Events not loading / "Error fetching events"**
- Ensure the Hardhat local node is running (`npx hardhat node` in backend directory)
- Make sure you redeployed after starting the node (`npx hardhat run scripts/deploy.js --network localhost`)
- Check that your MetaMask is connected to the local network (http://localhost:8545, Chain ID: 31337)

**MetaMask Connection Issues**
- Make sure MetaMask is installed and unlocked
- Add the local Hardhat network to MetaMask:
  - Network Name: Hardhat Local
  - RPC URL: http://localhost:8545
  - Chain ID: 31337
  - Currency Symbol: ETH

**Transaction Failures**
- Ensure you have sufficient ETH balance in your MetaMask account
- Import one of the Hardhat test accounts for development (private keys shown when running `npx hardhat node`)
