import crypto from 'node:crypto';
import type { ChallengeContext } from './types.js';
import { randomHex } from './utils.js';

export const generateRequestIntegrity = (context: ChallengeContext) => {
  const secret = randomHex(16, context.rng);
  const nonce = randomHex(6, context.rng);
  return { secret, nonce };
};

export const renderRequestIntegrity = (context: ChallengeContext, data: { nonce: string }) => {
  return `
    <h1>Challenge ${context.index}: Request Integrity</h1>
    <p class="muted">Compute HMAC-SHA256 over the nonce using the secret delivered via SSE.</p>
    <p class="muted">Nonce: <strong>${data.nonce}</strong></p>
    <label class="muted" for="answer">HMAC</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateRequestIntegrity = (
  data: { secret: string; nonce: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  const expected = crypto.createHmac('sha256', data.secret).update(data.nonce).digest('hex');
  return answer === expected;
};
