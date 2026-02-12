import type { ChallengeContext } from './types.js';
import { randomString } from './utils.js';

export const generateHeaderDerived = (context: ChallengeContext) => {
  const value = `W/"${randomString(8, context.rng)}"`;
  return { header: 'etag', value, hint: 'Use the ETag response header as the answer.' };
};

export const renderHeaderDerived = (context: ChallengeContext, data: { hint: string }) => {
  return `
    <h1>Challenge ${context.index}: Header-derived Value</h1>
    <p class="muted">${data.hint}</p>
    <label class="muted" for="answer">Header value</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateHeaderDerived = (
  data: { value: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.value;
};
