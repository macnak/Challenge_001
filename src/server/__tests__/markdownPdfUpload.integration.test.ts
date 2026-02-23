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
import { markdownToPlainText } from '../challenges/markdownPdfUpload.js';

const apps: FastifyInstance[] = [];

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
    'Content-Type: application/pdf',
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');
};

const buildPseudoPdf = (text: string) => {
  const escaped = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  return `%PDF-1.4\n1 0 obj\n<< /Length 44 >>\nstream\nBT\n(${escaped}) Tj\nET\nendstream\nendobj\ntrailer\n<<>>\n%%EOF`;
};

afterEach(async () => {
  while (apps.length > 0) {
    const app = apps.pop();
    if (app) {
      await app.close();
    }
  }
});

describe('markdown pdf upload challenge integration', () => {
  it('renders multipart upload form controls', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['markdown-pdf-upload']);
    const tabToken = createTabToken(session);

    const page = await app.inject({
      method: 'GET',
      url: `/m/${session.accessMethod}/challenge/1?t=${tabToken}`,
      headers: {
        cookie: `challenge_session=${session.id}`,
      },
    });

    expect(page.statusCode).toBe(200);
    expect(page.body).toContain('enctype="multipart/form-data"');
    expect(page.body).toContain('Source markdown');
    expect(page.body).toContain('accept="application/pdf"');
  });

  it('accepts valid pseudo-pdf upload and records success', async () => {
    const app = await createApp();
    apps.push(app);

    const session = createSession();
    session.pageCount = 1;
    setPageOrder(session, ['markdown-pdf-upload']);
    const tabToken = createTabToken(session);

    const runtime = getChallengeRuntimeById('markdown-pdf-upload');
    const context = buildChallengeContext(session, 1, runtime.id);
    const state = getOrCreateState(context, runtime);
    const data = state.data as { markdown: string; expectedFilename: string };

    const pdf = buildPseudoPdf(markdownToPlainText(data.markdown));
    const boundary = '----challenge001boundary-mdpdf';
    const payload = buildMultipartBody(boundary, 'uploadFile', data.expectedFilename, pdf);

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
    expect(getSession(session.id)?.resultsByIndex[1]).toBe(true);
  });
});
