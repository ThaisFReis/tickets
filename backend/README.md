# EventHorizon - Backend

Smart contracts for the EventHorizon decentralized ticket marketplace.

## Overview

The backend consists of Solidity smart contracts that handle all ticket marketplace logic including event creation, ticket minting, purchasing, and transfers. Built using Hardhat development environment with OpenZeppelin security standards.

## Smart Contract

**ConcertTicketMarketplace.sol** - Main contract implementing:
- ERC721 NFT standard for tickets
- Event creation and management
- Ticket purchasing and transfers
- General admission and assigned seating support
- Owner-only administrative functions

## Project Structure

```
backend/
├── contracts/
│   └── ConcertTicketMarketplace.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── ConcertTicketMarketplace.test.js
├── hardhat.config.js
└── package.json
```

## Installation

```bash
npm install
```

## Development

### Run Local Node

Start a local Hardhat blockchain node:

```bash
npx hardhat node
```

This starts a local Ethereum node at `http://localhost:8545` with test accounts and private keys.

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy Contract

Deploy to local network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

The deployment script:
- Deploys the ConcertTicketMarketplace contract
- Creates sample events (Rock Fest 2025, Jazz Night)
- Copies contract ABI and address to frontend
- Outputs deployment information

### Run Tests

```bash
npm test
```

Tests cover:
- Event creation
- Ticket purchasing
- General admission logic
- Assigned seating logic
- Access control
- Error handling

## Configuration

### Networks

Configured in `hardhat.config.js`:
- **localhost**: Local Hardhat node (Chain ID: 31337)
- **hardhat**: In-process Hardhat network for testing

### Environment Variables

Create `.env` file for production deployments:

```
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Contract Interface

### Events

```solidity
function createEvent(
    string memory name,
    string memory date,
    string memory location,
    uint256 totalTickets,
    uint256 price,
    bool isGeneralAdmission
) external onlyOwner
```

### Tickets

```solidity
function purchaseTicket(uint256 eventId) external payable
function purchaseTicket(uint256 eventId, uint256 seatNumber) external payable
function transferTicket(address to, uint256 tokenId) external
```

### Queries

```solidity
function getEvent(uint256 eventId) external view returns (Event memory)
function getUserTickets(address user) external view returns (uint256[] memory)
function isSeatAvailable(uint256 eventId, uint256 seatNumber) external view returns (bool)
```

## Dependencies

- **hardhat**: ^2.22.5
- **@nomicfoundation/hardhat-toolbox**: ^5.0.0
- **@openzeppelin/contracts**: ^5.4.0
- **dotenv**: ^17.2.2

## Security

- Uses OpenZeppelin's audited ERC721 implementation
- Owner-only functions for administrative tasks
- Reentrancy protection on payment functions
- Input validation on all public functions

## License

ISC
