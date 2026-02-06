import type { ChallengeContext } from './types.js';

export const generateShadowCanvas = () => {
  const token = `SC-${Math.random().toString(36).slice(2, 10)}`.toUpperCase();
  return { token };
};

export const renderShadowCanvas = (context: ChallengeContext, data: { token: string }) => {
  return `
    <h1>Challenge ${context.index}: Shadow DOM / Canvas Token</h1>
    <p class="muted">Token is drawn on canvas. Inspect the canvas element.</p>
    <canvas id="token-canvas" width="320" height="80" data-token="${data.token}"></canvas>
    <script>
      (function(){
        const canvas = document.getElementById('token-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#0B0F1A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00F5FF';
        ctx.font = '20px monospace';
        ctx.fillText(canvas.dataset.token || '', 20, 50);
      })();
    </script>
    <label class="muted" for="answer">Token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateShadowCanvas = (data: { token: string }, payload: Record<string, unknown>) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
