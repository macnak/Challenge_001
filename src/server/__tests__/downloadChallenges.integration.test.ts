import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyFormbody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { afterEach, describe, expect, it } from 'vitest';
import { registerRoutes } from '../routes.js';
import { createSession, createTabToken, setPageOrder } from '../session.js';
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

describe('download challenge integration', () => {
  it('serves plain download file with expected filename and token content', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['downloaded-file-plain']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('downloaded-file-plain');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as { filename: string; token: string; content: string };

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/download?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.headers['content-disposition']).toBe(`attachment; filename="${data.filename}"`);
    expect(response.body).toBe(data.content);
    expect(response.body).toContain(`TOKEN=${data.token}`);
  });

  it('serves encoded download file with decodable payload', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['downloaded-file-encoded']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('downloaded-file-encoded');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as {
      filename: string;
      token: string;
      encoding: 'base64' | 'hex';
    };

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/download?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-disposition']).toBe(`attachment; filename="${data.filename}"`);

    const lines = response.body.split('\n').map((line) => line.trim());
    const encodingLine = lines.find((line) => line.startsWith('encoding='));
    const payloadLine = lines.find((line) => line.startsWith('payload='));

    expect(encodingLine).toBe(`encoding=${data.encoding}`);
    expect(payloadLine).toBeTruthy();

    const encoded = (payloadLine ?? '').replace('payload=', '');
    const decoded =
      data.encoding === 'hex'
        ? Buffer.from(encoded, 'hex').toString('utf8')
        : Buffer.from(encoded, 'base64').toString('utf8');

    expect(decoded).toBe(data.token);
  });

  it('returns 404 for download endpoint on non-download challenge', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['whitespace-token']);
    const tabToken = createTabToken(session);

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/download?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 404 when tab token is missing', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['downloaded-file-plain']);
    createTabToken(session);

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/download`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 404 when tab token is invalid', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['downloaded-file-plain']);
    createTabToken(session);

    const response = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1/download?t=invalid-tab-token`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 404 when access method path does not match session method', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['downloaded-file-plain']);
    const tabToken = createTabToken(session);

    const wrongMethod = session.accessMethod === 'basic' ? 'jwt' : 'basic';
    const response = await app.inject({
      method: 'GET',
      url: `/m/${wrongMethod}/challenge/1/download?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
