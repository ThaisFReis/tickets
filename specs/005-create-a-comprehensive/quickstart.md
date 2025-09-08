# Quickstart Guide

**Feature**: Decentralized Concert Ticket Marketplace
**Date**: 2025-09-08

This guide provides instructions on how to set up and run the dApp for development and testing.

## Prerequisites

-   Node.js (v18 or later)
-   npm (or yarn)
-   A crypto wallet browser extension (e.g., MetaMask)

## Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Compile the smart contract:**
    ```bash
    npx hardhat compile
    ```

4.  **Run the local Hardhat network:**
    ```bash
    npx hardhat node
    ```

5.  **Deploy the smart contract to the local network (in a separate terminal):**
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

## Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Copy contract ABI and address:**
    -   After deploying the backend, copy the generated ABI from `backend/artifacts/contracts/ConcertTicketMarketplace.sol/ConcertTicketMarketplace.json` to `frontend/src/contract-abi.json`.
    -   Copy the deployed contract address from `backend/deployment-address.json` to `frontend/src/contract-address.json`.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the dApp:**
    -   Open your browser and go to `http://localhost:5173` (or the address provided by Vite).

## Development Workflow (TDD)

### Backend (Smart Contract)

1.  **Write a new test case** in `backend/test/ConcertTicketMarketplace.test.js` for the functionality you want to add.
2.  **Run the tests** and watch the new test fail: `npx hardhat test`.
3.  **Implement the code** in `backend/contracts/ConcertTicketMarketplace.sol` to make the test pass.
4.  **Run the tests again** to confirm they all pass: `npx hardhat test`.
5.  **Refactor** if necessary.

### Frontend (React)

1.  **Write a new test case** in a relevant `*.test.jsx` file (e.g., `frontend/src/components/ConcertList.test.jsx`).
2.  **Run the tests** and watch the new test fail: `npm test`.
3.  **Implement the component logic** in the corresponding `*.jsx` file to make the test pass.
4.  **Run the tests again** to confirm they all pass: `npm test`.
5.  **Refactor** if necessary.
