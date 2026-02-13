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

const buildMultipartBody = (
  boundary: string,
  fileFieldName: string,
  filename: string,
  content: string,
) => {
  return [
    `--${boundary}`,
    `Content-Disposition: form-data; name="${fileFieldName}"; filename="${filename}"`,
    'Content-Type: text/plain',
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');
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

describe('multipart upload integration', () => {
  it('accepts valid uploaded file and records success', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['create-upload-file']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('create-upload-file');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as {
      token: string;
      encoding: 'plain' | 'base64';
      expectedFilename: string;
    };

    const fileContent =
      data.encoding === 'base64' ? Buffer.from(data.token, 'utf8').toString('base64') : data.token;
    const boundary = '----challenge001boundary';
    const payload = buildMultipartBody(boundary, 'uploadFile', data.expectedFilename, fileContent);

    const response = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      payload,
    });

    expect([302, 200]).toContain(response.statusCode);
    const stored = getSession(session.id);
    expect(stored?.resultsByIndex[1]).toBe(true);
  });

  it('rejects upload with incorrect filename', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['create-upload-file']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('create-upload-file');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as {
      token: string;
      encoding: 'plain' | 'base64';
      expectedFilename: string;
    };

    const fileContent =
      data.encoding === 'base64' ? Buffer.from(data.token, 'utf8').toString('base64') : data.token;
    const boundary = '----challenge001boundary2';
    const payload = buildMultipartBody(boundary, 'uploadFile', 'wrong-name.txt', fileContent);

    const response = await app.inject({
      method: 'POST',
      url: `/m/${session.accessMethod}/challenge/1/submit?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      payload,
    });

    expect([302, 200]).toContain(response.statusCode);
    const stored = getSession(session.id);
    expect(stored?.resultsByIndex[1]).toBe(false);
  });
});
