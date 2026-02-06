import type { FastifyInstance } from 'fastify';
import { getSession } from './session.js';
import { getOrCreateState } from './challenges/engine.js';
import { getChallengeRuntimeById } from './challenges/runtimeIndex.js';

export const registerRealtime = (app: FastifyInstance) => {
  app.get('/session/:sessionId/events', async (request, reply) => {
    const { sessionId } = request.params as { sessionId: string };
    const session = getSession(sessionId);

    if (!session) {
      reply.status(404).send('Session not found');
      return;
    }

    reply.raw
      .writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      .flushHeaders();

    const integrityRuntime = getChallengeRuntimeById('request-integrity');
    const integrityState = getOrCreateState({ session, index: 14 }, integrityRuntime);

    const sseRuntime = getChallengeRuntimeById('sse-delivered');
    const sseState = getOrCreateState({ session, index: 7 }, sseRuntime);

    const integrityPayload = {
      challengeId: integrityRuntime.id,
      type: 'key',
      value: (integrityState.data as { secret?: string }).secret ?? 'missing',
      expiresAt: new Date(session.expiresAt).toISOString(),
    };

    const ssePayload = {
      challengeId: sseRuntime.id,
      type: 'value',
      value: (sseState.data as { value?: string }).value ?? 'missing',
      expiresAt: new Date(session.expiresAt).toISOString(),
    };

    reply.raw.write(`event: challenge.key\n`);
    reply.raw.write(`data: ${JSON.stringify(integrityPayload)}\n\n`);
    reply.raw.write(`event: challenge.data\n`);
    reply.raw.write(`data: ${JSON.stringify(ssePayload)}\n\n`);
  });

  app.get('/session/:sessionId/ws', { websocket: true }, (connection, req) => {
    const { sessionId } = req.params as { sessionId: string };
    const session = getSession(sessionId);
    if (!session) {
      connection.socket.close();
      return;
    }

    connection.socket.on('message', (message: Buffer) => {
      let payload: { type?: string; challengeId?: string } = {};
      try {
        payload = JSON.parse(message.toString());
      } catch {
        connection.socket.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        return;
      }

      if (payload.type !== 'challenge.request' || !payload.challengeId) {
        connection.socket.send(JSON.stringify({ type: 'error', message: 'Invalid request' }));
        return;
      }

      if (payload.challengeId !== 'ws-delivered') {
        connection.socket.send(JSON.stringify({ type: 'error', message: 'Unknown challenge' }));
        return;
      }

      const runtime = getChallengeRuntimeById('ws-delivered');
      const state = getOrCreateState({ session, index: 8 }, runtime);
      connection.socket.send(
        JSON.stringify({
          type: 'challenge.response',
          challengeId: runtime.id,
          value: (state.data as { value?: string }).value ?? 'missing',
          nonce: Math.random().toString(36).slice(2, 8),
        }),
      );
    });
  });
};
