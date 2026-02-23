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

## Current implemented challenge catalog snapshot (v0.1.1)

The currently implemented runtime catalog contains 25 challenge pages. This section is
the source-of-truth snapshot for planning theme-tier coverage and client training packs.

1. `whitespace-token`
2. `sorting-single`
3. `sorting-multi`
4. `radio-checkbox`
5. `hidden-field-metadata`
6. `hidden-field-metadata-auto`
7. `auto-filled-js`
8. `sse-delivered`
9. `ws-delivered`
10. `selector-variant-a`
11. `selector-variant-b`
12. `dom-shuffling`
13. `shadow-canvas`
14. `decoy-inputs`
15. `timing-window`
16. `token-assembly`
17. `request-integrity`
18. `header-derived`
19. `downloaded-file-plain`
20. `downloaded-file-encoded`
21. `create-upload-file`
22. `api-table-guid`
23. `large-pool-selection`
24. `word-order-position`
25. `markdown-pdf-upload`

## Challenge level matrix (1-9) by approach

Use this matrix as the default tier assignment reference for session builders.
Values are presentation levels (`1` easiest, `9` hardest). `N/A` means the challenge
is not part of the default profile mix for that approach (but may still be technically possible).

| Challenge page               | Protocol level | Browser level | Dante circle name (by level) | Brief page description                                                      |
| ---------------------------- | -------------: | ------------: | ---------------------------- | --------------------------------------------------------------------------- |
| `whitespace-token`           |              1 |             1 | Limbo                        | Extract regex token hidden in heavy whitespace and submit trimmed value.    |
| `sorting-single`             |              1 |             1 | Limbo                        | Sort integers by rule and submit with required delimiter.                   |
| `sorting-multi`              |              2 |             2 | Lust                         | Sort numbers and fill ordered values across multiple inputs.                |
| `radio-checkbox`             |              2 |             1 | Lust / Limbo                 | Select the correct option from randomized radio/checkbox controls.          |
| `hidden-field-metadata`      |              4 |             3 | Greed / Gluttony             | Find target value among many fields using metadata marker logic.            |
| `hidden-field-metadata-auto` |              3 |             2 | Gluttony / Lust              | Submit form containing hidden metadata-target field chosen by session rule. |
| `auto-filled-js`             |              7 |             6 | Violence / Heresy            | Read JS-populated value after runtime computation and submit it.            |
| `sse-delivered`              |              9 |             9 | Treachery                    | Receive required value from SSE stream and submit exactly.                  |
| `ws-delivered`               |              9 |             9 | Treachery                    | Request and capture token over WebSocket before submission.                 |
| `selector-variant-a`         |              7 |             6 | Violence / Heresy            | Locate value by rotating selector strategy (data key/aria/testid).          |
| `selector-variant-b`         |              7 |             6 | Violence / Heresy            | Same selector challenge family with different render pattern/decoys.        |
| `dom-shuffling`              |              7 |             7 | Violence                     | Identify target after DOM order and identifiers are shuffled.               |
| `shadow-canvas`              |              9 |             9 | Treachery                    | Extract token from Shadow DOM/canvas-style render surface.                  |
| `decoy-inputs`               |              7 |             7 | Violence                     | Choose valid input among layout/style decoys and submit value.              |
| `timing-window`              |              4 |             4 | Greed                        | Submit within server-enforced timing window constraints.                    |
| `token-assembly`             |              3 |             3 | Gluttony                     | Assemble token from split nodes/attributes using ordering hints.            |
| `request-integrity`          |              9 |             9 | Treachery                    | Build integrity/HMAC value using session nonce + streamed secret.           |
| `header-derived`             |              6 |             4 | Heresy / Greed               | Derive required answer from response header indicated by page hint.         |
| `downloaded-file-plain`      |              4 |             4 | Greed                        | Download plain file, read token line, and submit token.                     |
| `downloaded-file-encoded`    |              7 |             7 | Violence                     | Download encoded payload, decode correctly, and submit result token.        |
| `create-upload-file`         |              9 |             9 | Treachery                    | Create local file per rule and upload for strict server verification.       |
| `markdown-pdf-upload`        |              9 |             9 | Treachery                    | Convert disabled markdown to PDF and upload matching rendered content.      |
| `api-table-guid`             |              4 |             3 | Greed / Gluttony             | Query API table, apply row-selection rule, submit target GUID.              |
| `large-pool-selection`       |              3 |             2 | Gluttony / Lust              | Pick exact target items from larger randomized option pool.                 |
| `word-order-position`        |              3 |             2 | Gluttony / Lust              | Sort sampled words by rule and submit required positional word.             |

Realtime capability note:

- SSE and WebSocket challenges are explicitly considered protocol-tool feasible (including JMeter),
  with higher setup/analysis effort than browser automation in many cases.

Protocol deep-analysis note:

- JavaScript-generated token/value pages and DOM-reshuffle pages are considered protocol-tool feasible.
- Typical approach: HTML/script extraction with Regex (or equivalent parser), then JSR223/JSR233-style
  post-processing to compute/select the final value before submit.
- Upload-generation flows are also protocol-tool feasible: Groovy/JSR223 can orchestrate shell/template
  commands to build artifacts (for example, markdown template -> rendered file -> PDF) prior to multipart upload.
- Canvas/Shadow extraction flows are protocol-tool feasible when response payload includes parsable script/data
  segments that can be isolated and evaluated with Regex/parser + post-processing logic.
- These pages are intentionally high effort in protocol mode and should be treated as advanced workflow tasks.

## Proposed Next challenges (file I/O)

These are approved candidate challenges for the next catalog expansion. They are
designed to increase realism for scripting tools (Playwright/JMeter/curl + helper
scripts) by requiring download handling, decoding, local file operations, and upload.

16. **Downloaded file token (plain)**
    - Challenge id (proposed): `downloaded-file-plain`
    - Flow: On page load, server triggers a file download containing a random token/text.
      User must read file contents and submit the exact required value in a text input.
    - Suggested tool affinity: `either`
    - Suggested difficulty tier: `medium`
    - Suggested level placement: early-mid (after core extraction/sorting pages)
    - Validation:
      - token must match server-generated session value
      - optional strict mode: require file name match when included in instructions

17. **Downloaded file token (encoded/compressed)**
    - Challenge id (proposed): `downloaded-file-encoded`
    - Flow: On page load, server downloads a file that is encoded/compressed
      (e.g., Base64, gzip, zip). User must decode/unpack correctly, extract random
      token, and submit it.
    - Suggested tool affinity: `either` (leans `browser` if download trigger is JS-only)
    - Suggested difficulty tier: `advanced`
    - Suggested level placement: mid-late
    - Validation:
      - decoded token must match server-generated session value
      - encoded format selection must be session-randomized
      - include deterministic metadata (header or on-page hint) to keep challenge fair

18. **Create-and-upload file**
    - Challenge id (proposed): `create-upload-file`
    - Flow: Page displays random required content (and optional encoding rule). User
      script must create a local file with exact expected content/format and upload it.
      Server verifies uploaded content.
    - Suggested tool affinity: `browser`
    - Suggested difficulty tier: `advanced` to `grand-master`
    - Suggested level placement: late (near end of session)
    - Validation:
      - uploaded file must exist and be non-empty
      - decoded/normalized file content must match expected token
      - optional strict checks: expected filename, extension, checksum, MIME type

19. **API table row GUID selection**
    - Challenge id (proposed): `api-table-guid`
    - Flow: Page loads table data from a challenge API call returning JSON with
      `target` selection details and randomized `products[]` rows (5–20 rows,
      ~6 columns). User must identify the target row and submit its GUID.
    - Suggested tool affinity: `either`
    - Suggested difficulty tier: `medium` baseline, `advanced` variant
    - Suggested level placement: early-mid baseline; mid-late for compound-rule mode
    - Validation:
      - submitted GUID must exactly match target row GUID for session
      - target criteria and product set must be deterministic per session seed
      - API endpoint should enforce same session/tab token checks as page routes
    - Suggested variants:
      - Baseline (`medium`): exact SKU match rule.
      - Advanced (`advanced`): compound rule (e.g., highest stock within a category).
      - Advanced (`advanced`): highest rating where price is under a stated cap.

20. **Large-pool item selection (checkbox/radio)**
    - Challenge id (proposed): `large-pool-selection`
    - Flow: Display 5–20 options sampled from a large canonical pool (~200 items).
      Prompt instructs user to select one or more specific target items (checkbox)
      or a single target (radio), then submit.
    - Suggested tool affinity: `either`
    - Suggested difficulty tier: `medium` baseline, `advanced` variant
    - Suggested level placement: early-mid baseline; mid-late for multi-rule selection
    - Validation:
      - checkbox mode: submitted set must exactly match expected targets (no extras)
      - radio mode: submitted value must exactly match single expected target
      - enforce min/max rendered option count (5–20) and deterministic per-session sampling
    - Suggested variants:
      - Baseline (`medium`): explicit target labels listed in instruction.
      - Advanced (`advanced`): rule-driven targets (e.g., category + suffix match) with
        strict count requirement (e.g., “select exactly 3”).

21. **Large-pool word ordering + positional extraction**
    - Challenge id (proposed): `word-order-position`
    - Flow: Show 10–20 random words sampled from a large canonical pool (~200 words).
      Instruction provides sort direction (ascending/descending) and positional rule
      (e.g., 3rd from top / 4th from bottom). User submits the selected word.
    - Suggested tool affinity: `either`
    - Suggested difficulty tier: `medium` baseline, `advanced` variant
    - Suggested level placement: early-mid baseline; mid-late for case/locale tie-breaker rules
    - Validation:
      - compute expected answer server-side from displayed words + active sort rules
      - submitted word must exactly match expected normalized result
      - deterministic per-session subset sampling from large word pool
    - Suggested variants:
      - Baseline (`medium`): plain lexical sort + Nth position extraction.
      - Advanced (`advanced`): explicit case-sensitivity or locale collation rules,
        plus tie-breaker behavior for duplicate-equivalent values.

22. **Disabled markdown-to-PDF upload**
    - Challenge id (proposed): `markdown-pdf-upload`
    - Flow: Page displays randomized markdown in a disabled `<textarea>` (read-only to the user).
      User must extract markdown content, render/convert it into a PDF file, and upload the PDF.
    - Suggested tool affinity: `either` (high-effort protocol + browser)
    - Suggested difficulty tier: `advanced` to `grand-master`
    - Suggested level placement: late session
    - Validation:
      - uploaded file must be present and valid PDF (`%PDF-` signature check)
      - extract text from uploaded PDF server-side and normalize whitespace/newline differences
      - compare normalized extracted text to normalized source markdown-rendered plain text target
      - optional strict mode: enforce expected filename and/or minimum page count
    - Normalization checklist (deterministic comparator):
      - convert all line endings to `\n`
      - trim leading/trailing whitespace per line
      - collapse repeated internal spaces/tabs to single space
      - collapse 3+ blank lines to max 1 blank line
      - normalize unicode quotes/dashes to ASCII equivalents where extraction engines differ
      - strip page headers/footers if they match configured renderer artifacts
      - apply same normalization pipeline to both expected text and extracted PDF text before hashing
    - Fairness constraints:
      - keep markdown subset bounded (headings, lists, paragraphs, inline code)
      - avoid ambiguous constructs (tables/footnotes/HTML blocks) unless parser rules are explicit
      - publish normalization rules in-page (line endings, repeated spaces, trailing blank lines)
    - Implementation notes:
      - store canonical expected text hash in session state
      - on upload: extract PDF text -> normalize -> hash -> compare with canonical hash
      - support protocol-tool workflows where artifact creation is orchestrated by JSR223/Groovy + shell tools
    - Tool feasibility note:
      - Feasible with script-capable protocol/browser tools (for example JMeter, Locust, k6, Playwright).
      - Likely not feasible in constrained record/replay-only tools without programmable file pipelines
        (for example TruClient/RealBrowser-style environments).
    - Reference comparator pseudo-code:

      ```text
      sourceMarkdown = getSessionMarkdown(sessionId, challengeId)
      expectedText = renderMarkdownToPlainText(sourceMarkdown)

      uploadedPdfBytes = readUpload(payload)
      assert startsWith(uploadedPdfBytes, "%PDF-")

      extractedText = extractPdfText(uploadedPdfBytes)

      normalize(text):
        text = text.replace("\r\n", "\n").replace("\r", "\n")
        text = mapLines(text, trim)
        text = collapseInternalWhitespace(text)      // spaces/tabs -> single space
        text = collapseBlankRuns(text, maxBlank=1)
        text = normalizeUnicodePunctuation(text)     // smart quotes/dashes -> ascii
        text = stripConfiguredHeaderFooterArtifacts(text)
        return text.trim()

      expectedHash = sha256(normalize(expectedText))
      uploadedHash = sha256(normalize(extractedText))

      pass = (expectedHash == uploadedHash)
      ```

### Tier and profile application guidance

- `protocol` profile:
  - Include 16 by default.
  - Include 17 only when encoding details are accessible via headers/body and solvable
    without full browser automation.
  - Exclude 18 unless a multipart upload endpoint is explicitly documented and intended
    for protocol-tool workflows.
  - Include 22 only when PDF text extraction/normalization rules are explicitly documented
    and deterministic for protocol workflows.
- `browser` profile:
  - Include all four challenges.
  - Prefer JS-triggered download and upload interactions to test full browser scripts.
- `mixed` profile:
  - Include all four, but cap to one high-complexity file challenge per session to
    avoid over-weighting file I/O relative to other puzzle types.
  - Include 19 as a core medium bridge between DOM-only and file/realtime pages.
  - Include 20 and 21 as medium bridge challenges for deterministic parsing + selection.

### Fairness and anti-shortcut constraints

- Content must be deterministic per session seed and challenge id.
- Randomize token/value each session; do not reuse fixed sample files.
- Do not embed answer directly in visible HTML when download/upload path is required.
- Provide at least one actionable hint for decode/compression method when used.
- Keep strict checks configurable by difficulty tier to avoid accidental over-hardening.
- For list/word challenges, sample displayed values from large source pools (~200)
  to reduce memorization and precomputed-answer strategies.

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

## Theme, branding, and white-label spec (updated)

### Default product theme

- Default visual identity: **Inferno-inspired**, with challenge intensity represented by tier levels `1` to `9`.
- Tier naming follows Dante's 9 circles for light-hearted theme labeling.
- Messaging intent: "difficulty as descent" (training pressure), while keeping content workplace-safe.

### Tier model (replaces easy/medium/advanced in UI)

- Every challenge page exposes a **presentation tier**: `tierScore` in range `1..9`.
- Internal technical difficulty metadata may remain (`easy|medium|advanced|grand-master`) for filtering,
  but UI and theming use `tierScore`.
- Baseline mapping guidance:
  - `easy` -> tiers `1-3`
  - `medium` -> tiers `4-6`
  - `advanced` -> tiers `7-8`
  - `grand-master` -> tier `9`

### Background and animation behavior

- Each rendered challenge page background is selected by `activeTheme` + `tierScore`.
- Inferno default background progression:
  - Tier 1-3: low-contrast ash/smoke ambience.
  - Tier 4-6: ember glow, occasional heat shimmer.
  - Tier 7-8: stronger fire motion accents and brighter edge glows.
  - Tier 9: highest intensity visuals with controlled motion.
- Animation policy:
  - Prefer lightweight CSS-first effects (gradient drift, glow pulse, particle flicker).
  - Provide reduced-motion fallbacks via `prefers-reduced-motion`.
  - Keep animation behind content and never obstruct instructions/inputs.

### Client branding / white-label capability

- The system must support **theme packs** to enable per-client branding without code rewrites.
- Theme pack supports at minimum:
  - `id`, `name`, `logo`, `watermark`, `color tokens`, `font tokens`, `tier backgrounds[1..9]`, `animation profile`.
  - Optional client text overrides (title, warning copy, footer text).
- Default theme pack is Inferno-inspired.
- Clients can switch to neutral/corporate packs (no inferno/fire references) by config.
- Branding scope includes: header logo, optional watermark, favicon, summary/report branding.

### Theme selection at startup

- Theme must be selectable at server start (runtime config), not hard-coded.
- Proposed startup variable: `THEME_PACK`.
  - `inferno` (default)
  - `neutral` (enterprise-safe baseline)
  - `<client-id>` (client-provided theme pack)
- Optional companion variable: `THEME_WATERMARK=on|off` for branded training deployments.

### Multi-tenant company branding model

- The platform must support a **tenant/client mode** for internal company training programs.
- Recommended startup variables:
  - `TENANT_ID` (selects company profile)
  - `THEME_PACK` (visual theme, defaults per tenant)
  - `THEME_WATERMARK=on|off`
  - `BRAND_LOGO_MODE=tenant|theme|none`
- Theme/brand resolution precedence:
  1. Tenant override (logo, watermark, display name, policy text)
  2. Theme pack defaults
  3. Product defaults (Inferno)
- Per-tenant configuration should support:
  - display name + training program label
  - logo and optional watermark asset
  - allowed themes list (for example inferno + neutral only)
  - default profile/tier presets for staff cohorts
  - legal/compliance footer text override
- Branding must be render-only. Tenant branding cannot alter challenge generation, scoring,
  session integrity, or answer validation behavior.

### Dante Inferno as default training theme

- Inferno remains the product default when no tenant/theme override is provided.
- Tier backgrounds map directly to level `1..9` across all challenge pages.
- Company deployments can keep inferno visuals, switch to neutral/corporate visuals,
  or provide their own approved theme pack without changing challenge logic.

### Safety and enterprise constraints

- Visual themes must remain configurable for clients that disallow religious or punitive imagery.
- Inferno theme is opt-out and not hard-coded into challenge logic.
- Challenge behavior, validation, and scoring remain theme-agnostic.

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

- Deliverables: Inferno-default theme, 1-9 tier backgrounds, white-label theme-pack support, animations, accessibility pass.

### Phase 6 — Testing & hardening

- Deliverables: unit/integration/protocol tests, logging, error handling, performance sanity checks.

### Phase 7 — Packaging & docs

- Deliverables: single docker image build, run instructions, README, usage notes.

## Progress tracking

Status key: Not started / In progress / Done

- Phase 0 — Project scaffolding: Done
- Phase 1 — Session & routing core: Done
- Phase 2 — Challenge engine: Done
- Phase 3 — First challenge set (core): Done
- Phase 4 — Realtime challenges: Done
- Phase 5 — UX & theming: Done
- Phase 6 — Testing & hardening: Done
- Phase 7 — Packaging & docs: Done

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
- Theme system must support tenant/client-specific branding (logo, watermark, palette, backgrounds, motion profile).
- Theming must not alter challenge correctness logic, validation rules, or route contracts.

## Tool profiles and tier presentation

The challenge catalog can be tagged by tool affinity and difficulty, enabling curated
session flows for different testing tools and skill levels.

- Tool profiles: e.g., protocol-first (JMeter), browser-first (Playwright), mixed.
- Internal difficulty tags: easy, medium, advanced, grand master.
- UI presentation tiers: Inferno-style levels `1..9` mapped from internal difficulty.
- Interview presets: fixed profile + tier ordering for consistent candidate screening.

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
