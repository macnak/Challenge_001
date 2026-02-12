import { randomInt, randomString } from './utils.js';
import type { ChallengeContext } from './types.js';

const WHITESPACE = [' ', '\n', '\t', '\r'];

export const generateWhitespaceToken = (context: ChallengeContext) => {
  const token = `TK-${randomString(8, context.rng)}`.toUpperCase();
  const prefix = Array.from(
    { length: randomInt(4, 12, context.rng) },
    () => WHITESPACE[randomInt(0, WHITESPACE.length - 1, context.rng)],
  ).join('');
  const suffix = Array.from(
    { length: randomInt(4, 12, context.rng) },
    () => WHITESPACE[randomInt(0, WHITESPACE.length - 1, context.rng)],
  ).join('');

  return {
    token,
    display: `${prefix}${token}${suffix}`,
  };
};

export const renderWhitespaceToken = (context: ChallengeContext, data: { display: string }) => {
  return `
    <h1>Challenge ${context.index}: Whitespace Token</h1>
    <p class="muted">Extract the token hidden in whitespace.</p>
    <pre style="white-space: pre-wrap;">${data.display}</pre>
    <label class="muted" for="answer">Token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateWhitespaceToken = (
  data: { token: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
