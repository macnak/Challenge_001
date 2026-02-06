import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

const clientDistPath = path.resolve(__dirname, '../../dist/client');
app.register(fastifyStatic, {
  root: clientDistPath,
  prefix: '/assets/',
});

app.get('/', async (_request, reply) => {
  reply.type('text/html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Challenge 001</title>
  </head>
  <body>
    <main>
      <h1>Challenge 001</h1>
      <p>Server-rendered HTML placeholder.</p>
    </main>
  </body>
</html>`);
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
