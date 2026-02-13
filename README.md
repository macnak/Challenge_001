# Challenge 001

Automation / Performance Challenge web application with server-rendered HTML pages and optional React hydration.

## Scripts

- `npm run dev` — start Fastify in watch mode
- `npm run build` — build client and server
- `npm run start` — run production server
- `npm run test` — run unit tests

## Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open: http://localhost:3000

## Docker

Build:

`docker build -t challenge-001 .`

Run:

`docker run -p 3000:3000 challenge-001`

Docker Hub image:

macnak/challenge-001:latest

```
docker pull macnak/challenge-001:latest
docker run -p 3000:3000 --name challenge-001 macnak/challenge-001:latest
```

Versioned release example:

```
docker pull macnak/challenge-001:0.1.1
docker run -p 3000:3000 --name challenge-001-0-1-1 macnak/challenge-001:0.1.1
```

docker-compose:

```
docker compose up
```

See [requirements/002_usage.md](requirements/002_usage.md) for run modes and [requirements/003_docker_hub.md](requirements/003_docker_hub.md) for Docker Hub listing content.

## Realtime (SSE)

SSE endpoint: `/session/:sessionId/events`
Used to deliver request-integrity secrets for the HMAC challenge.

## Notes

See requirements in requirements/000_overview.md.

## Interview modes

- Tool-aware challenge profiles (protocol tools like JMeter vs browser tools like Playwright)
- Difficulty tiers that order challenges from easy to advanced
- Interview presets that map profiles + tiers for candidate screening

## Roadmap (next challenge additions)

- Downloaded file token extraction (plain file)
- Downloaded file decode/unpack (encoded or compressed file)
- Create-and-upload file verification

See requirements details in [requirements/000_overview.md](requirements/000_overview.md).
