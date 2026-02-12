import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, randomString } from './utils.js';

export const generateDecoyInputs = (context: ChallengeContext) => {
  const total = randomInt(8, 16, context.rng);
  const correct = `DV-${randomString(6, context.rng)}`.toUpperCase();
  const targetIndex = randomInt(0, total - 1, context.rng);
  const inputs = shuffle(
    Array.from({ length: total }, (_, idx) => ({
      name: `decoy_${idx}_${randomString(3, context.rng)}`,
      value: idx === targetIndex ? correct : '',
      valid: idx === targetIndex,
    })),
    context.rng,
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
