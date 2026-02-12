# Docker Hub Listing Content

Repository: https://hub.docker.com/repository/docker/macnak/challenge-001
Source code: https://github.com/macnak/Challenge_001

## Short description

Automation / Performance Challenge web app with server-rendered HTML pages and optional React hydration.

## Full description

Challenge 001 is an Automation / Performance Challenge web application designed to make scripting and load testing harder by introducing per-session randomization, mixed submission formats, and realtime challenges.

- Server-rendered HTML per challenge page
- Optional React hydration for improved UX
- Per-session access methods (JWT, Basic, none, username/password)
- Randomized or fixed challenge order
- Optional per-page result feedback for guided testing
- Tool-aware challenge profiles and difficulty tiers
- Interview presets for deterministic, apples-to-apples candidate screening

### Links

- Source repository: https://github.com/macnak/Challenge_001
- Issues: https://github.com/macnak/Challenge_001/issues

## Tags

- `latest`

## Usage

Pull the image:

```
docker pull macnak/challenge-001:latest
```

Run:

```
docker run -p 3000:3000 --name challenge-001 macnak/challenge-001:latest
```

Open: http://localhost:3000

### Optional run modes

Set any of the following environment variables to adjust behavior:

- `ACCESS_METHOD` (`jwt` | `basic` | `none` | `user-pass`)
- `TOOL_PROFILE` (`protocol` | `browser` | `mixed`)
- `DIFFICULTY_TIER` (`easy` | `medium` | `advanced` | `grand-master`)
- `INTERVIEW_PRESET` (`protocol-easy`, `protocol-medium`, `browser-easy`, etc.)
- `FIXED_SEED` (forces deterministic values + ordering)
- `FIXED_ORDER=1`
- `SHOW_PER_PAGE_RESULTS=1`
- `SHOW_PER_PAGE_EXPLANATION=1`
- `BLOCK_CONTINUE_ON_FAILURE=1`

Example (guided + strict):

```
docker run -p 3000:3000 \
  -e ACCESS_METHOD=basic \
  -e INTERVIEW_PRESET=protocol-medium \
  -e FIXED_ORDER=1 \
  -e SHOW_PER_PAGE_RESULTS=1 \
  -e BLOCK_CONTINUE_ON_FAILURE=1 \
  --name challenge-001 macnak/challenge-001:latest
```

Versioned tag helpers (from package.json):

```
npm run docker:tag:version
npm run docker:tag:version:latest
npm run docker:push:version
```

## docker-compose example

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
