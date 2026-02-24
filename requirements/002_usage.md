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
docker pull macnak/challenge-001:0.1.2
docker run -p 3000:3000 --name challenge-001-0-1-2 macnak/challenge-001:0.1.2
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

### Quick-start matrix

| Goal                             | Command / mode                                                                                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local dev (guided mode)          | `npm run dev:mode:guided`                                                                                                                                               |
| Local dev (assessment mode)      | `npm run dev:mode:assessment`                                                                                                                                           |
| Local dev (insane mode)          | `npm run dev:mode:insane`                                                                                                                                               |
| Local dev (default Inferno)      | `npm run dev:theme:inferno`                                                                                                                                             |
| Local dev (neutral)              | `npm run dev:theme:neutral`                                                                                                                                             |
| Local dev (tenant branded)       | `npm run dev:tenant:acme`                                                                                                                                               |
| Production run (guided mode)     | `npm run start:mode:guided`                                                                                                                                             |
| Production run (assessment mode) | `npm run start:mode:assessment`                                                                                                                                         |
| Production run (insane mode)     | `npm run start:mode:insane`                                                                                                                                             |
| Production run (Inferno)         | `npm run start:theme:inferno`                                                                                                                                           |
| Production run (neutral)         | `npm run start:theme:neutral`                                                                                                                                           |
| Production run (tenant branded)  | `npm run start:tenant:acme`                                                                                                                                             |
| Container run (Inferno + tenant) | `docker run -p 3000:3000 -e THEME_PACK=inferno -e TENANT_ID=acme -e THEME_WATERMARK=on -e BRAND_LOGO_MODE=tenant --name challenge-001-acme macnak/challenge-001:latest` |
| Compose run (tenant profile)     | Use the `docker-compose` branded tenant example below                                                                                                                   |

### Mode presets

- **Guided mode**: per-page result + explanation enabled (good for learning).
- **Assessment mode**: no per-page result/explanation; final summary only.
- **Insane mode**: no per-page result/explanation and full randomization unless you also force seed/order.

Insane mode behavior aligns with the expansion plan intent: users only discover mistakes in end-of-run review (if they choose reveal).

### Example (Docker, guided mode)

```bash
docker run -p 3000:3000 \
  -e ACCESS_METHOD=basic \
  -e FIXED_ORDER=1 \
  -e SHOW_PER_PAGE_RESULTS=1 \
  -e SHOW_PER_PAGE_EXPLANATION=1 \
  --name challenge-001-guided macnak/challenge-001:latest
```

### Example (Docker, assessment mode)

```bash
docker run -p 3000:3000 \
  -e ACCESS_METHOD=basic \
  -e SHOW_PER_PAGE_RESULTS=0 \
  -e SHOW_PER_PAGE_EXPLANATION=0 \
  --name challenge-001-assessment macnak/challenge-001:latest
```

### Example (Docker, insane mode)

```bash
docker run -p 3000:3000 \
  -e SHOW_PER_PAGE_RESULTS=0 \
  -e SHOW_PER_PAGE_EXPLANATION=0 \
  -e BLOCK_CONTINUE_ON_FAILURE=0 \
  --name challenge-001-insane macnak/challenge-001:latest
```

### Environment variables

- `ACCESS_METHOD`: Fixes the access control method for all sessions.
  - Allowed values: `jwt`, `basic`, `none`, `user-pass`
- `TOOL_PROFILE`: Filters challenges by tool affinity.
  - Allowed values: `protocol`, `browser`, `mixed`
- `DIFFICULTY_TIER`: Filters challenges by difficulty tier (inclusive).
  - Allowed values: `easy`, `medium`, `advanced`, `grand-master`
- `DIFFICULTY_LEVEL`: Filters challenges using Inferno presentation levels (`1..9`).
  - Allowed values: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`
  - Level mapping: `1-3 -> easy`, `4-6 -> medium`, `7-8 -> advanced`, `9 -> grand-master`
  - Precedence: when both are provided, `DIFFICULTY_LEVEL` is used.
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

### Theme / tenant branding variables (Inferno + white-label)

These variables support the Dante/Inferno default theme with client branding overrides.
Use them for internal staff training deployments where company branding is required.

- `THEME_PACK`: Selects visual theme pack.
  - Allowed values: `inferno` (default), `neutral`, `<client-id>`
- `TENANT_ID`: Selects tenant/company profile for branded training runs.
- `THEME_WATERMARK`: Enables branded watermark rendering.
  - Allowed values: `on`, `off`
- `BRAND_LOGO_MODE`: Selects logo source precedence.
  - Allowed values: `tenant`, `theme`, `none`

### Branding asset placement

Static branding assets are loaded from `public/` at runtime.

- Tenant mode (`BRAND_LOGO_MODE=tenant`): place files in `public/branding/<tenant-id>/`
- Theme mode (`BRAND_LOGO_MODE=theme`): place files in `public/themes/<theme-pack>/`

Supported files:

- Logo image: `logo.svg`, `logo.png`, or `logo.webp`
- Optional watermark image: `watermark.svg`, `watermark.png`, or `watermark.webp`

Example (included in repository):

- `public/branding/acme/logo.svg`
- `public/branding/acme/watermark.svg`
- `public/themes/inferno/logo.svg`
- `public/themes/inferno/watermark.svg`

Note: These flags align to the updated branding spec in `requirements/000_overview.md`.
If a deployment has not yet implemented tenant/theme-pack loading, unknown values should
fall back to safe defaults (`inferno`, watermark off, no tenant override).

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

### Example (Docker, Inferno default + tenant branding)

```
docker run -p 3000:3000 \
  -e THEME_PACK=inferno \
  -e TENANT_ID=acme \
  -e THEME_WATERMARK=on \
  -e BRAND_LOGO_MODE=tenant \
  --name challenge-001-acme macnak/challenge-001:latest
```

### Example (Docker, Inferno theme-mode branding)

```bash
docker run -p 3000:3000 \
  -e THEME_PACK=inferno \
  -e BRAND_LOGO_MODE=theme \
  -e THEME_WATERMARK=on \
  --name challenge-001-inferno-theme macnak/challenge-001:latest
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

### Example (docker-compose, branded tenant)

```
services:
  challenge-001:
    image: macnak/challenge-001:latest
    ports:
      - "3000:3000"
    environment:
      THEME_PACK: inferno
      TENANT_ID: acme
      THEME_WATERMARK: "on"
      BRAND_LOGO_MODE: tenant
      TOOL_PROFILE: mixed
      DIFFICULTY_TIER: advanced
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
- `npm run dev:level:1`
- `npm run dev:level:2`
- `npm run dev:level:3`
- `npm run dev:level:4`
- `npm run dev:level:5`
- `npm run dev:level:6`
- `npm run dev:level:7`
- `npm run dev:level:8`
- `npm run dev:level:9`
- `npm run dev:interview:protocol-medium`
- `npm run dev:interview:browser-medium`
- `npm run dev:seed:fixed`
- `npm run dev:theme:inferno`
- `npm run dev:theme:inferno:branded`
- `npm run dev:theme:neutral`
- `npm run dev:tenant:acme`
- `npm run dev:mode:guided`
- `npm run dev:mode:assessment`
- `npm run dev:mode:insane`

Production start variants:

- `npm run start:theme:inferno`
- `npm run start:theme:inferno:branded`
- `npm run start:theme:neutral`
- `npm run start:tenant:acme`
- `npm run start:mode:guided`
- `npm run start:mode:assessment`
- `npm run start:mode:insane`
- `npm run start:level:1`
- `npm run start:level:2`
- `npm run start:level:3`
- `npm run start:level:4`
- `npm run start:level:5`
- `npm run start:level:6`
- `npm run start:level:7`
- `npm run start:level:8`
- `npm run start:level:9`

## Tool profiles and difficulty levels

You can filter the challenge catalog by tool affinity and difficulty. Tiers are inclusive
(`medium` includes `easy` + `medium`, etc.).

- Tool profiles: `protocol` (JMeter-like), `browser` (Playwright-like), `mixed`
- Preferred input: levels `1..9` via `DIFFICULTY_LEVEL`
- Backward-compatible tiers: `easy`, `medium`, `advanced`, `grand-master`

### File I/O challenge rollout guidance (vNext)

Planned file-based challenge pages should be enabled by profile/tier as follows:

- Downloaded file token (plain): include in `medium` and above for all profiles.
- Downloaded file token (encoded/compressed): include in `advanced` and above.
- Create-and-upload file: include in `advanced` or `grand-master`, primarily for
  `browser` and `mixed` profiles.
- Markdown-to-PDF upload (`markdown-pdf-upload`): include in `advanced` or `grand-master`
  when PDF extraction/normalization rules are clearly documented for the selected tool profile.

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

Release `0.1.2` commands:

```
docker tag challenge-001:latest macnak/challenge-001:0.1.2
docker push macnak/challenge-001:0.1.2
docker push macnak/challenge-001:latest
```

Provide registry details to upload (registry URL, namespace, and credentials).
