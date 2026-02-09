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
- `FIXED_ORDER`: When set to `1`, uses a fixed challenge order containing all available challenge pages.
- `SHOW_PER_PAGE_RESULTS`: When set to `1`, shows a pass/fail result after each submission with options to retry or continue.
- `BLOCK_CONTINUE_ON_FAILURE`: When set to `1`, hides the Continue button on the per-page result screen until the page is correct.

### Example (Docker)

```
docker run -p 3000:3000 \
	-e ACCESS_METHOD=basic \
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
- `npm run dev:guided` (fixed access + fixed order + per-page results)
- `npm run dev:guided:strict` (guided + block continue on failure)

## Optional tag for registry

```
docker tag challenge-001:latest <registry>/<namespace>/challenge-001:latest
```

Provide registry details to upload (registry URL, namespace, and credentials).
