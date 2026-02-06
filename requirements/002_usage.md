# Usage Summary (Docker)

## Build image

```
docker build -t challenge-001:latest .
```

## Run image

```
docker run -p 3000:3000 --name challenge-001 challenge-001:latest
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

## Optional tag for registry

```
docker tag challenge-001:latest <registry>/<namespace>/challenge-001:latest
```

Provide registry details to upload (registry URL, namespace, and credentials).
