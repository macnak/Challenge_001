# Usage Summary (Docker)

## Build image

```
docker build -t challenge-001:latest .
```

## Run image

```
docker run -p 3000:3000 --name challenge-001 challenge-001:latest
```

Docker Hub:

```
docker pull macnak/challenge-001:latest
docker run -p 3000:3000 --name challenge-001 macnak/challenge-001:latest
```

Current versioned release tag:

```
docker pull macnak/challenge-001:0.1.1
docker run -p 3000:3000 --name challenge-001-0-1-1 macnak/challenge-001:0.1.1
```

Open: http://localhost:3000

## Stop / remove

```
docker stop challenge-001
docker rm challenge-001
```

## Notes

- Uses server-rendered HTML with optional JS hydration.
- Sessions expire after 10 minutes.
- SSE endpoint: `/session/:sessionId/events`
- WS endpoint: `/session/:sessionId/ws`

## Run modes (optional)

You can override run behavior using environment variables or the provided scripts. These are helpful for scripted testing or early development.

### Environment variables

- `ACCESS_METHOD`: Fixes the access control method for all sessions.
  - Allowed values: `jwt`, `basic`, `none`, `user-pass`
- `TOOL_PROFILE`: Filters challenges by tool affinity.
  - Allowed values: `protocol`, `browser`, `mixed`
- `DIFFICULTY_TIER`: Filters challenges by difficulty tier (inclusive).
  - Allowed values: `easy`, `medium`, `advanced`, `grand-master`
- `INTERVIEW_PRESET`: Enables deterministic interview runs.
  - Format: `<profile>-<tier>` (e.g., `protocol-medium`, `browser-easy`)
  - Forces fixed order and a deterministic seed derived from the preset.
- `FIXED_SEED`: Forces deterministic session values and ordering.
  - Useful with `TOOL_PROFILE` + `DIFFICULTY_TIER` for repeatable runs.
- `FIXED_ORDER`: When set to `1`, uses a fixed challenge order containing all available challenge pages.
- `SHOW_PER_PAGE_RESULTS`: When set to `1`, shows a pass/fail result after each submission with options to retry or continue.
- `SHOW_PER_PAGE_EXPLANATION`: When set to `1`, shows a brief explanation on failed per-page results.
- `BLOCK_CONTINUE_ON_FAILURE`: When set to `1`, hides the Continue button on the per-page result screen until the page is correct.
- `API_TABLE_RULE_MODE`: Forces the `api-table-guid` challenge rule mode.
  - Allowed values: `sku`, `compound`, `rating-under-cap`
- `API_TABLE_RULE_SEQUENCE`: Comma-separated deterministic mode sequence for
  `api-table-guid` (cycled by challenge index).
  - Example: `sku,compound,rating-under-cap`

### Example (Docker)

```
docker run -p 3000:3000 \
	-e ACCESS_METHOD=basic \
	-e INTERVIEW_PRESET=protocol-medium \
	-e API_TABLE_RULE_SEQUENCE=sku,rating-under-cap \
	-e FIXED_ORDER=1 \
	-e SHOW_PER_PAGE_RESULTS=1 \
	-e BLOCK_CONTINUE_ON_FAILURE=1 \
	--name challenge-001 challenge-001:latest
```

### Example (docker-compose)

```
services:
	challenge-001:
		image: macnak/challenge-001:latest
		ports:
			- "3000:3000"
		environment:
			ACCESS_METHOD: basic
			INTERVIEW_PRESET: protocol-medium
			FIXED_ORDER: "1"
			SHOW_PER_PAGE_RESULTS: "1"
			BLOCK_CONTINUE_ON_FAILURE: "1"
```

To start:

```
docker compose up
```

### Example (npm scripts)

- `npm run dev:fixed-access:basic`
- `npm run dev:fixed-order`
- `npm run dev:per-page-results`
- `npm run dev:per-page-results:strict`
- `npm run dev:per-page-results:explain`
- `npm run dev:guided` (fixed access + fixed order + per-page results)
- `npm run dev:guided:strict` (guided + block continue on failure)
- `npm run dev:profile:protocol`
- `npm run dev:profile:browser`
- `npm run dev:profile:mixed`
- `npm run dev:tier:easy`
- `npm run dev:tier:medium`
- `npm run dev:tier:advanced`
- `npm run dev:tier:grand-master`
- `npm run dev:interview:protocol-medium`
- `npm run dev:interview:browser-medium`
- `npm run dev:seed:fixed`

## Tool profiles and difficulty tiers

You can filter the challenge catalog by tool affinity and difficulty. Tiers are inclusive
(`medium` includes `easy` + `medium`, etc.).

- Tool profiles: `protocol` (JMeter-like), `browser` (Playwright-like), `mixed`
- Difficulty tiers: `easy`, `medium`, `advanced`, `grand-master`

### File I/O challenge rollout guidance (vNext)

Planned file-based challenge pages should be enabled by profile/tier as follows:

- Downloaded file token (plain): include in `medium` and above for all profiles.
- Downloaded file token (encoded/compressed): include in `advanced` and above.
- Create-and-upload file: include in `advanced` or `grand-master`, primarily for
  `browser` and `mixed` profiles.

Additional API-driven table challenge:

- API table row GUID selection (`api-table-guid`): include in `medium` and above
  for all profiles; treat as a core bridge challenge before higher-complexity
  file/realtime tasks.
  - Baseline mode (`medium`): direct SKU row match.
  - Advanced mode (`advanced`): compound rule selection (for example, highest stock
    in a specified category).
  - Advanced mode (`advanced`): highest rating where price is below a specified cap.

Additional large-pool selection/sorting challenges:

- Large-pool item selection (`large-pool-selection`): include in `medium` and above
  for all profiles.
  - Baseline mode (`medium`): explicit target labels with checkbox/radio validation.
  - Advanced mode (`advanced`): rule-driven multi-select with exact count constraints.
- Word order position (`word-order-position`): include in `medium` and above for
  all profiles.
  - Baseline mode (`medium`): ascending/descending sort + Nth position extraction.
  - Advanced mode (`advanced`): case/locale/tie-breaker-aware ordering rules.

Recommended session balancing:

- Do not include more than one high-complexity file challenge in a single short
  session (10–15 pages).
- Keep at least one non-file extraction challenge in early pages to avoid forcing
  filesystem logic immediately.
- For interview presets, enable strict filename/checksum verification only in
  `advanced` and `grand-master` tiers.
- For anti-memorization, ensure displayed options/words are sampled from larger
  canonical pools (~200 items/words) per session.

## Optional tag for registry

```
docker tag challenge-001:latest <registry>/<namespace>/challenge-001:latest
```

Versioned tag (uses package.json version):

```
npm run docker:tag:version
npm run docker:push:version
```

Release `0.1.1` commands:

```
docker tag challenge-001:latest macnak/challenge-001:0.1.1
docker push macnak/challenge-001:0.1.1
docker push macnak/challenge-001:latest
```

Provide registry details to upload (registry URL, namespace, and credentials).
