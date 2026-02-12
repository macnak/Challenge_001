import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, pick } from './utils.js';

const DELIMITERS = [',', ' ', '\n'];

export const generateSortingSingle = (context: ChallengeContext) => {
  const count = randomInt(10, 20, context.rng);
  const numbers = Array.from({ length: count }, () => randomInt(1, 200, context.rng));
  const order = context.rng() > 0.5 ? 'asc' : 'desc';
  const delimiter = pick(DELIMITERS, context.rng);

  return {
    numbers,
    order,
    delimiter,
    display: shuffle(numbers, context.rng),
  };
};

export const renderSortingSingle = (
  context: ChallengeContext,
  data: { display: number[]; order: string; delimiter: string },
) => {
  const display = data.display.join(', ');
  return `
    <h1>Challenge ${context.index}: Sorting</h1>
    <p class="muted">Sort the numbers in ${data.order === 'asc' ? 'ascending' : 'descending'} order.</p>
    <p class="muted">Use the delimiter: <strong>${data.delimiter === '\n' ? 'newline' : data.delimiter}</strong></p>
    <div class="card" style="margin-top: 16px; background: rgba(255,255,255,0.02);">
      ${display}
    </div>
    <label class="muted" for="answer">Ordered list</label>
    <input id="answer" name="answer" type="text" />
  `;
};

const splitByDelimiter = (value: string, delimiter: string) => {
  if (delimiter === '\n') {
    return value
      .split(/\r?\n/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (delimiter === ' ') {
    return value
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
};

export const validateSortingSingle = (
  data: { numbers: number[]; order: string; delimiter: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  if (!answer) {
    return false;
  }

  const submitted = splitByDelimiter(answer, data.delimiter).map(Number);
  if (submitted.some((value) => Number.isNaN(value))) {
    return false;
  }

  const expected = [...data.numbers].sort((a, b) => (data.order === 'asc' ? a - b : b - a));
  if (submitted.length !== expected.length) {
    return false;
  }

  return submitted.every((value, idx) => value === expected[idx]);
};
