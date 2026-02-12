import type { ChallengeContext } from './types.js';
import { randomInt, shuffle, pick, randomString } from './utils.js';

const MARKERS = [
  { type: 'readonly', label: 'readonly' },
  { type: 'data-signal', label: 'data-signal="true"' },
  { type: 'aria-live', label: 'aria-live="polite"' },
];

export const generateHiddenFieldMetadataAuto = (context: ChallengeContext) => {
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

export const renderHiddenFieldMetadataAuto = (
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
    <h1>Challenge ${context.index}: Hidden Field Metadata (Auto)</h1>
    <p class="muted">Submit the form. Hidden fields contain the correct value.</p>
    <div style="display:none;">
      ${inputs}
    </div>
  `;
};

export const validateHiddenFieldMetadataAuto = (
  data: { token: string },
  payload: Record<string, unknown>,
) => {
  return Object.values(payload).some((value) =>
    typeof value === 'string' ? value.trim() === data.token : false,
  );
};
