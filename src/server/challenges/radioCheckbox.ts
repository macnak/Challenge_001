import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, pick } from './utils.js';

export const generateRadioCheckbox = () => {
  const options = Array.from({ length: randomInt(4, 9) }, () =>
    `OPT-${Math.random().toString(36).slice(2, 7)}`.toUpperCase(),
  );
  const correct = pick(options);
  const type = Math.random() > 0.5 ? 'radio' : 'checkbox';

  return { options: shuffle(options), correct, type };
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
