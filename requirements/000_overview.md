# Overview

## Purpose

Build an Automation / Performance Challenge web application designed to be difficult to script with tools like Playwright and JMeter by using randomized page order, randomized challenges, and per-session rules. The flow should push testers into common assumptions and then require careful analysis of each page to succeed. The solution should be usable by protocol-testing tools by providing full server-rendered HTML per challenge.

## Success criteria

- User can complete a randomized series of challenges and receive a final pass/fail outcome.
- The application can deterministically reproduce a given session from a seed for debugging.
- The backend validates solutions and enforces session integrity.
- Frontend and backend ship together in a single deployable package (docker-friendly).
- Each challenge page is server-rendered HTML; React may optionally hydrate for browser UX.

## Core flow

1. Landing page explains the goal and begins a tracked session.
2. A randomized set of challenge pages (10–15) is selected and ordered per session.
3. User navigates with Back and Submit.
4. No per-page success indicator is shown; final summary shows pass/fail with a button to reveal incorrect pages.

## Randomization rules

- Number of pages: 10–15 per session.
- Order of pages: random per session.
- Per-page parameters are randomized (values, options, token placement, access method, etc.).
- Session seed is fixed at first landing page load and used for deterministic replay.

## Page challenges (v1 target: 15)

1. **Whitespace token (regex extraction)**: Token embedded in large whitespace (newlines, tabs, mixed spaces). User must extract the regex match and submit the trimmed token.
2. **Sorting rule (single input)**: 10–20 integers in random order; instruction randomly chooses ascending or descending; delimiter is randomized per session.
3. **Sorting rule (multi-input variant)**: Numbers displayed with adjacent input fields; user must locate all numbers and fill each input with the correct order.
4. **Radio/checkbox selection**: Correct value displayed at top; options list length and control type randomized.
5. **Hidden-field metadata puzzle**: 100–200 fields, only one is relevant based on a metadata-style attribute (e.g., `readonly`), rule changes per session.
6. **Auto-filled JS values**: Values are computed client-side on render; user must submit computed values.
7. **SSE-delivered values**: Required data delivered via Server-Sent Events.
8. **WebSocket-delivered values**: Required data delivered via WebSocket.
9. **DOM shuffling**: Key elements reordered and IDs/classes randomized per session.
10. **Shadow DOM / Canvas text**: Required token rendered inside Shadow DOM or drawn in Canvas/SVG.
11. **Decoy inputs & layout traps**: Multiple similar inputs exist; only one is valid based on computed style or layout.
12. **Timing window**: Submit must occur within or after a specific time window enforced by the server.
13. **Token assembled across nodes**: Required token is split across multiple DOM nodes or data attributes and must be composed in order.
14. **Request integrity page**: Submission must include an integrity value (HMAC/nonce) derived from a per-session secret delivered via SSE/WS.
15. **Header-derived value**: Required answer is derived from response headers (e.g., ETag/Date) combined with on-page instructions.

## Overarching challenge requirements

- Sessions are tracked server-side and hidden from the user.
- Page order, parameters, and certain behaviors vary per session (deterministic via seed for replay).
- Progress visibility varies per session and may be hidden in non-obvious locations (page title, headers, etc.).
- No per-page correctness feedback; final summary shows pass/fail with an optional “reveal incorrect pages” button.
- Mixed submission formats across challenges (JSON and form posts).
- Access control method is selected per session; credentials/headers are displayed on the page and are session-unique.
- No partial-input persistence; Back must not alter order and requires re-completion.
- Minimal hints in responses; details go to logs during development/testing.

## Backlog / future variants

- Optional SPA-only mode (API-driven) as an alternative mode.

## UX requirements

- Server-rendered HTML per challenge; React may optionally hydrate for browser UX.
- Back and Submit buttons on every challenge page.
- No immediate correctness feedback on each page.
- Final summary page with pass/fail and optional list of incorrect pages.
- Optional “review mode” to revisit wrong pages.

## Session tracking

- Session begins at landing page and is tracked server-side.
- Session seed must be recorded and retrievable for replay.
- Session should expire after a configurable timeout.
- Replays must produce identical page order and per-page parameters.

## Validation rules

- Server validates all answers; client is never authoritative.
- One-time tokens should be single-use and expire.
- Attempts should be logged with timestamps for analysis.

## Theme & UI spec (to finalize)

- Overall theme/mood: Cyberpunk + playful.
- Color palette (primary/secondary/accent + backgrounds):
  - Primary: Neon magenta (#FF2D95)
  - Secondary: Electric cyan (#00F5FF)
  - Accent: Acid lime (#B6FF3A)
  - Background: Deep space navy (#0B0F1A)
  - Surface: Dark slate (#141A2A)
  - Text: Off-white (#E6EAF2)
  - Danger: Neon red (#FF4D4D)
- Typography (font families, sizes, weights):
  - Headings: "Orbitron" (or similar sci-fi sans), 600–700 weights
  - Body: "Inter" (or similar clean sans), 400–500 weights
  - Code/mono: "JetBrains Mono" for tokens/values
- Layout style: Consistent, card-based layout where applicable; allow sparse/empty pages when required by challenge logic.
- Component styling: Cyberpunk playful accents (glow borders, subtle scanlines, pill buttons, high-contrast inputs).
- Iconography/illustrations: Minimal neon line icons; avoid clutter on puzzle-heavy pages.
- Motion/animation guidance: Subtle ambient animations (glow pulsing, scanline drift, slow parallax). On intentionally empty pages, include a light distracting animation.

## Routing & API contract (to finalize)

- URL scheme for challenge pages: Consistent pattern that can be discovered by a scripter but is not a static list; must be derivable per session.
- Per-access-method paths (JWT/Basic/none/user-pass): Pick one access method per session and stick to it for all pages.
- Submission endpoints (single vs per-page): Mixed; must be discoverable from page HTML or downloaded JS.
- Payload formats per challenge (JSON/form): Mixed formats; include XML on some pages.
- SSE endpoint(s) and event names:
  - Endpoint: `/session/:sessionId/events`
  - Events: `challenge.data`, `challenge.hint`, `challenge.key`
  - Payload (JSON): `{ "challengeId": "...", "type": "token|key|hint", "value": "...", "expiresAt": "..." }`
- WebSocket endpoint and message schema:
  - Endpoint: `/session/:sessionId/ws`
  - Client message: `{ "type": "challenge.request", "challengeId": "..." }`
  - Server message: `{ "type": "challenge.response", "challengeId": "...", "value": "...", "nonce": "..." }`
- Header-derived challenge: Mix it up; provide a hint somewhere in the page HTML about which header and how to use it.

## Testing requirements (to finalize)

- Unit tests for challenge generators and validators.
- Integration tests for session creation, navigation, and submission.
- Protocol-level tests (curl/JMeter) to validate HTML parsing viability.
- SSE/WS connectivity and payload validation tests.
- End-to-end tests for browser flow (optional).

## Implementation phases & deliverables

### Phase 0 — Project scaffolding

- Deliverables: repo structure, build scripts, lint/format config, dockerfile skeleton.

### Phase 1 — Session & routing core

- Deliverables: session creation, seed handling, per-session access method selection, basic routing, HTML page rendering skeleton.

### Phase 2 — Challenge engine

- Deliverables: challenge registry, per-page generator + validator interfaces, deterministic randomization by seed.

### Phase 3 — First challenge set (core)

- Deliverables: whitespace token, sorting (single + multi), radio/checkbox, hidden-field metadata, token assembly, header-derived value.

### Phase 4 — Realtime challenges

- Deliverables: SSE + WS endpoints, request-integrity page, time-window challenge.

### Phase 5 — UX & theming

- Deliverables: cyberpunk/playful theme, card-based layout, animations, accessibility pass.

### Phase 6 — Testing & hardening

- Deliverables: unit/integration/protocol tests, logging, error handling, performance sanity checks.

### Phase 7 — Packaging & docs

- Deliverables: single docker image build, run instructions, README, usage notes.

## Progress tracking

Status key: Not started / In progress / Done

- Phase 0 — Project scaffolding: Done
- Phase 1 — Session & routing core: Not started
- Phase 2 — Challenge engine: Not started
- Phase 3 — First challenge set (core): Not started
- Phase 4 — Realtime challenges: Not started
- Phase 5 — UX & theming: Not started
- Phase 6 — Testing & hardening: Not started
- Phase 7 — Packaging & docs: Not started

## Technology stack

- TypeScript
- React (optional hydration on top of server-rendered HTML)
- Fastify backend
- Vite (for frontend tooling)
- Single package output suitable for a docker image

## Non-functional requirements

- Configurable difficulty levels (randomization ranges, timeouts, challenge mix).
- Basic observability: request logs, session audit trail.
- Accessible UI (keyboard navigation, readable instructions).

---

# Gap questions (must be answered before implementation)

## Product / UX

1. Exact definition of “pass” (all pages correct, or threshold allowed)?
   - Answer: All pages must be correct to pass.
2. Should incorrect pages be revealed immediately on summary or only after user action?
   - Answer: Do not reveal immediately. On the final score page show a button; only when pressed should incorrect pages be shown.
3. Should users be able to retry a failed session, or must they restart a new session?
   - Answer: No retries. If the user starts again after the end, a completely new randomized session starts from scratch.
4. Should the landing page require consent/acknowledgement before session starts?
   - Answer: No formal consent. Show a humorous/light-hearted warning (e.g., “There be dragons beyond this point”).
5. Should the UI show progress (e.g., “page 4 of 12”) or keep that hidden?
   - Answer: Varies by session. Sometimes visible in UI, other times hidden (e.g., in headers, page title, or other non-obvious locations) to challenge assumptions.

## Session & randomness

6. How should the session seed be generated (server-only, or shared with client)?
   - Answer: Server-side/hidden session state; keep seed/state hidden from the user.
7. Should a user be able to resume a session after a refresh?
   - Answer: Yes, if session state (including access control method) can be preserved; this should increase difficulty without making it impossible.
8. Should multiple tabs share the same session or create new ones?
   - Answer: Separate session per tab (if feasible).
9. What is the session timeout duration?
   - Answer: 10 minutes.

## Challenge catalogue

10. Confirm the minimum required set of challenges for v1.

- Answer: Target ~15 different pages/challenges for v1. Open to additional challenge ideas.

11. Are any challenges optional or excluded due to accessibility concerns?

- Answer: No exclusions; the goal is to push automation/performance testers to their limits.

12. For SSE/WS pages, what fallback behavior is expected if connection fails?

- Answer: SSE/WS is expected to work; JavaScript is assumed enabled. No fallback required in v1. Future option: alternative SPA-only mode (API-driven).

13. For the hidden-field puzzle, what rule identifies the correct field?

- Answer: Use a metadata-style attribute (e.g., `readonly`) or similar marker; the rule should change randomly each session to mislead testers.

14. For sorting challenge, what delimiter is expected in the input (comma, space, newline)?

- Answer: Delimiter is randomly chosen per session.
- Variation: Numbers are displayed with adjacent input fields; user must locate all numbers and fill inputs with the correctly ordered sequence.

15. For whitespace token, should trimming be required or exact match including whitespace?

- Answer: The challenge is to extract the correct regex match; the trimmed random token is required for submission (browser flow should work naturally, but tools like JMeter require more effort).

## Access control

16. Which access methods must be supported in v1 (JWT, Basic, none, username/password, others)?

- Answer: Support the listed methods (JWT, Basic, none, username/password). Prefer separate backend paths per access method to simplify routing/middleware.

17. How are credentials presented to the user when required?

- Answer: Display on the page. For Basic auth, show username/password and instruct user to use them when progressing. Credentials should be unique per session. For header-based keys, state the required header/key on the page.

18. Are access methods per session or per page?

- Answer: Per session.

## Security & integrity

19. Should there be request integrity checks (HMAC or nonce) for all submissions or only some pages?

- Answer: Yes, but only on certain pages.

20. Should there be rate limiting? If yes, what limits and behaviors?

- Answer: No rate limiting.

21. Should replay detection be enforced across sessions?

- Answer: No. Session is locked on landing/start and valid until expiry. Back button should not change order and users must complete the page again; no partial-entry state is remembered. Incognito/new browser sessions should not be remembered.

## API & data contracts

22. Do you want a single submission endpoint for all pages or per-page endpoints?

- Answer: Open to either if it increases difficulty; choose the approach that best complicates scripting.

23. Should answers be submitted as JSON only, or support form posts?

- Answer: Mix formats; use different submission formats across challenges to increase difficulty (e.g., JSON vs form posts).

24. Should the API return structured error codes for developers (even if not shown to users)?

- Answer: Keep details in server logs/console during development/testing; minimize hints in responses. If hints appear, it is intentional due to session variability and to mislead assumptions.

## Deployment

25. Target runtime (Node version)?

- Answer: Latest Node.js; TypeScript latest; React stable.

26. Expected docker base image and build strategy?

- Answer: Single docker image containing both frontend and backend for easy packaging.

27. Any requirement for running without external dependencies (DB-free)?

- Answer: Prefer DB-free; no database required.

---

# Decisions log (fill in as answered)

- Pass criteria: All pages must be correct.
- Session tracking: Hidden server-side session/state; per-session randomized page count/order; tracking method may vary per session.
- Progress visibility: Varies by session; sometimes hidden in non-obvious locations.
- Session resume behavior: Resume allowed on refresh with preserved session state.
- v1 challenge list: ~15 different pages/challenges (final list TBD).
- Access methods in v1: JWT, Basic, none, username/password (separate backend paths per method preferred).
- Submission format: Mixed (JSON and form posts across challenges).
