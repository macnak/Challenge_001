import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, pick, randomString } from './utils.js';

const MARKERS = [
  { type: 'readonly', label: 'readonly' },
  { type: 'data-signal', label: 'data-signal="true"' },
  { type: 'aria-live', label: 'aria-live="polite"' },
];

export const generateHiddenFieldMetadata = (context: ChallengeContext) => {
  const total = randomInt(100, 200, context.rng);
  const token = `HF-${randomString(8, context.rng)}`.toUpperCase();
  const marker = pick(MARKERS, context.rng);
  const targetIndex = randomInt(0, total - 1, context.rng);

  const fields = shuffle(
    Array.from({ length: total }, (_, idx) => {
      const name = `field_${idx}_${randomString(4, context.rng)}`;
      const isTarget = idx === targetIndex;
      return { name, isTarget };
    }),
    context.rng,
  );

  return {
    token,
    marker,
    fields,
  };
};

export const renderHiddenFieldMetadata = (
  context: ChallengeContext,
  data: {
    token: string;
    marker: { type: string; label: string };
    fields: { name: string; isTarget: boolean }[];
  },
) => {
  const inputs = data.fields
    .map((field) => {
      const markerAttr = field.isTarget
        ? data.marker.type === 'readonly'
          ? 'readonly'
          : data.marker.type === 'data-signal'
            ? 'data-signal="true"'
            : 'aria-live="polite"'
        : '';
      const valueAttr = field.isTarget ? `value="${data.token}"` : '';
      return `<input type="hidden" name="${field.name}" ${markerAttr} ${valueAttr} />`;
    })
    .join('');

  return `
    <h1>Challenge ${context.index}: Hidden Field Metadata</h1>
    <p class="muted">Find the field with metadata marker <strong>${data.marker.label}</strong>. Submit its value.</p>
    <div style="display:none;">
      ${inputs}
    </div>
    <label class="muted" for="answer">Token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateHiddenFieldMetadata = (
  data: { token: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
