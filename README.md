# EventHorizon

A decentralized concert ticket marketplace built on blockchain technology. EventHorizon enables secure, transparent buying and selling of event tickets as NFTs, ensuring verifiable ownership and eliminating fraud.

## Features

- **NFT-Based Tickets**: Every ticket is minted as a unique ERC721 NFT
- **Wallet Authentication**: Connect via MetaMask or compatible Web3 wallets
- **Dual Event Types**:
  - General Admission: Standard entry tickets
  - Assigned Seating: Interactive venue map for seat selection
- **Blockchain-Verified**: All transactions and ownership recorded on-chain
- **User Dashboard**: View and manage your ticket NFTs

## Project Structure

```
tickets/
├── backend/          # Smart contracts (Solidity + Hardhat)
├── frontend/         # React application (Vite + Ethers.js)
└── README.md
```

## Quick Start

### Prerequisites

- Node.js v18+
- npm
- MetaMask browser extension

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd tickets
```

2. **Setup Backend**
```bash
cd backend
npm install
npx hardhat node
```

3. **Deploy Contract** (in new terminal)
```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Access the dApp** at `http://localhost:5173`

### Configure MetaMask

Add Hardhat local network:
- Network Name: Hardhat Local
- RPC URL: http://localhost:8545
- Chain ID: 31337
- Currency Symbol: ETH

## Technology Stack

**Smart Contracts**
- Solidity
- Hardhat
- OpenZeppelin Contracts

**Frontend**
- React
- Vite
- Ethers.js
- Tailwind CSS

**Testing**
- Hardhat (Chai) - Smart contract tests
- Vitest + React Testing Library - Frontend tests

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Documentation

- [Frontend README](frontend/README.md) - Detailed frontend documentation
- [Backend README](backend/README.md) - Smart contract documentation

## License

ISC
