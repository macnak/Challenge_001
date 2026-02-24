# Level 1-4 Expansion Plan (Auth + Correlation Focus)

## Purpose

Define the next wave of challenge pages focused on levels `1..4`, emphasizing protocol-tool correlation skills while keeping browser automation viable.

This plan is intentionally implementation-oriented so pages can be delivered incrementally over time.

## Implementation status (2026-02-24)

- Scope target achieved: **30/30** new level `1..4` pages implemented.
- Runtime catalog now includes all proposed auth/correlation, fixed-form, menu, pagination/tab, timeout, and fiori additions.
- Validation coverage is in place per challenge module with unit tests and runtime registration.
- This document remains as design/rollout history plus operating guidance for profile assignment.

## Design principles

- Same outcome, different effort by tool:
  - Browser tools naturally handle many mechanics automatically.
  - Protocol tools must explicitly capture, correlate, and replay dynamic data.
- Keep challenge logic deterministic per session seed.
- Prefer single-page UX with server-side multi-step state machines for realism.
- Provide concise fail reasons (missing token, stale nonce, wrong state, wrong sequence).
- Respect runtime mode configuration for hints, feedback timing, and progression strictness.

## Run-mode integration requirements

All new Level 1-4 challenges must adapt behavior by startup configuration.

### Mode intent

- Guided mode (learning): allow optional hints and per-page feedback.
- Strict guided mode: guided feedback plus block progression on failed attempt.
- Assessment mode: minimal/no hints, no per-page correctness, final summary only.
- Insane mode: fully randomized run, no hints, no per-page correctness; user sees mistakes only in final review if they choose to check.

### Configuration mapping (current + planned)

Use existing flags where available:

- `SHOW_PER_PAGE_RESULTS`
- `SHOW_PER_PAGE_EXPLANATION`
- `BLOCK_CONTINUE_ON_FAILURE`
- `FIXED_ORDER`
- `FIXED_SEED`
- `INTERVIEW_PRESET`

Planned hint control extension for this expansion:

- `HINT_MODE=full|minimal|off`

### Insane mode contract

Insane mode should behave as follows:

- No deterministic ordering helpers:
  - no `INTERVIEW_PRESET`
  - no `FIXED_SEED`
  - no `FIXED_ORDER`
- No hinting/inline coaching:
  - `HINT_MODE=off` (planned)
  - `SHOW_PER_PAGE_EXPLANATION=0`
- No per-page correctness reveal:
  - `SHOW_PER_PAGE_RESULTS=0`
- End-of-run feedback only:
  - final pass/fail summary shown,
  - incorrect pages/details shown only if user explicitly requests reveal.

### Challenge authoring rules for mode-aware behavior

- Each challenge should define optional hint tiers (`full`, `minimal`, `off`).
- Validation logic stays identical across modes; only hint/feedback surfaces change.
- In no-hint modes, detailed fail reasons remain in server logs/tests, not in-page.
- Progression gates still enforce correctness (except where end-only feedback flow is intended by global mode).

## Scope target

- Add **30 new challenge pages** in levels `1..4`.
- Keep default session length unchanged (`10-15` pages), but increase catalog breadth.
- Route higher-complexity auth variants to `protocol` / `mixed` packs first, then include in `browser` packs where useful.

## Proposed challenge catalog (new)

| Id                     | Name                       | Protocol level | Browser level | Core skill                    | Summary                                                                  |
| ---------------------- | -------------------------- | -------------: | ------------: | ----------------------------- | ------------------------------------------------------------------------ |
| `auth-cookie-boot`     | Cookie bootstrap           |              1 |             1 | Cookie capture                | GET issues session cookie + hidden token, POST must include both.        |
| `redirect-state-hop`   | Redirect state correlation |              1 |             1 | Redirect parsing              | Follow 302 chain, capture query `state`, submit final value.             |
| `csrf-double-submit`   | CSRF double-submit         |              2 |             2 | Token + cookie matching       | Requires CSRF cookie and matching form/body token.                       |
| `nonce-login-window`   | Login nonce window         |              2 |             2 | Expiring nonce                | Login form nonce expires quickly; must refresh and submit valid nonce.   |
| `auth-header-switch`   | Dynamic auth header        |              2 |             2 | Conditional correlation       | Auth header name/value source changes by per-session rule.               |
| `jwt-lite-claims`      | JWT-lite claims extraction |              3 |             2 | Token decode                  | Decode non-signed training JWT payload, submit specific claim.           |
| `oauth-pkce-mini`      | OAuth PKCE mini flow       |              3 |             3 | State + verifier chain        | Simulated auth code + `code_verifier` exchange on one page.              |
| `refresh-rotation`     | Refresh token rotation     |              3 |             3 | Token lifecycle               | First refresh invalidates old token; second call must use rotated token. |
| `saml-redirect-lite`   | SAML Redirect binding lite |              4 |             3 | Base64 + inflate + RelayState | Decode SAMLRequest and preserve RelayState/InResponseTo.                 |
| `saml-post-lite`       | SAML POST binding lite     |              4 |             3 | Assertion field validation    | Parse SAMLResponse and submit NameID/Audience/Recipient result.          |
| `stepup-mfa-sequence`  | Step-up auth sequence      |              4 |             4 | Multi-step auth               | Password step then OTP step with transaction id correlation.             |
| `one-page-auth-wizard` | One-page auth wizard       |              4 |             4 | Sequenced step state          | 3-step state machine on one URL with strict step token chaining.         |

## Fixed-form input family (new)

This family directly supports your idea: details/instructions appear at the top,
while the form layout stays stable (especially in lower levels). The challenge
difficulty comes from value correlation and input-type handling, not page-shape drift.

| Id                           | Name                           | Protocol level | Browser level | Core skill               | Summary                                                                     |
| ---------------------------- | ------------------------------ | -------------: | ------------: | ------------------------ | --------------------------------------------------------------------------- |
| `fixed-form-basic-fields`    | Fixed form basic fields        |              1 |             1 | Straight extraction      | Fill stable text/email/number fields using top-of-page values.              |
| `fixed-form-select-radio`    | Fixed form select/radio        |              2 |             2 | Selector handling        | Same fixed form plus select/radio inputs and value-label mapping.           |
| `fixed-form-date-multi`      | Fixed form date + multi-select |              3 |             3 | Encoding + normalization | Add date, textarea, and multi-select rules with normalization checks.       |
| `fixed-form-visual-controls` | Fixed form visual controls     |              4 |             4 | Mixed control automation | Add slider/toggle/combobox-like controls with deterministic expected state. |

### Why this family is useful

- Browser tools practice robust selectors for non-text controls.
- Protocol tools practice payload construction for mixed input types.
- Stable layout reduces noise and highlights core correlation skills.
- Difficulty can scale by rule complexity without changing form structure.

### Validation model for fixed-form pages

- Keep a stable field schema per challenge id.
- Randomize target values per session seed.
- Validate normalized payload server-side (trim, case, date format rules).
- Return targeted fail reason per field group (text/select/date/visual control).

## Menu and submenu interaction family (new)

This family focuses on realistic UI menu behavior where display state is interaction-driven
(click/hover/focus) and target instructions become more abstract by level.

| Id                   | Name                | Protocol level | Browser level | Core skill            | Summary                                                                          |
| -------------------- | ------------------- | -------------: | ------------: | --------------------- | -------------------------------------------------------------------------------- |
| `menu-click-basic`   | Menu click basic    |              1 |             1 | Open and select       | Click-triggered menu; choose exact instructed item by visible label.             |
| `menu-hover-delay`   | Menu hover delay    |              2 |             2 | Hover timing          | Hover-triggered menu with delay and auto-close behavior.                         |
| `menu-submenu-path`  | Menu submenu path   |              3 |             3 | Nested path selection | Select a `menu > submenu > item` path from top-of-page instruction.              |
| `menu-theme-variant` | Menu themed variant |              4 |             4 | Selector resilience   | Same intent with rotating render styles/attributes and strict target validation. |

### Instruction progression by level

- Level 1: direct instruction (`Select: Settings`).
- Level 2: direct instruction + trigger rule (`Hover menu then select: Reports`).
- Level 3: hierarchical instruction (`Select: Admin > Users > Invite`).
- Level 4: rule-based instruction (`Select the submenu item for region=EMEA and action=Export`).

### Selection verification and progression gate

To satisfy the core requirement, these challenges must block progression until the correct
menu selection is confirmed server-side.

- Record menu intent and selected target id/value in challenge state.
- Validate that the selected item equals the required item for the active instruction.
- On wrong selection:
  - do not mark page complete,
  - do not allow next-page progression,
  - return a deterministic fail reason (`menu-not-open`, `wrong-menu-item`, `submenu-path-mismatch`).
- On correct selection:
  - persist completion,
  - allow standard next-page flow.

Validation note:

- The check should be based on canonical menu item ids (not only display text), while display
  labels may vary by theme/locale per session.

## Pagination and tab-sequence family (new)

This family introduces workflows where users must work through paginated views and tabbed
content regions while maintaining correlated state across interactions.

| Id                            | Name                        | Protocol level | Browser level | Core skill       | Summary                                                                    |
| ----------------------------- | --------------------------- | -------------: | ------------: | ---------------- | -------------------------------------------------------------------------- |
| `pagination-sequential-pick`  | Pagination sequential pick  |              2 |             2 | Page traversal   | Find required entries across paginated list and submit ordered values.     |
| `pagination-filter-then-pick` | Pagination filter then pick |              3 |             3 | State carry-over | Apply filter/sort, traverse pages, then submit item from filtered dataset. |
| `tabbed-form-progressive`     | Tabbed form progressive     |              2 |             2 | Tab traversal    | Complete multi-tab form with required fields and optional extras.          |
| `tabbed-form-conditional`     | Tabbed form conditional     |              4 |             4 | Conditional flow | Tab rules promote optional fields to required based on prior choices.      |

### Multi-tab required/optional field rules

- Each tab defines:
  - required fields (must be valid to progress),
  - optional fields (may be blank unless a conditional rule promotes them to required).
- Required field set can vary by level and active instruction.
- Optional fields must still pass validation if provided (format/range constraints).

Level progression:

- Level 2: fixed required set per tab, optional fields always optional.
- Level 3: required set changes by instruction variant (for example profile type).
- Level 4: conditional requirement promotion (`field X required when tab A choice = value Y`).

### Validation and gating for pagination/tabs

- Verify required page or tab sequence occurred before accept.
- Reject direct final submit when prerequisite pages/tabs were skipped.
- Block progression when any active required field is missing or invalid.
- Return deterministic fail reasons (`pagination-skip`, `tab-order-mismatch`, `missing-tab-field`, `required-field-missing`, `required-field-invalid`, `optional-field-invalid`).

## SAP Fiori-style dynamic table selector family (new)

This family targets complex selector building where row/column numeric fragments vary per run
while the semantic target remains stable.

| Id                              | Name                          | Protocol level | Browser level | Core skill              | Summary                                                                                       |
| ------------------------------- | ----------------------------- | -------------: | ------------: | ----------------------- | --------------------------------------------------------------------------------------------- |
| `fiori-table-id-pattern`        | Fiori table id pattern        |              3 |             3 | Pattern selector        | Select target cell where ids look like `table_C12R125_stock` and numbers vary.                |
| `fiori-table-compound-selector` | Fiori table compound selector |              4 |             4 | Compound selector logic | Build robust selector with multiple attribute constraints while ignoring numeric id segments. |

### Selector strategy requirements

- Avoid hard-coding full volatile ids.
- Parse ids into semantic parts where numeric row/column values are treated as variable.
- Accept equivalent robust selectors, for example:
  - XPath with partial/id-pattern matching,
  - CSS with stable data attributes/role anchors,
  - semantic table traversal by header + row key.

Example volatile id:

- `table_C12R125_stock`

Expected resilient targeting approaches:

- Match stable prefix/suffix (`table_` + `_stock`) while ignoring `Cxx`/`Rxxx` volatility.
- Use header text + row context instead of direct id when available.

### Validation and progression gate for dynamic table selectors

- Server stores canonical target cell identity (row semantic key + column semantic key).
- Submission must resolve to that canonical target identity, not just a matching text value.
- Wrong selector resolution cannot progress; return deterministic reason (`wrong-table-cell`, `selector-too-brittle`, `ambiguous-cell-match`).

## Redirect, token-pickup, and timeout family (new)

This family explicitly trains redirect handling, token pickup from intermediate responses,
and timeout/expiry behavior that often breaks brittle scripts.

| Id                            | Name                        | Protocol level | Browser level | Core skill                       | Summary                                                                             |
| ----------------------------- | --------------------------- | -------------: | ------------: | -------------------------------- | ----------------------------------------------------------------------------------- |
| `redirect-token-pickup-basic` | Redirect token pickup basic |              1 |             1 | Redirect + query capture         | Follow redirect chain and capture token from query/fragment/header hint.            |
| `redirect-token-branching`    | Redirect token branching    |              3 |             2 | Conditional redirect correlation | Redirect path varies by session rule; extract correct token from chosen branch.     |
| `page-timeout-idle`           | Page idle timeout           |              2 |             2 | Expiry handling                  | Page token expires after idle window; script must refresh and resubmit valid token. |
| `page-timeout-step-window`    | Page step timeout window    |              4 |             4 | Time-window sequencing           | Multi-step page with max duration between steps and strict timeout invalidation.    |

### Validation and gating for redirects/token pickup/timeouts

- Track redirect chain signature server-side (expected hops and token source).
- Validate submitted token came from the correct redirect context, not stale prior runs.
- Enforce timeout windows (`issuedAt`, `expiresAt`, `maxStepGapMs`) per challenge state.
- On failure, block progression with deterministic reasons:
  - `redirect-chain-mismatch`
  - `token-source-invalid`
  - `token-expired`
  - `step-timeout-exceeded`

## Single-page multi-step blueprint

Each multi-step challenge should stay on one route and one rendered page shell:

1. Server emits `step=1` with transaction id + hidden step token.
2. Submit transitions to `step=2` and rotates step token.
3. Submit transitions to `step=3` and enforces prior-step token continuity.
4. Final submit validates full chain and writes challenge completion.

Validation rules:

- `transactionId` must remain constant for the chain.
- `stepToken[n]` must be single-use and bound to `step=n`.
- Any out-of-order or replayed submit returns deterministic fail reason.

## SAML challenge guidance (training-safe)

Start with simplified, deterministic SAML semantics for level 4:

- `saml-redirect-lite`
  - Input: base64 (+ optional DEFLATE) encoded SAMLRequest.
  - Required checks: `RelayState`, `InResponseTo`, expected `Issuer`.
- `saml-post-lite`
  - Input: base64 encoded SAMLResponse (XML string payload).
  - Required checks: `NameID`, `Audience`, `Recipient`, `NotOnOrAfter`.

Out of scope for level 1-4 (defer to higher levels):

- Real XML signature verification.
- Full certificate chain validation.
- Multi-assertion edge cases.

## Additional auth sequence candidates (future level 5+)

- OIDC ID token verification with JWKS.
- HMAC request signing with canonicalization edge cases.
- Device-code style polling flows.
- Cross-domain SSO with strict SameSite/cookie boundaries.

## Profile assignment guidance

- `protocol` profile
  - Prioritize: `auth-cookie-boot`, `redirect-state-hop`, `csrf-double-submit`, `nonce-login-window`, `oauth-pkce-mini`, `refresh-rotation`, `saml-redirect-lite`, `saml-post-lite`, `one-page-auth-wizard`.
- `browser` profile
  - Include all except optionally reduce `saml-*` frequency in short sessions.
- `mixed` profile
  - Include all; cap to one high-correlation auth challenge (`saml-*` or `wizard`) in a short session.

## Rollout plan (phased, completed)

### Phase 1 (quick wins: fixed-form + base auth) ✅

1. `fixed-form-basic-fields`
2. `fixed-form-select-radio`
3. `auth-cookie-boot`
4. `redirect-state-hop`

Expected outcome:

- Immediate level 1-2 expansion with high utility for protocol + browser teams.

### Phase 2 (core auth + form depth) ✅

1. `csrf-double-submit`
2. `nonce-login-window`
3. `fixed-form-date-multi`
4. `menu-click-basic`
5. `tabbed-form-progressive`
6. `redirect-token-pickup-basic`
7. `page-timeout-idle`

Expected outcome:

- Strong level 2-3 correlation coverage with mixed input handling.

### Phase 3 (intermediate auth-chain) ✅

1. `jwt-lite-claims`
2. `oauth-pkce-mini`
3. `refresh-rotation`
4. `menu-hover-delay`
5. `menu-submenu-path`
6. `pagination-sequential-pick`
7. `fiori-table-id-pattern`
8. `redirect-token-branching`

Expected outcome:

- Level 3-4 token/auth chain confidence plus advanced mixed-control handling.

### Phase 4 (advanced level-4 auth) ✅

1. `saml-redirect-lite`
2. `saml-post-lite`
3. `stepup-mfa-sequence`
4. `one-page-auth-wizard`
5. `fixed-form-visual-controls`
6. `menu-theme-variant`
7. `pagination-filter-then-pick`
8. `tabbed-form-conditional`
9. `fiori-table-compound-selector`
10. `page-timeout-step-window`

Expected outcome:

- Level 4 confidence for enterprise SSO and one-page multi-step correlation.

## Definition of done (per challenge)

- Challenge module has deterministic `generate/render/validate` behavior.
- Challenge registered in runtime catalog and included in profile/tier filtering.
- Unit tests cover success, stale/replay token failures, and sequencing errors.
- Brief user-facing instructions and clear fail reasons are present.
- Included in matrix docs with protocol/browser level assignments.
- For menu-family pages: tests must verify that wrong menu/submenu selection cannot progress.
- For pagination/tab/fiori pages: tests must verify skipped sequence or wrong target cannot progress.
- For redirect/timeout pages: tests must verify stale token or timeout state cannot progress.

## Suggested implementation order in code

For each new challenge id:

1. Add challenge module in `src/server/challenges/`.
2. Register in `src/server/challenges/runtime.ts` and index/registry as needed.
3. Add unit tests in `src/server/challenges/__tests__/`.
4. Update docs (`000_overview.md`, `002_usage.md`, Docker Hub listing if released).

## Training rubric (lightweight)

Score each auth challenge in three dimensions:

- Correlation correctness (dynamic values captured and reused correctly).
- Sequence correctness (calls/steps in required order).
- Replay resilience (script avoids stale token reuse across iterations).

This rubric helps evaluate script quality beyond raw pass/fail.
