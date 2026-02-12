import type { ChallengeContext } from './types.js';
import { randomString } from './utils.js';

export const generateAutoFilledJs = (context: ChallengeContext) => {
  const value = `AUTO-${randomString(8, context.rng)}`.toUpperCase();
  return { value };
};

export const renderAutoFilledJs = (context: ChallengeContext, data: { value: string }) => {
  return `
    <h1>Challenge ${context.index}: Auto-filled Values</h1>
    <p class="muted">A script will populate the answer automatically.</p>
    <label class="muted" for="answer">Auto value</label>
    <input id="answer" name="answer" type="text" data-auto-value="${data.value}" />
    <script>
      (function(){
        const input = document.getElementById('answer');
        if (input && input.dataset.autoValue) {
          input.value = input.dataset.autoValue;
        }
      })();
    </script>
  `;
};

export const validateAutoFilledJs = (data: { value: string }, payload: Record<string, unknown>) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.value;
};
