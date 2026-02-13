import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const apps: FastifyInstance[] = [];
let previousRuleMode: string | undefined;

beforeEach(() => {
  previousRuleMode = process.env.API_TABLE_RULE_MODE;
});

afterEach(async () => {
  if (previousRuleMode === undefined) {
    delete process.env.API_TABLE_RULE_MODE;
  } else {
    process.env.API_TABLE_RULE_MODE = previousRuleMode;
  }

  while (apps.length > 0) {
    const app = apps.pop();
    if (app) {
      await app.close();
    }
  }
});

describe('api table guid config integration', () => {
  it('forces rating-under-cap mode via API_TABLE_RULE_MODE', async () => {
    process.env.API_TABLE_RULE_MODE = 'rating-under-cap';

    const { registerRoutes } = await import('../routes.js');
    const { createSession, createTabToken, setPageOrder } = await import('../session.js');

    const app = Fastify();
    app.register(fastifyCookie);
    app.register(fastifyFormbody);
    app.register(fastifyMultipart);
    registerRoutes(app);
    await app.ready();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['api-table-guid']);
    const tabToken = createTabToken(session);

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/data?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = response.json() as {
      target: {
        mode: 'rating-under-cap' | 'sku' | 'compound';
      };
    };
    expect(payload.target.mode).toBe('rating-under-cap');
  });
});
