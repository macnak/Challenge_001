import type { ChallengeContext } from './types.js';
import { randomInt, shuffle } from './utils.js';

export const generateDecoyInputs = () => {
  const total = randomInt(8, 16);
  const correct = `DV-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  const targetIndex = randomInt(0, total - 1);
  const inputs = shuffle(
    Array.from({ length: total }, (_, idx) => ({
      name: `decoy_${idx}_${Math.random().toString(36).slice(2, 5)}`,
      value: idx === targetIndex ? correct : '',
      valid: idx === targetIndex,
    })),
  );

  return { inputs, correct };
};

export const renderDecoyInputs = (
  context: ChallengeContext,
  data: { inputs: { name: string; value: string; valid: boolean }[] },
) => {
  const fields = data.inputs
    .map(
      (input) => `
        <input type="text" name="${input.name}" value="${input.value}"
          ${input.valid ? 'data-valid="true" style="border-color: var(--accent);"' : ''} />
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Decoy Inputs</h1>
    <p class="muted">Find the input marked with <code>data-valid="true"</code> and submit its value.</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
      ${fields}
    </div>
    <label class="muted" for="answer">Value</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateDecoyInputs = (
  data: { correct: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.correct;
};
