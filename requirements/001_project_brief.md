# Project Brief

## What this project is

An Automation / Performance Challenge web application designed to be difficult to script with tools like Playwright and JMeter. The system uses randomized page order, randomized challenge parameters, and per-session rules. It is intentionally designed to lead testers into assumptions, then force careful analysis to succeed.

## Core goals

- Provide a solvable but challenging experience for automation/performance testers.
- Make protocol-testing tools viable by serving full server-rendered HTML per challenge.
- Keep sessions server-side, hidden, deterministic via seed, and reproducible for debugging.
- Deliver a single docker image with frontend and backend bundled.

## Key constraints

- No per-page correctness feedback; final summary only.
- All pages must be correct to pass.
- Session expires after 10 minutes.
- Access control method is per session (JWT/Basic/none/username+password).
- Mixed submission formats (JSON + form posts).
- No DB required; session data stored in-memory (optional file persistence if needed).

## Challenge philosophy

- Each page can change its parameters and even rules per session.
- Keep hints minimal; logs are for developers only.
- Back button does not change order; no partial input persistence.

## Version 1 scope

- 15 challenge pages as defined in the overview.
- Server-rendered HTML with optional React hydration.
- SSE and WebSocket challenges included.

## Version 2 challenge expansion (approved)

Next planned additions focus on file handling automation:

- Download file on page load, read token, submit token.
- Download encoded/compressed file, decode/unpack, submit token.
- Create local file from on-page instruction and upload it for verification.

These additions increase scripting realism and are intended to be integrated with
existing tool-profile and difficulty-tier filtering.

## Open decisions to confirm

- Theme & UI spec.
- Routing and API contract details.
- SSE/WS event names and payload schemas.
- Session persistence strategy (memory vs file).
- Per-page payload formats.

## Testing strategy (high level)

- Unit tests for challenge generators/validators.
- Integration tests for session lifecycle and navigation.
- Protocol-level tests for HTML parsing.
- SSE/WS tests for connectivity and payload integrity.
