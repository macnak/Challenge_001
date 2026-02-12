import type { ChallengeContext } from './types.js';
import { randomString } from './utils.js';

export const generateSseDelivered = (context: ChallengeContext) => {
  const value = `SSE-${randomString(8, context.rng)}`.toUpperCase();
  return { value };
};

export const renderSseDelivered = (context: ChallengeContext) => {
  return `
    <h1>Challenge ${context.index}: SSE Delivered Values</h1>
    <p class="muted">Listen on the SSE stream to obtain the value.</p>
    <p class="muted">Endpoint: <code>/session/${context.session.id}/events</code></p>
    <label class="muted" for="answer">SSE value</label>
    <input id="answer" name="answer" type="hidden" />
    <script>
      (function(){
        if (typeof EventSource === 'undefined') return;
        const input = document.getElementById('answer');
        const source = new EventSource('/session/${context.session.id}/events');
        source.addEventListener('challenge.data', function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.challengeId === 'sse-delivered' && input) {
              input.value = data.value;
              source.close();
            }
          } catch (err) {
            // no-op
          }
        });
      })();
    </script>
  `;
};

export const validateSseDelivered = (data: { value: string }, payload: Record<string, unknown>) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.value;
};
