# EventHorizon - Frontend

React-based frontend for the EventHorizon decentralized ticket marketplace. Provides an intuitive interface for browsing events, purchasing NFT tickets, and managing your ticket collection.

## Key Features

-   **Wallet Integration:** Users connect via crypto wallets like MetaMask for identity and transactions.
-   **NFT Tickets:** Every ticket is minted as a unique ERC721 NFT, providing proof of ownership.
-   **Two Event Types:**
    -   **General Admission:** Standard entry tickets where total supply is tracked.
    -   **Assigned Seating:** Tickets correspond to a unique seat, with an interactive venue map for selection.
-   **On-Chain Logic:** The smart contract is the single source of truth, handling all business rules like preventing double-booking and sales for past/sold-out events.
-   **User Profile:** A dedicated page for users to view their upcoming and past ticket NFTs.

## Technology Stack

-   **React 19.1.1**: UI library with latest features
-   **Vite**: Fast build tool and development server
-   **Ethers.js 6.15.0**: Web3 blockchain interactions
-   **Tailwind CSS 3.4.4**: Utility-first styling
-   **Lucide React**: Icon library
-   **React Zoom Pan Pinch**: Interactive venue maps
-   **QRCode.react**: QR code generation for tickets
-   **Vitest + React Testing Library**: Component and integration testing

## Installation

### Prerequisites

-   Node.js v18+
-   npm
-   MetaMask browser extension
-   Backend deployed and running (see [backend README](../backend/README.md))

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Access the application at `http://localhost:5173`

### Required Configuration

The deployment script from the backend automatically creates:
- `contract-address.json`: Deployed contract address
- `ConcertTicketMarketplace.json`: Contract ABI

Ensure the backend is deployed before starting the frontend.

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

## Testing

Run component and integration tests:

```bash
npm test
```

Tests use Vitest and React Testing Library, covering:
- Component rendering and interactions
- Web3 integration
- Event listing and filtering
- Ticket purchasing flows
- User profile management

## Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── EventCard.jsx
│   │   ├── NetworkStatus.jsx
│   │   ├── PurchaseFlow.jsx
│   │   ├── TicketCard.jsx
│   │   ├── TicketTypeSelector.jsx
│   │   └── TransactionModal.jsx
│   ├── services/
│   │   └── ethers.js     # Web3 integration
│   ├── App.jsx           # Main application
│   └── main.jsx          # Entry point
├── contract-address.json # Deployed contract address
├── ConcertTicketMarketplace.json # Contract ABI
└── package.json
```

## Features

### Event Browsing
- View all available events with details
- Filter by event type (General Admission / Assigned Seating)
- Real-time ticket availability

### Ticket Purchase
- Connect wallet via MetaMask
- Purchase general admission tickets
- Select specific seats with interactive venue map
- Transaction confirmation and status

### User Profile
- View owned tickets
- Filter by upcoming/past events
- Display ticket QR codes
- Seat information for assigned tickets

### Network Management
- Automatic network detection
- Network switching prompt
- Connection status indicators

## Configuration

### Supported Networks

**Development**
- Network: Hardhat Local
- RPC: http://localhost:8545
- Chain ID: 31337

**Production**
- Network: Base Sepolia
- Chain ID: 84532

### MetaMask Setup

Add local network in MetaMask:
1. Open MetaMask > Settings > Networks > Add Network
2. Enter:
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

Import test account (shown when running `npx hardhat node`)

## Troubleshooting

**Events not loading**
- Verify backend node is running
- Check contract is deployed
- Confirm MetaMask is on correct network (Chain ID: 31337)

**Transaction failures**
- Ensure sufficient ETH balance
- Check correct network connection
- Verify contract address in `contract-address.json`

**MetaMask not connecting**
- Unlock MetaMask extension
- Approve connection request
- Add and select Hardhat Local network

## Dependencies

Production:
- react, react-dom: ^19.1.1
- ethers: ^6.15.0
- tailwindcss: ^3.4.4
- lucide-react: ^0.543.0
- qrcode.react: ^4.2.0

Development:
- vite: ^7.1.2
- vitest: ^3.2.4
- @testing-library/react: ^16.3.0

## License

ISC
