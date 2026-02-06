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

## Realtime (SSE)

SSE endpoint: `/session/:sessionId/events`
Used to deliver request-integrity secrets for the HMAC challenge.

## Notes

See requirements in requirements/000_overview.md.
