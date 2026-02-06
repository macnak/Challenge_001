import type { ChallengeContext } from './types.js';
import { shuffle } from './utils.js';

export const generateDomShuffling = () => {
  const tokens = Array.from({ length: 6 }, () =>
    `DOM-${Math.random().toString(36).slice(2, 6)}`.toUpperCase(),
  );
  const correct = tokens[Math.floor(Math.random() * tokens.length)];
  const items = shuffle(tokens.map((value) => ({ value, isTarget: value === correct })));
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
