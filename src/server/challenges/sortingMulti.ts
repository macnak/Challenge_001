import type { ChallengeContext } from './types.js';
import { randomInt, shuffle } from './utils.js';

export const generateSortingMulti = (context: ChallengeContext) => {
  const count = randomInt(10, 20, context.rng);
  const numbers = Array.from({ length: count }, () => randomInt(1, 200, context.rng));
  const order = context.rng() > 0.5 ? 'asc' : 'desc';

  return {
    numbers,
    order,
    display: shuffle(numbers, context.rng),
  };
};

export const renderSortingMulti = (
  context: ChallengeContext,
  data: { display: number[]; order: string },
) => {
  const rows = data.display
    .map(
      (value, idx) => `
        <div style="display:flex;align-items:center;gap:12px;margin:8px 0;">
          <span>${value}</span>
          <input name="answer" type="text" placeholder="Position ${idx + 1}" />
        </div>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Sorting (Multi Input)</h1>
    <p class="muted">Order the values in ${data.order === 'asc' ? 'ascending' : 'descending'} order.</p>
    <p class="muted">Enter the ordered list into the inputs next to each number (top to bottom).</p>
    <div>${rows}</div>
  `;
};

export const validateSortingMulti = (
  data: { numbers: number[]; order: string },
  payload: Record<string, unknown>,
) => {
  const values = payload.answer;
  const submitted = Array.isArray(values) ? values : typeof values === 'string' ? [values] : [];
  if (submitted.length !== data.numbers.length) {
    return false;
  }

  const parsed = submitted.map((entry) => Number(String(entry).trim()));
  if (parsed.some((value) => Number.isNaN(value))) {
    return false;
  }

  const expected = [...data.numbers].sort((a, b) => (data.order === 'asc' ? a - b : b - a));
  return parsed.every((value, idx) => value === expected[idx]);
};
