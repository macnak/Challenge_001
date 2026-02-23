import type { FastifyInstance, FastifyRequest } from 'fastify';
import {
  createSession,
  createTabToken,
  getSession,
  setChallengeResult,
  setPageOrder,
  validateTabToken,
} from './session.js';
import { renderPage } from './render.js';
import {
  challengeRuntimes,
  buildChallengeContext,
  filterChallengeRuntimes,
  getChallengeRuntimeById,
  getOrCreateState,
  sortChallengeRuntimes,
} from './challenges/runtimeIndex.js';
import { createSeededRng, shuffle } from './challenges/utils.js';
import { runConfig } from './config.js';
import { buildApiTablePayload } from './challenges/apiTableGuid.js';

const SESSION_COOKIE = 'challenge_session';

const difficultyToTierScore = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 3;
    case 'medium':
      return 6;
    case 'advanced':
      return 8;
    case 'grand-master':
      return 9;
    default:
      return 5;
  }
};

const normalizeBodyPayload = (body: unknown) => {
  if (!body || typeof body !== 'object') {
    return {} as Record<string, unknown>;
  }

  if ('xml' in body && typeof (body as { xml?: string }).xml === 'string') {
    const xml = (body as { xml: string }).xml;
    const answerMatch = xml.match(/<answer>([^<]+)<\/answer>/i);
    return answerMatch ? { answer: answerMatch[1] } : {};
  }

  return body as Record<string, unknown>;
};

const normalizePayload = async (request: FastifyRequest) => {
  if (request.isMultipart()) {
    const payload: Record<string, unknown> = {};

    for await (const part of request.parts()) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();
        const uploaded = {
          filename: part.filename ?? '',
          contentType: part.mimetype ?? '',
          content: buffer.toString('utf8'),
          contentBase64: buffer.toString('base64'),
        };
        payload[part.fieldname] = uploaded;
        if (part.fieldname === 'uploadFile') {
          payload.uploadedFile = uploaded;
        }
      } else {
        payload[part.fieldname] = part.value;
      }
    }

    return payload;
  }

  return normalizeBodyPayload(request.body);
};

export const registerRoutes = (app: FastifyInstance) => {
  app.get('/', async (_request, reply) => {
    const infernoLanding = runConfig.themePack !== 'neutral';
    const html = renderPage({
      title: 'Challenge 001',
      tierScore: 1,
      minimalEffects: infernoLanding,
      body: infernoLanding
        ? `
        <section class="inferno-landing inferno-photo-mode">
          <div class="inferno-photo-hero">
            <img
              class="inferno-photo"
              src="/public/inferno-gate-hero.png"
              alt="Dante-inspired infernal gate"
            />
            <div class="inferno-photo-vignette"></div>
            <p
              class="latin-inscription latin-on-photo"
              tabindex="0"
              title="Abandon all hope, ye who enter here."
              aria-label="Omnem spem relinquite, qui intratis"
            >
              <span class="latin-text">Omnem spem relinquite, qui intratis</span>
              <span class="latin-translation">Abandon all hope, ye who enter here.</span>
            </p>
          </div>
          <h1>Challenge 001</h1>
          <p class="muted">Threshold of the first circle. Precision over speed.</p>
          <p class="muted">Drop your generated gate image in <code>public/inferno-gate-hero.png</code> to replace this scene.</p>
          <p>Every page is a trial. Extract, verify, and submit with discipline.</p>
          <div class="row">
            <a class="button primary inferno-cta" href="/start">Cross the Threshold</a>
          </div>
          <p class="muted" style="margin-top:10px; font-style:italic;">Cowards remain in the Vestibule.</p>
        </section>
      `
        : `
        <h1>Challenge 001</h1>
        <p class="muted">There be dragons beyond this point.</p>
        <p>This challenge is designed to mislead assumptions. Slow down and inspect each page.</p>
        <div class="row">
          <a class="button primary" href="/start">Begin session</a>
        </div>
      `,
    });

    reply.type('text/html').send(html);
  });

  app.get('/start', async (_request, reply) => {
    const session = createSession();
    const tabToken = createTabToken(session);
    const filtered = filterChallengeRuntimes(
      challengeRuntimes,
      runConfig.toolProfileOverride,
      runConfig.difficultyTierOverride,
    );
    const runtimePool = filtered.length ? filtered : challengeRuntimes;
    const orderedPool =
      runConfig.interviewPreset || runConfig.toolProfileOverride || runConfig.difficultyTierOverride
        ? sortChallengeRuntimes(runtimePool)
        : runtimePool;
    const defaultOrder = orderedPool.map((runtime) => runtime.id);
    const order = runConfig.fixedOrder
      ? defaultOrder
      : (() => {
          const rng = runConfig.fixedSeed ? createSeededRng(`${session.seed}:order`) : undefined;
          const shuffled = shuffle(defaultOrder, rng ?? Math.random);
          return shuffled.slice(0, Math.min(session.pageCount, shuffled.length));
        })();
    session.pageCount = order.length;
    setPageOrder(session, order);

    reply
      .setCookie(SESSION_COOKIE, session.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      })
      .redirect(`/m/${session.accessMethod}/challenge/1?t=${tabToken}`);
  });

  app.get('/challenge/:index', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const { index } = request.params as { index: string };
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string }).t
        : undefined;

    if (!session) {
      const html = renderPage({
        title: 'Session expired',
        tierScore: 6,
        body: `
          <h1>Session expired</h1>
          <p class="muted">Time ran out. Final result: <strong>Fail</strong>.</p>
          <div class="row">
            <a class="button primary" href="/start">Start a new run</a>
          </div>
        `,
      });
      reply.type('text/html').send(html);
      return;
    }

    if (!validateTabToken(session, tabToken)) {
      reply.redirect('/start');
      return;
    }

    if (Number(index) > session.pageCount) {
      reply.redirect(`/m/${session.accessMethod}/summary?t=${tabToken}`);
      return;
    }

    reply.redirect(`/m/${session.accessMethod}/challenge/${index}?t=${tabToken}`);
  });

  app.get('/m/:method/challenge/:index', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const { method, index } = request.params as { method: string; index: string };
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string }).t
        : undefined;

    if (!session) {
      const html = renderPage({
        title: 'Session expired',
        tierScore: 6,
        body: `
          <h1>Session expired</h1>
          <p class="muted">Time ran out. Final result: <strong>Fail</strong>.</p>
          <div class="row">
            <a class="button primary" href="/start">Start a new run</a>
          </div>
        `,
      });
      reply.type('text/html').send(html);
      return;
    }

    if (!validateTabToken(session, tabToken)) {
      reply.redirect('/start');
      return;
    }

    if (method !== session.accessMethod) {
      reply.redirect(`/m/${session.accessMethod}/challenge/${index}?t=${tabToken}`);
      return;
    }

    const pageIndex = Number(index);
    if (pageIndex > session.pageCount) {
      reply.redirect(`/m/${session.accessMethod}/summary?t=${tabToken}`);
      return;
    }
    const prevIndex = pageIndex > 1 ? pageIndex - 1 : 1;

    const runtimeId = session.pageOrder[pageIndex - 1];
    const runtime = runtimeId
      ? getChallengeRuntimeById(runtimeId)
      : getChallengeRuntimeById('whitespace-token');
    const context = buildChallengeContext(session, pageIndex, runtime.id);
    const state = getOrCreateState(context, runtime);
    const challengeMarkup = runtime.render(context, state.data);

    if (runtime.id === 'header-derived') {
      const headerName = typeof state.data.header === 'string' ? state.data.header : 'etag';
      const headerValue = typeof state.data.value === 'string' ? state.data.value : 'W/"missing"';
      reply.header(headerName, headerValue);
    }

    const submitAction = `/m/${session.accessMethod}/challenge/${pageIndex}/submit?t=${tabToken}`;
    const multipartChallenges = new Set(['create-upload-file', 'markdown-pdf-upload']);
    const formEnctype = multipartChallenges.has(runtime.id) ? 'enctype="multipart/form-data"' : '';
    const html = renderPage({
      title: `Challenge ${index}`,
      tierScore: difficultyToTierScore(runtime.difficulty),
      body: `
        <form method="post" action="${submitAction}" ${formEnctype}>
          ${challengeMarkup}
          <p class="muted">Session access method: ${session.accessMethod}</p>
          <div class="row">
            <a class="button" href="/m/${session.accessMethod}/challenge/${prevIndex}?t=${tabToken}">Back</a>
            <button class="button primary" type="submit">Submit</button>
          </div>
        </form>
      `,
    });

    reply.type('text/html').send(html);
  });

  app.post('/m/:method/challenge/:index/submit', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const { method, index } = request.params as { method: string; index: string };
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string }).t
        : undefined;

    if (!session) {
      reply.redirect('/');
      return;
    }

    if (!validateTabToken(session, tabToken)) {
      reply.redirect('/start');
      return;
    }

    if (method !== session.accessMethod) {
      reply.redirect(`/m/${session.accessMethod}/challenge/${index}?t=${tabToken}`);
      return;
    }

    const pageIndex = Number(index);
    if (pageIndex > session.pageCount) {
      reply.redirect(`/m/${session.accessMethod}/summary?t=${tabToken}`);
      return;
    }
    const runtimeId = session.pageOrder[pageIndex - 1];
    const runtime = runtimeId
      ? getChallengeRuntimeById(runtimeId)
      : getChallengeRuntimeById('whitespace-token');
    const context = buildChallengeContext(session, pageIndex, runtime.id);
    const state = getOrCreateState(context, runtime);
    const payload = await normalizePayload(request);
    const passed = runtime.validate(context, state.data, payload);

    setChallengeResult(session, pageIndex, passed);
    if (runConfig.showPerPageResults) {
      const nextIndex = pageIndex + 1;
      const nextHref =
        nextIndex > session.pageCount
          ? `/m/${session.accessMethod}/summary?t=${tabToken}`
          : `/m/${session.accessMethod}/challenge/${nextIndex}?t=${tabToken}`;
      const retryHref = `/m/${session.accessMethod}/challenge/${pageIndex}?t=${tabToken}`;
      const allowContinue = passed || !runConfig.blockContinueOnFailure;
      const explanation =
        runConfig.showPerPageExplanation && !passed && runtime.explain
          ? `
            <div class="card" style="margin-top:16px;">
              <p class="muted" style="margin:0;"><strong>Explanation:</strong> ${runtime.explain}</p>
            </div>
          `
          : '';
      const html = renderPage({
        title: `Challenge ${pageIndex} Result`,
        tierScore: difficultyToTierScore(runtime.difficulty),
        body: `
          <h1>Challenge ${pageIndex} Result</h1>
          <p class="muted">Result: <strong>${passed ? 'Correct' : 'Incorrect'}</strong></p>
          ${explanation}
          <div class="row">
            <a class="button" href="${retryHref}">Retry</a>
            ${allowContinue ? `<a class="button primary" href="${nextHref}">Continue</a>` : ''}
          </div>
        `,
      });

      reply.type('text/html').send(html);
      return;
    }
    if (pageIndex >= session.pageCount) {
      reply.redirect(`/m/${session.accessMethod}/summary?t=${tabToken}`);
      return;
    }

    reply.redirect(`/m/${session.accessMethod}/challenge/${pageIndex + 1}?t=${tabToken}`);
  });

  app.get('/m/:method/challenge/:index/download', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const { method, index } = request.params as { method: string; index: string };
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string }).t
        : undefined;

    if (!session) {
      reply.code(404).type('text/plain').send('Session not found');
      return;
    }

    if (!validateTabToken(session, tabToken)) {
      reply.code(404).type('text/plain').send('Not found');
      return;
    }

    if (method !== session.accessMethod) {
      reply.code(404).type('text/plain').send('Not found');
      return;
    }

    const pageIndex = Number(index);
    if (Number.isNaN(pageIndex) || pageIndex < 1 || pageIndex > session.pageCount) {
      reply.code(404).type('text/plain').send('Not found');
      return;
    }

    const runtimeId = session.pageOrder[pageIndex - 1];
    const runtime = runtimeId
      ? getChallengeRuntimeById(runtimeId)
      : getChallengeRuntimeById('whitespace-token');

    const downloadableIds = new Set(['downloaded-file-plain', 'downloaded-file-encoded']);
    if (!downloadableIds.has(runtime.id)) {
      reply.code(404).type('text/plain').send('Not found');
      return;
    }

    const context = buildChallengeContext(session, pageIndex, runtime.id);
    const state = getOrCreateState(context, runtime);
    const filename =
      typeof state.data.filename === 'string' ? state.data.filename : `challenge-${pageIndex}.txt`;
    const content = typeof state.data.content === 'string' ? state.data.content : '';

    reply
      .header('Content-Type', 'text/plain; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .send(content);
  });

  app.get('/m/:method/challenge/:index/data', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const { method, index } = request.params as { method: string; index: string };
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string }).t
        : undefined;

    if (!session) {
      reply.code(404).type('application/json').send({ error: 'session_not_found' });
      return;
    }

    if (!validateTabToken(session, tabToken)) {
      reply.code(404).type('application/json').send({ error: 'not_found' });
      return;
    }

    if (method !== session.accessMethod) {
      reply.code(404).type('application/json').send({ error: 'not_found' });
      return;
    }

    const pageIndex = Number(index);
    if (Number.isNaN(pageIndex) || pageIndex < 1 || pageIndex > session.pageCount) {
      reply.code(404).type('application/json').send({ error: 'not_found' });
      return;
    }

    const runtimeId = session.pageOrder[pageIndex - 1];
    const runtime = runtimeId
      ? getChallengeRuntimeById(runtimeId)
      : getChallengeRuntimeById('whitespace-token');

    if (runtime.id !== 'api-table-guid') {
      reply.code(404).type('application/json').send({ error: 'not_found' });
      return;
    }

    const context = buildChallengeContext(session, pageIndex, runtime.id);
    const state = getOrCreateState(context, runtime);
    const payload = buildApiTablePayload(
      state.data as {
        products: {
          guid: string;
          sku: string;
          name: string;
          category: string;
          priceCents: number;
          stock: number;
          rating: number;
        }[];
        targetRule:
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
      },
    );

    reply.type('application/json').send(payload);
  });

  app.get('/m/:method/summary', async (request, reply) => {
    const sessionId = request.cookies[SESSION_COOKIE];
    const session = getSession(sessionId);
    const tabToken =
      request.query && typeof request.query === 'object'
        ? (request.query as { t?: string; show?: string }).t
        : undefined;
    const show =
      request.query && typeof request.query === 'object'
        ? (request.query as { show?: string }).show
        : undefined;

    if (!session || !validateTabToken(session, tabToken)) {
      reply.redirect('/start');
      return;
    }

    const incorrect = Array.from({ length: session.pageCount }, (_, idx) => idx + 1).filter(
      (idx) => session.resultsByIndex[idx] !== true,
    );
    const passed =
      incorrect.length === 0 && Object.keys(session.resultsByIndex).length >= session.pageCount;

    const incorrectDetails = incorrect
      .map((idx) => {
        const runtimeId = session.pageOrder[idx - 1];
        const runtime = runtimeId ? getChallengeRuntimeById(runtimeId) : undefined;
        const title = runtime?.title ?? 'Unknown Challenge';
        return `<li>${idx} — ${title}</li>`;
      })
      .join('');

    const details =
      show === '1'
        ? incorrect.length
          ? `
            <p class="muted">Incorrect pages:</p>
            <ul class="muted">
              ${incorrectDetails}
            </ul>
          `
          : '<p class="muted">Incorrect pages: None</p>'
        : '';

    const html = renderPage({
      title: 'Summary',
      tierScore: passed ? 3 : 6,
      body: `
        <h1>Final Summary</h1>
        <p class="muted">Result: <strong>${passed ? 'Pass' : 'Fail'}</strong></p>
        <div class="row">
          <a class="button primary" href="/start">Start new session</a>
          <a class="button" href="/m/${session.accessMethod}/summary?t=${tabToken}&show=1">Reveal incorrect pages</a>
        </div>
        ${details}
      `,
    });

    reply.type('text/html').send(html);
  });
};
