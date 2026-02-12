import type { ChallengeContext } from './types.js';
import { shuffle, randomString, randomInt } from './utils.js';

export const generateDomShuffling = (context: ChallengeContext) => {
  const tokens = Array.from({ length: 6 }, () =>
    `DOM-${randomString(4, context.rng)}`.toUpperCase(),
  );
  const correct = tokens[randomInt(0, tokens.length - 1, context.rng)];
  const items = shuffle(
    tokens.map((value) => ({ value, isTarget: value === correct })),
    context.rng,
  );
  return { items, correct };
};

export const renderDomShuffling = (
  context: ChallengeContext,
  data: { items: { value: string; isTarget: boolean }[] },
) => {
  const list = data.items
    .map(
      (item) => `
        <div class="card" style="margin:8px 0; padding:12px; background: rgba(255,255,255,0.03);">
          <span ${item.isTarget ? 'data-role="anchor"' : ''}>${item.value}</span>
        </div>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: DOM Shuffling</h1>
    <p class="muted">Find the item marked with <code>data-role="anchor"</code> and submit its value.</p>
    ${list}
    <label class="muted" for="answer">Value</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateDomShuffling = (
  data: { correct: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.correct;
};
