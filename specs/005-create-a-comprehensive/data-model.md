# Data Model

**Feature**: Decentralized Concert Ticket Marketplace
**Date**: 2025-09-08

This document defines the core data structures for the smart contract.

## 1. Event Struct

This struct holds all the information related to a specific concert or event.

```solidity
struct Event {
    uint256 eventId;
    string name;
    uint256 date;
    uint256 ticketPrice;
    uint256 totalSupply; // For General Admission
    uint256 sold;        // For General Admission
    address organizer;
    bool isAssignedSeating;
    mapping(uint256 => Seat) seats; // For Assigned Seating
    uint256 totalSeats; // For Assigned Seating
}
```

-   **eventId**: Unique identifier for the event.
-   **name**: The name of the event (e.g., "Rock Concert").
-   **date**: The date of the event (Unix timestamp).
-   **ticketPrice**: The price of a single ticket in wei.
-   **totalSupply**: The total number of tickets available for a general admission event.
-   **sold**: The number of tickets sold for a general admission event.
-   **organizer**: The wallet address of the event organizer.
-   **isAssignedSeating**: A boolean to distinguish between general admission and assigned seating events.
-   **seats**: A mapping to represent the seats for an assigned seating event.
-   **totalSeats**: The total number of seats for an assigned seating event.

## 2. Ticket Struct (Conceptual)

While the NFT itself (ERC721) will represent the ticket, this conceptual model outlines the data associated with each ticket. This data will be stored within the smart contract, linked to the NFT's `tokenId`.

```solidity
struct Ticket {
    uint256 eventId;
    uint256 tokenId;
    address owner;
    bool isAssignedSeating;
    uint256 seatId; // Only for assigned seating
}
```

-   **eventId**: The ID of the event this ticket belongs to.
-   **tokenId**: The unique ID of the NFT representing the ticket.
-   **owner**: The wallet address of the ticket holder.
-   **isAssignedSeating**: True if the ticket is for a specific seat.
-   **seatId**: A unique identifier for the seat (e.g., derived from section, row, and seat number).

## 3. Seat Struct

This struct represents a single seat in an assigned seating event.

```solidity
struct Seat {
    uint256 seatId;
    address owner;
    bool isSold;
}
```

-   **seatId**: A unique identifier for the seat.
-   **owner**: The wallet address of the seat's owner. Will be `address(0)` if unsold.
-   **isSold**: A boolean indicating if the seat has been sold.

## 4. Off-Chain Venue Map Data (JSON)

For assigned seating events, the venue layout will be stored in a JSON file off-chain to save gas. The frontend will fetch and parse this file to render the interactive map.

**Example `venueData.json`:**

```json
{
  "eventId": 1,
  "venueName": "Crypto Arena",
  "sections": [
    {
      "sectionName": "A",
      "rows": [
        {
          "rowName": "1",
          "seats": [
            {"seatNumber": "1", "seatId": 10101},
            {"seatNumber": "2", "seatId": 10102}
          ]
        },
        {
          "rowName": "2",
          "seats": [
            {"seatNumber": "1", "seatId": 10201},
            {"seatNumber": "2", "seatId": 10202}
          ]
        }
      ]
    }
  ]
}
```
