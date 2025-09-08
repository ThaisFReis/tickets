# Research Document

## Testing Framework for React Frontend

*   **Decision**: Vitest
*   **Rationale**: Vitest is a modern test runner with a focus on speed and a great developer experience. It's designed to work out-of-the-box with Vite, which is used in the frontend.
*   **Alternatives considered**: Jest. Jest is a popular choice, but requires more configuration to work with Vite.

## Performance Goals

*   **Decision**: Transactions should be confirmed within 30 seconds on a testnet. Page loads should be under 2 seconds.
*   **Rationale**: These are reasonable goals for a dApp on a testnet, providing a good user experience.
*   **Alternatives considered**: Faster confirmation times would require a more performant blockchain or a layer-2 solution, which is out of scope for this project.

## Scale and Scope

*   **Decision**: The dApp will be designed to handle up to 1,000 concurrent users and 100 active events.
*   **Rationale**: This is a reasonable scope for a prototype and allows for testing the core functionality without over-engineering for scalability.
*   **Alternatives considered**: A larger scale would require more complex smart contracts and infrastructure.

## Logging Strategy

*   **Decision**: For the frontend, use a simple console logger during development. For the smart contract, utilize events to log important actions on the blockchain.
*   **Rationale**: This approach is simple and effective for a dApp of this scale. On-chain events provide a transparent and auditable log of contract interactions.
*   **Alternatives considered**: A more complex logging infrastructure (e.g., sending logs to a centralized service) is not necessary for this prototype.
