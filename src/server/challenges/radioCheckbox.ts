import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, pick, randomString } from './utils.js';

export const generateRadioCheckbox = (context: ChallengeContext) => {
  const options = Array.from({ length: randomInt(4, 9, context.rng) }, () =>
    `OPT-${randomString(5, context.rng)}`.toUpperCase(),
  );
  const correct = pick(options, context.rng);
  const type = context.rng() > 0.5 ? 'radio' : 'checkbox';

  return { options: shuffle(options, context.rng), correct, type };
};

export const renderRadioCheckbox = (
  context: ChallengeContext,
  data: { options: string[]; correct: string; type: string },
) => {
  const inputs = data.options
    .map(
      (option, index) => `
        <label style="display:block;margin:8px 0;">
          <input type="${data.type}" name="choice" value="${option}" ${index === 0 ? 'checked' : ''} />
          ${option}
        </label>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Selection</h1>
    <p class="muted">Select the value shown here: <strong>${data.correct}</strong></p>
    <div>${inputs}</div>
  `;
};

export const validateRadioCheckbox = (
  data: { correct: string },
  payload: Record<string, unknown>,
) => {
  const value = payload.choice;
  if (Array.isArray(value)) {
    return value.includes(data.correct);
  }
  if (typeof value === 'string') {
    return value === data.correct;
  }

  return false;
};
