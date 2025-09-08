# Data Model

## Entities

### User
*   **Description**: Represents a user of the dApp.
*   **Attributes**:
    *   `address`: The user's wallet address.

### Event
*   **Description**: Represents a concert event.
*   **Attributes**:
    *   `id`: Unique identifier for the event.
    *   `name`: Name of the event.
    *   `date`: Date and time of the event.
    *   `location`: Location of the event.
    *   `category`: Category of the event (e.g., "Rock", "Pop").
    *   `totalTickets`: Total number of tickets available for the event.
    *   `price`: Price of a single ticket.
    *   `image`: URL of an image for the event.

### Ticket
*   **Description**: Represents a ticket owned by a user for a specific event.
*   **Attributes**:
    *   `owner`: The address of the user who owns the ticket.
    *   `eventId`: The ID of the event for which the ticket is valid.
