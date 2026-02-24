import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type PageTimeoutIdleData = {
  token: string;
  issuedAt: number;
  idleTimeoutMs: number;
  refreshCount: number;
};

const makeToken = () => `TO-${randomHex(5).toUpperCase()}`;

export const generatePageTimeoutIdle = (_context: ChallengeContext): PageTimeoutIdleData => {
  return {
    token: makeToken(),
    issuedAt: Date.now(),
    idleTimeoutMs: randomInt(8, 15) * 1000,
    refreshCount: 0,
  };
};

export const refreshPageTimeoutIdle = (data: PageTimeoutIdleData): PageTimeoutIdleData => {
  return {
    ...data,
    token: makeToken(),
    issuedAt: Date.now(),
    refreshCount: data.refreshCount + 1,
  };
};

export const renderPageTimeoutIdle = (context: ChallengeContext, data: PageTimeoutIdleData) => {
  const timeoutSeconds = Math.round(data.idleTimeoutMs / 1000);
  const refreshHref = `/m/${context.session.accessMethod}/challenge/${context.index}/timeout-idle/refresh${context.tabToken ? `?t=${context.tabToken}` : ''}`;

  return `
    <h1>Challenge ${context.index}: Page Idle Timeout</h1>
    <p class="muted">Submit the token before idle timeout expires.</p>
    <ul class="muted">
      <li>Token: <strong>${data.token}</strong></li>
      <li>Idle timeout window: <strong>${timeoutSeconds}s</strong></li>
      <li>Refresh count: <strong>${data.refreshCount}</strong></li>
    </ul>
    <p class="muted">If the token expires, refresh to generate a new token.</p>
    <div class="row" style="margin: 8px 0 14px;">
      <a class="button" href="${refreshHref}">Refresh token</a>
    </div>
    <label class="muted" for="answer">Token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validatePageTimeoutIdle = (
  data: PageTimeoutIdleData,
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  if (!answer || answer !== data.token) {
    return false;
  }

  return Date.now() - data.issuedAt <= data.idleTimeoutMs;
};
