# Data Model

## Entities

### ConcertEvent
Represents a single concert.
- **`eventId`**: `uint256` (unique identifier)
- **`name`**: `string`
- **`date`**: `uint256` (Unix timestamp)
- **`category`**: `string`
- **`price`**: `uint256` (in wei)
- **`totalTickets`**: `uint256`
- **`soldTickets`**: `uint256`

### TicketNFT
Represents a ticket as an ERC721 token.
- **`tokenId`**: `uint256` (unique identifier for the NFT)
- **`eventId`**: `uint256` (links to the ConcertEvent)
- **`owner`**: `address`

### UserProfile
This is not a separate data model in the smart contract, but rather a view of a user's assets on the frontend, derived from their wallet address and the `TicketNFT`s they own.
