import type { ChallengeContext } from './types.js';
import { shuffle, randomString } from './utils.js';

export const generateTokenAssembly = (context: ChallengeContext) => {
  const token = `TA-${randomString(8, context.rng)}`.toUpperCase();
  const parts = token.split('');
  return {
    token,
    parts: shuffle(
      parts.map((value, index) => ({ value, index })),
      context.rng,
    ),
  };
};

export const renderTokenAssembly = (
  context: ChallengeContext,
  data: { parts: { value: string; index: number }[] },
) => {
  const spans = data.parts
    .map(
      (part) =>
        `<span data-order="${part.index}" style="padding:6px 8px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;">${part.value}</span>`,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Token Assembly</h1>
    <p class="muted">Assemble the token by ordering the characters by their data-order attribute.</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">${spans}</div>
    <label class="muted" for="answer">Token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateTokenAssembly = (
  data: { token: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
