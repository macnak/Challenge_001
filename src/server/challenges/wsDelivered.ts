import type { ChallengeContext } from './types.js';
import { randomString } from './utils.js';

export const generateWsDelivered = (context: ChallengeContext) => {
  const value = `WS-${randomString(8, context.rng)}`.toUpperCase();
  return { value };
};

export const renderWsDelivered = (context: ChallengeContext) => {
  return `
    <h1>Challenge ${context.index}: WebSocket Delivered Values</h1>
    <p class="muted">Connect to WebSocket and request the challenge value.</p>
    <p class="muted">Endpoint: <code>/session/${context.session.id}/ws</code></p>
    <p class="muted">Send: { "type": "challenge.request", "challengeId": "ws-delivered" }</p>
    <label class="muted" for="answer">WS value</label>
    <input id="answer" name="answer" type="hidden" />
    <script>
      (function(){
        const input = document.getElementById('answer');
        const socket = new WebSocket('ws://' + location.host + '/session/${context.session.id}/ws');
        socket.addEventListener('open', function(){
          socket.send(JSON.stringify({ type: 'challenge.request', challengeId: 'ws-delivered' }));
        });
        socket.addEventListener('message', function(event){
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'challenge.response' && data.challengeId === 'ws-delivered' && input) {
              input.value = data.value;
              socket.close();
            }
          } catch (err) {
            // no-op
          }
        });
      })();
    </script>
  `;
};

export const validateWsDelivered = (data: { value: string }, payload: Record<string, unknown>) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.value;
};
