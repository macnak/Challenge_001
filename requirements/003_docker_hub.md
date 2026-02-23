# Docker Hub Listing Content

Repository: https://hub.docker.com/repository/docker/macnak/challenge-001
Source code: https://github.com/macnak/Challenge_001

## Short description

Automation / Performance Challenge app with randomized server-rendered pages, realtime puzzles, and Inferno-themed 1-9 presentation levels.

## Full description

Challenge 001 is an Automation / Performance Challenge web app designed to make scripting and load testing more realistic and difficult through session-randomized challenge flows, mixed submission types, and realtime challenge mechanics.

- Server-rendered HTML challenge pages (optional React hydration)
- Deterministic replay support through fixed seeds/presets
- Tool-aware challenge profiles (`protocol`, `browser`, `mixed`)
- Mixed payload formats (form + JSON + multipart)
- Realtime challenge support (SSE + WebSocket)
- Inferno/neutral theming with tenant branding controls

## Tags

- `latest`
- `0.1.2`

## Usage

Pull:

```bash
docker pull macnak/challenge-001:latest
docker pull macnak/challenge-001:0.1.2
```

Run:

```bash
docker run -p 3000:3000 --name challenge-001 macnak/challenge-001:latest
docker run -p 3000:3000 --name challenge-001-0-1-2 macnak/challenge-001:0.1.2
```

Open: http://localhost:3000

## Implemented challenge pages (v0.1.2)

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

## Challenge level matrix (1-9)

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

## Run parameters

### Core behavior

- `ACCESS_METHOD`: `jwt` | `basic` | `none` | `user-pass`
- `TOOL_PROFILE`: `protocol` | `browser` | `mixed`
- `DIFFICULTY_LEVEL`: `1..9` (preferred)
  - Mapping: `1-3 -> easy`, `4-6 -> medium`, `7-8 -> advanced`, `9 -> grand-master`
- `DIFFICULTY_TIER`: `easy` | `medium` | `advanced` | `grand-master` (backward compatible)
- `INTERVIEW_PRESET`: `<profile>-<tier>` (example: `protocol-medium`)
- `FIXED_SEED`: fixed deterministic seed (example: `seed-001`)
- `FIXED_ORDER=1`

### Validation/result controls

- `SHOW_PER_PAGE_RESULTS=1`
- `SHOW_PER_PAGE_EXPLANATION=1`
- `BLOCK_CONTINUE_ON_FAILURE=1`

### API table challenge controls

- `API_TABLE_RULE_MODE`: `sku` | `compound` | `rating-under-cap`
- `API_TABLE_RULE_SEQUENCE`: comma sequence (example: `sku,compound,rating-under-cap`)

### Theme and branding controls

- `THEME_PACK`: `inferno` (default) | `neutral` | `<client-id>`
- `TENANT_ID`: tenant/company identifier (example: `acme-training`)
- `THEME_WATERMARK`: `on` | `off`
- `BRAND_LOGO_MODE`: `tenant` | `theme` | `none`

## Docker run examples

### Guided strict run

```bash
docker run -p 3000:3000 \
  -e ACCESS_METHOD=basic \
  -e INTERVIEW_PRESET=protocol-medium \
  -e FIXED_ORDER=1 \
  -e SHOW_PER_PAGE_RESULTS=1 \
  -e BLOCK_CONTINUE_ON_FAILURE=1 \
  --name challenge-001-guided macnak/challenge-001:latest
```

### Branding / tenant run

```bash
docker run -p 3000:3000 \
  -e THEME_PACK=inferno \
  -e TENANT_ID=acme-training \
  -e THEME_WATERMARK=on \
  -e BRAND_LOGO_MODE=tenant \
  -e TOOL_PROFILE=mixed \
  -e DIFFICULTY_LEVEL=6 \
  --name challenge-001-acme macnak/challenge-001:latest
```

## docker-compose example

```yaml
services:
  challenge-001:
    image: macnak/challenge-001:latest
    ports:
      - '3000:3000'
    environment:
      THEME_PACK: inferno
      TENANT_ID: acme-training
      THEME_WATERMARK: 'on'
      BRAND_LOGO_MODE: tenant
      TOOL_PROFILE: mixed
      DIFFICULTY_LEVEL: '6'
```

## Release command sequence

```bash
npm run build
docker build -t challenge-001:latest .
npm run docker:tag:version:latest
npm run docker:push:version
docker push macnak/challenge-001:latest
```

## Links

- Source repository: https://github.com/macnak/Challenge_001
- Issues: https://github.com/macnak/Challenge_001/issues
