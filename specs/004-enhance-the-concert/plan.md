# Implementation Plan: Assigned Seating for Concert Tickets

**Branch**: `004-enhance-the-concert` 
**Spec**: [/specs/004-enhance-the-concert/spec.md]

## Summary
This plan outlines the implementation of an "Assigned Seating" feature for the concert ticket dApp. Users will be able to select specific seats from an interactive venue map. The implementation will involve modifications to the smart contract to manage seat states and the creation of new frontend components to render the venue map and handle user interactions.

## Technical Context
**Language/Version**: Solidity, JavaScript (React)
**Primary Dependencies**: Hardhat, Ethers.js, React
**Storage**: Off-chain for venue layouts (JSON), On-chain for seat state
**Testing**: Hardhat tests, Vitest
**Target Platform**: Web
**Project Type**: Web Application
**Constraints**: Gas costs for on-chain storage should be minimized.
**Scale/Scope**: Single venue layout initially.

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 2 (frontend, backend)
- Using framework directly? Yes
- Single data model? Yes
- Avoiding patterns? Yes

**Architecture**:
- Libraries listed: N/A
- CLI per library: N/A
- Library docs: N/A

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes
- Git commits show tests before implementation? Yes
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes
- Integration tests for: new libraries, contract changes, shared schemas? Yes

**Observability**:
- Structured logging included? No
- Frontend logs → backend? No
- Error context sufficient? Yes

**Versioning**:
- Version number assigned? No
- BUILD increments on every change? No
- Breaking changes handled? N/A

## Project Structure

### Documentation (this feature)
```
specs/004-enhance-the-concert/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)
```
backend/
├── src/
└── tests/

frontend/
├── src/
└── tests/
```

**Structure Decision**: Web application

## Phase 0: Outline & Research
- **Task**: Research best practices for storing and managing seat states in a Solidity smart contract, considering gas costs.
- **Task**: Investigate libraries for creating interactive venue maps in React.
- **Task**: Define the JSON structure for venue map layouts.

**Output**: `research.md` with decisions on the above points.

## Phase 1: Design & Contracts
- **Data Model**: Define the `Seat` and `VenueMap` entities in `data-model.md`.
- **API Contracts**: Define the smart contract functions for purchasing tickets with assigned seating in `/contracts/api.yaml`.
- **Contract Tests**: Create failing tests for the new smart contract functions.
- **Quickstart**: Write a `quickstart.md` guide for testing the new feature.

**Output**: `data-model.md`, `/contracts/api.yaml`, failing tests, `quickstart.md`.

## Phase 2: Task Planning Approach
**Task Generation Strategy**:
- Create tasks for smart contract modifications, frontend component development, and integrating the frontend with the smart contract.
- Tasks will be ordered with smart contract changes first, followed by frontend development.

**Estimated Output**: 10-15 tasks in `tasks.md`.

## Progress Tracking
- [X] Phase 0: Research complete (/plan command)
- [X] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [X] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PENDING
- [X] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented: None
