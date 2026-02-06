import type { FastifyInstance } from 'fastify';
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
  getChallengeRuntimeById,
  getOrCreateState,
} from './challenges/runtimeIndex.js';
import { shuffle } from './challenges/utils.js';

const SESSION_COOKIE = 'challenge_session';

const normalizePayload = (body: unknown) => {
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

export const registerRoutes = (app: FastifyInstance) => {
  app.get('/', async (_request, reply) => {
    const html = renderPage({
      title: 'Challenge 001',
      body: `
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
    const order = shuffle(challengeRuntimes.map((runtime) => runtime.id)).slice(
      0,
      session.pageCount,
    );
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
    const state = getOrCreateState({ session, index: pageIndex }, runtime);
    const challengeMarkup = runtime.render({ session, index: pageIndex }, state.data);

    if (runtime.id === 'header-derived') {
      const headerName = typeof state.data.header === 'string' ? state.data.header : 'etag';
      const headerValue = typeof state.data.value === 'string' ? state.data.value : 'W/"missing"';
      reply.header(headerName, headerValue);
    }

    const submitAction = `/m/${session.accessMethod}/challenge/${pageIndex}/submit?t=${tabToken}`;
    const html = renderPage({
      title: `Challenge ${index}`,
      body: `
        <form method="post" action="${submitAction}">
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
    const state = getOrCreateState({ session, index: pageIndex }, runtime);
    const payload = normalizePayload(request.body);
    const passed = runtime.validate({ session, index: pageIndex }, state.data, payload);

    setChallengeResult(session, pageIndex, passed);
    if (pageIndex >= session.pageCount) {
      reply.redirect(`/m/${session.accessMethod}/summary?t=${tabToken}`);
      return;
    }

    reply.redirect(`/m/${session.accessMethod}/challenge/${pageIndex + 1}?t=${tabToken}`);
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

    const details =
      show === '1'
        ? `<p class="muted">Incorrect pages: ${incorrect.length ? incorrect.join(', ') : 'None'}</p>`
        : '';

    const html = renderPage({
      title: 'Summary',
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
