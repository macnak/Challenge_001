import type { ChallengeContext } from './types.js';
import { randomInt } from './utils.js';

export const generateTimingWindow = () => {
  const minDelayMs = randomInt(2000, 6000);
  const maxDelayMs = randomInt(12000, 20000);
  const createdAt = Date.now();

  return {
    createdAt,
    minDelayMs,
    maxDelayMs,
  };
};

export const renderTimingWindow = (
  context: ChallengeContext,
  data: { minDelayMs: number; maxDelayMs: number },
) => {
  return `
    <h1>Challenge ${context.index}: Timing Window</h1>
    <p class="muted">Submit after <strong>${Math.round(data.minDelayMs / 1000)}s</strong> and before <strong>${Math.round(data.maxDelayMs / 1000)}s</strong>.</p>
    <label class="muted" for="answer">Type READY</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateTimingWindow = (
  data: { createdAt: number; minDelayMs: number; maxDelayMs: number },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  const now = Date.now();
  const elapsed = now - data.createdAt;
  const withinWindow = elapsed >= data.minDelayMs && elapsed <= data.maxDelayMs;
  return withinWindow && answer.toUpperCase() === 'READY';
};
