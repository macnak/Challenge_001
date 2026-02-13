import type { ChallengeContext } from './types.js';
import { pick, randomString } from './utils.js';

const phrases = [
  'The maze remembers every careless assumption.',
  'Look twice before trusting the first selector.',
  'Slow scripts usually beat brittle scripts.',
  'Deterministic seeds still reward careful parsing.',
];

export const generateDownloadedFilePlain = (context: ChallengeContext) => {
  const token = `FILE-${randomString(10, context.rng)}`.toUpperCase();
  const sentence = pick(phrases, context.rng);
  const filename = `challenge-${context.index}-${randomString(4, context.rng)}.txt`;
  const content = `${sentence}\nTOKEN=${token}\n`;

  return {
    token,
    filename,
    content,
  };
};

export const renderDownloadedFilePlain = (
  context: ChallengeContext,
  data: { filename: string },
) => {
  const downloadPath = `/m/${context.session.accessMethod}/challenge/${context.index}/download`;
  return `
    <h1>Challenge ${context.index}: Downloaded File Token</h1>
    <p class="muted">A file is downloaded when this page loads. Read it and submit the token.</p>
    <p class="muted">Expected download name: <strong>${data.filename}</strong></p>
    <div class="row" style="margin-bottom: 12px;">
      <a id="downloadLink" class="button" href="${downloadPath}">Download file</a>
    </div>
    <label class="muted" for="answer">Token from downloaded file</label>
    <input id="answer" name="answer" type="text" autocomplete="off" />
    <script>
      (function(){
        const params = new URLSearchParams(window.location.search);
        const token = params.get('t') || '';
        const url = token ? '${downloadPath}?t=' + encodeURIComponent(token) : '${downloadPath}';
        const link = document.getElementById('downloadLink');
        if (link) {
          link.setAttribute('href', url);
        }
        setTimeout(function(){
          const a = document.createElement('a');
          a.href = url;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        }, 30);
      })();
    </script>
  `;
};

export const validateDownloadedFilePlain = (
  data: { token: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
