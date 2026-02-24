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
docker pull macnak/challenge-001:0.1.2
docker run -p 3000:3000 --name challenge-001-0-1-2 macnak/challenge-001:0.1.2
```

docker-compose:

```
docker compose up
```

Branding example (ACME + Inferno):

```
docker run -p 3000:3000 \
  -e THEME_PACK=inferno \
  -e TENANT_ID=acme \
  -e BRAND_LOGO_MODE=tenant \
  -e THEME_WATERMARK=on \
  --name challenge-001-acme macnak/challenge-001:latest
```

Place tenant brand assets in:

- `public/branding/<tenant-id>/logo.svg` (or `.png` / `.webp`)
- `public/branding/<tenant-id>/watermark.svg` (or `.png` / `.webp`)

Theme-mode branding example (no tenant override):

```bash
docker run -p 3000:3000 \
  -e THEME_PACK=inferno \
  -e BRAND_LOGO_MODE=theme \
  -e THEME_WATERMARK=on \
  --name challenge-001-inferno-theme macnak/challenge-001:latest
```

Place theme assets in:

- `public/themes/<theme-pack>/logo.svg` (or `.png` / `.webp`)
- `public/themes/<theme-pack>/watermark.svg` (or `.png` / `.webp`)

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
