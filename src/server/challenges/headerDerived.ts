import type { ChallengeContext } from './types.js';

export const generateHeaderDerived = () => {
  const value = `W/"${Math.random().toString(36).slice(2, 10)}"`;
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
