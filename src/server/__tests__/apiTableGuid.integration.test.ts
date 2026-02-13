import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { afterEach, describe, expect, it } from 'vitest';
import { registerRoutes } from '../routes.js';
import { createSession, createTabToken, getSession, setPageOrder } from '../session.js';

const createApp = async () => {
  const app = Fastify();
  app.register(fastifyCookie);
  app.register(fastifyFormbody);
  app.register(fastifyMultipart);
  registerRoutes(app);
  await app.ready();
  return app;
};

const apps: FastifyInstance[] = [];

afterEach(async () => {
  while (apps.length > 0) {
    const app = apps.pop();
    if (app) {
      await app.close();
    }
  }
});

describe('api table guid integration', () => {
  const resolveTargetRow = (payload: {
    target:
      | { mode: 'sku'; sku: string; instruction: string }
      | {
          mode: 'compound';
          category: string;
          metric: 'stock';
          order: 'desc';
          instruction: string;
        }
      | {
          mode: 'rating-under-cap';
          priceCapCents: number;
          metric: 'rating';
          order: 'desc';
          instruction: string;
        };
    products: {
      guid: string;
      sku: string;
      category: string;
      stock: number;
      priceCents: number;
      rating: number;
    }[];
  }) => {
    const target = payload.target;
    if (target.mode === 'sku') {
      return payload.products.find((item) => item.sku === target.sku) ?? null;
    }

    if (target.mode === 'rating-under-cap') {
      const eligible = payload.products.filter((item) => item.priceCents <= target.priceCapCents);
      if (eligible.length === 0) {
        return null;
      }

      return eligible.reduce((top, current) => (current.rating > top.rating ? current : top));
    }

    const inCategory = payload.products.filter((item) => item.category === target.category);
    if (inCategory.length === 0) {
      return null;
    }

    return inCategory.reduce((top, current) => (current.stock > top.stock ? current : top));
  };

  it('returns challenge data payload for api-table-guid', async () => {
    const app = await createApp();
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
      target:
        | { mode: 'sku'; sku: string; instruction: string }
        | {
            mode: 'compound';
            category: string;
            metric: 'stock';
            order: 'desc';
            instruction: string;
          }
        | {
            mode: 'rating-under-cap';
            priceCapCents: number;
            metric: 'rating';
            order: 'desc';
            instruction: string;
          };
      products: {
        guid: string;
        sku: string;
        category: string;
        stock: number;
        priceCents: number;
        rating: number;
      }[];
    };
    expect(payload.target.instruction).toBeTruthy();
    expect(payload.products.length).toBeGreaterThanOrEqual(5);
    expect(payload.products.length).toBeLessThanOrEqual(20);

    const targetRow = resolveTargetRow(payload);
    expect(targetRow).toBeTruthy();
  });

  it('accepts guid derived from returned api payload', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['api-table-guid']);
    const tabToken = createTabToken(session);

    const dataResponse = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/data?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    const payload = dataResponse.json() as {
      target:
        | { mode: 'sku'; sku: string; instruction: string }
        | {
            mode: 'compound';
            category: string;
            metric: 'stock';
            order: 'desc';
            instruction: string;
          }
        | {
            mode: 'rating-under-cap';
            priceCapCents: number;
            metric: 'rating';
            order: 'desc';
            instruction: string;
          };
      products: {
        guid: string;
        sku: string;
        category: string;
        stock: number;
        priceCents: number;
        rating: number;
      }[];
    };
    const targetRow = resolveTargetRow(payload);
    expect(targetRow).toBeTruthy();

    const submitResponse = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: `answer=${encodeURIComponent(targetRow?.guid ?? '')}`,
    });

    expect([302, 200]).toContain(submitResponse.statusCode);
    const stored = getSession(session.id);
    expect(stored?.resultsByIndex[1]).toBe(true);
  });
});
