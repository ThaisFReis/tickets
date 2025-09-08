# Implementation Plan: Concert Ticket Marketplace dApp

**Branch**: `002-build-a-concert` | **Date**: 2025-09-08 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-build-a-concert/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
This plan outlines the development of a decentralized concert ticket marketplace dApp. The frontend will be built with React (Vite, Tailwind CSS) and interact with a Solidity smart contract on the blockchain via Metamask and Ethers.js. The smart contract, developed with Hardhat, will manage concert events, ticket sales, and ownership.

## Technical Context
**Language/Version**: Solidity, TypeScript (TSX)
**Primary Dependencies**: Hardhat, Ethers.js, React, Vite, Tailwind CSS, Metamask
**Storage**: Ethereum Blockchain
**Testing**: Hardhat for contract testing, [NEEDS CLARIFICATION: Testing framework for React frontend, e.g., Jest, Vitest]
**Target Platform**: Web browsers with Metamask extension
**Project Type**: Web application
**Performance Goals**: [NEEDS CLARIFICATION: Specific performance goals for the dApp]
**Constraints**: Decentralized, relies on user's Metamask wallet.
**Scale/Scope**: [NEEDS CLARIFICATION: Expected number of users or events]

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 2 (backend, frontend)
- Using framework directly? Yes
- Single data model? Yes
- Avoiding patterns? Yes

**Architecture**:
- EVERY feature as library? No, this is a dApp.
- Libraries listed: N/A
- CLI per library: N/A
- Library docs: N/A

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes
- Git commits show tests before implementation? Yes
- Order: Contract→Integration→E2E→Unit strictly followed? Yes
- Real dependencies used? Yes
- Integration tests for: new libraries, contract changes, shared schemas? Yes
- FORBIDDEN: Implementation before test, skipping RED phase. Yes

**Observability**:
- Structured logging included? [NEEDS CLARIFICATION: Logging strategy for frontend and smart contract]
- Frontend logs → backend? N/A
- Error context sufficient? Yes

**Versioning**:
- Version number assigned? 0.1.0
- BUILD increments on every change? Yes
- Breaking changes handled? Yes

## Project Structure

### Documentation (this feature)
```
specs/002-build-a-concert/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── contracts/
│   ├── scripts/
│   └── test/
└── hardhat.config.ts

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/
```

**Structure Decision**: Option 2: Web application

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Research best testing framework for React with Vite (Jest vs. Vitest).
   - Define specific performance goals for the dApp (e.g., transaction confirmation time).
   - Estimate the expected number of users and events to define scope.
   - Define a logging strategy for the frontend and smart contract.

2. **Generate and dispatch research agents**:
   - Task: "Research best practices for testing React applications built with Vite."
   - Task: "Define performance benchmarks for a ticket marketplace dApp."
   - Task: "Analyze scalability considerations for a dApp with 10,000 users and 1,000 events."
   - Task: "Design a logging strategy for a React frontend and a Solidity smart contract."

3. **Consolidate findings** in `research.md`.

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - User, Event, TicketType, Ticket.

2. **Generate API contracts** from functional requirements:
   - Solidity smart contract interface for `TicketMarketplace.sol`.
   - Output to `/contracts/TicketMarketplace.sol`.

3. **Generate contract tests** from contracts:
   - Test file for `TicketMarketplace.sol` using Hardhat.

4. **Extract test scenarios** from user stories:
   - User can connect wallet.
   - User can see list of concerts.
   - User can filter and sort concerts.
   - User can buy a ticket.
   - User can see their tickets in their profile.

5. **Update agent file incrementally**:
   - Run `/scripts/update-agent-context.sh gemini`.

**Output**: data-model.md, /contracts/TicketMarketplace.sol, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Create tasks for setting up Hardhat and React projects.
- Create tasks for writing the `TicketMarketplace.sol` smart contract and tests.
- Create tasks for building the React components for the main page, event details page, and profile page.
- Create tasks for integrating the frontend with the smart contract using Ethers.js.

**Ordering Strategy**:
- TDD order: Tests before implementation.
- Backend before frontend.

**Estimated Output**: ~20 tasks in tasks.md

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
