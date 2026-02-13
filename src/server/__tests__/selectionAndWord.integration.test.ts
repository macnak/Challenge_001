import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { afterEach, describe, expect, it } from 'vitest';
import { registerRoutes } from '../routes.js';
import { createSession, createTabToken, getSession, setPageOrder } from '../session.js';
import {
  buildChallengeContext,
  getChallengeRuntimeById,
  getOrCreateState,
} from '../challenges/runtimeIndex.js';

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

describe('selection and word challenge integration', () => {
  it('renders expected page controls before submit', async () => {
    const app = await createApp();
    apps.push(app);

    const selectionSession = createSession();
    selectionSession.pageCount = 1;
    setPageOrder(selectionSession, ['large-pool-selection']);
    const selectionToken = createTabToken(selectionSession);

    const selectionPage = await app.inject({
      method: 'GET',
      url: `/m/${selectionSession.accessMethod}/challenge/1?t=${selectionToken}`,
      headers: {
        cookie: `challenge_session=${selectionSession.id}`,
      },
    });

    expect(selectionPage.statusCode).toBe(200);
    expect(selectionPage.body).toContain('Challenge 1: Large-pool Selection');
    expect(selectionPage.body).toContain('name="choice"');
    expect(selectionPage.body).toMatch(/type="(checkbox|radio)"/);

    const wordSession = createSession();
    wordSession.pageCount = 1;
    setPageOrder(wordSession, ['word-order-position']);
    const wordToken = createTabToken(wordSession);

    const wordPage = await app.inject({
      method: 'GET',
      url: `/m/${wordSession.accessMethod}/challenge/1?t=${wordToken}`,
      headers: {
        cookie: `challenge_session=${wordSession.id}`,
      },
    });

    expect(wordPage.statusCode).toBe(200);
    expect(wordPage.body).toContain('Challenge 1: Word Order Position');
    expect(wordPage.body).toContain('id="answer"');
    expect(wordPage.body).toContain('name="answer"');
  });

  it('accepts and rejects submissions for large-pool-selection', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['large-pool-selection']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('large-pool-selection');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as {
      selectionType: 'checkbox' | 'radio';
      targets: string[];
    };

    const successPayload =
      data.selectionType === 'checkbox'
        ? data.targets.map((item) => `choice=${encodeURIComponent(item)}`).join('&')
        : `choice=${encodeURIComponent(data.targets[0])}`;

    const successResponse = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: successPayload,
    });

    expect([302, 200]).toContain(successResponse.statusCode);
    expect(getSession(session.id)?.resultsByIndex[1]).toBe(true);

    const failurePayload =
      data.selectionType === 'checkbox'
        ? `choice=${encodeURIComponent(data.targets[0])}`
        : 'choice=Definitely-Wrong-Option';

    const failureResponse = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: failurePayload,
    });

    expect([302, 200]).toContain(failureResponse.statusCode);
    expect(getSession(session.id)?.resultsByIndex[1]).toBe(false);
  });

  it('accepts and rejects submissions for word-order-position', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['word-order-position']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('word-order-position');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as { expected: string };

    const successResponse = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: `answer=${encodeURIComponent(data.expected)}`,
    });

    expect([302, 200]).toContain(successResponse.statusCode);
    expect(getSession(session.id)?.resultsByIndex[1]).toBe(true);

    const failureResponse = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      payload: `answer=${encodeURIComponent(`${data.expected}x`)}`,
    });

    expect([302, 200]).toContain(failureResponse.statusCode);
    expect(getSession(session.id)?.resultsByIndex[1]).toBe(false);
  });
});
