# Data Model: Assigned Seating

## Seat

- **Description**: Represents a single seat in a venue for a specific concert.
- **Fields**:
    - `concertId` (uint256): The ID of the concert.
    - `seatId` (uint256): A unique identifier for the seat within the concert.
    - `owner` (address): The address of the owner of the ticket for this seat.
- **State Transitions**:
    - `Available` -> `Sold`: When a user purchases a ticket for the seat.

## VenueMap

- **Description**: Represents the layout of a venue. Stored off-chain as a JSON file.
- **Fields**:
    - `venueName` (string): The name of the venue.
    - `sections` (array of Section): The sections in the venue.

## Section

- **Description**: Represents a section of the venue.
- **Fields**:
    - `sectionName` (string): The name of the section.
    - `rows` (array of Row): The rows in the section.

## Row

- **Description**: Represents a row of seats in a section.
- **Fields**:
    - `rowName` (string): The name of the row.
    - `seats` (array of SeatInfo): The seats in the row.

## SeatInfo

- **Description**: Represents the information about a seat in the venue map.
- **Fields**:
    - `seatNumber` (string): The number of the seat.
    - `x` (number): The x-coordinate for rendering.
    - `y` (number): The y-coordinate for rendering.
