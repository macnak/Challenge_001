import type { ChallengeContext } from './types.js';
import { pick, randomString } from './utils.js';

type SelectorType = 'data-key' | 'aria-label' | 'data-testid';

const SELECTOR_TYPES: SelectorType[] = ['data-key', 'aria-label', 'data-testid'];
const STABLE_KEY = 'signal';

export const generateSelectorVariant = (context: ChallengeContext, variant: 'a' | 'b') => {
  const value = `${variant.toUpperCase()}-${randomString(6, context.rng)}`.toUpperCase();
  const selectorType = pick(SELECTOR_TYPES, context.rng);
  const decoys = [randomString(5, context.rng), randomString(5, context.rng)];
  return { value, selectorType, stableKey: STABLE_KEY, decoys };
};

const buildAttr = (selectorType: SelectorType, stableKey: string) => {
  if (selectorType === 'aria-label') {
    return `aria-label="${stableKey}"`;
  }
  return `${selectorType}="${stableKey}"`;
};

export const renderSelectorVariant = (
  context: ChallengeContext,
  data: { value: string; selectorType: SelectorType; stableKey: string; decoys: string[] },
) => {
  const attr = buildAttr(data.selectorType, data.stableKey);
  return `
    <h1>Challenge ${context.index}: Selector Variant</h1>
    <p class="muted">Find the element with key <strong>${data.stableKey}</strong>. The selector type changes.</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <span>${data.decoys[0]}</span>
      <span ${attr} style="padding:6px 10px;border:1px solid rgba(255,255,255,0.1);">${data.value}</span>
      <span>${data.decoys[1]}</span>
    </div>
    <label class="muted" for="answer">Value</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateSelectorVariant = (
  data: { value: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.value;
};
