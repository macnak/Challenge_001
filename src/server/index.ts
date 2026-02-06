import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyWebsocket from '@fastify/websocket';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerRoutes } from './routes.js';
import { registerRealtime } from './realtime.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });

const clientDistPath = path.resolve(__dirname, '../../dist/client');
app.register(fastifyStatic, {
  root: clientDistPath,
  prefix: '/assets/',
});

app.register(fastifyCookie);
app.register(fastifyFormbody);
app.register(fastifyWebsocket);

app.addContentTypeParser(
  ['application/xml', 'text/xml'],
  { parseAs: 'string' },
  (_req, body, done) => {
    done(null, { xml: body });
  },
);
registerRoutes(app);
registerRealtime(app);

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '0.0.0.0';

app.listen({ port, host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
