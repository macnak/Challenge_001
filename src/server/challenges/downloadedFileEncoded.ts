import type { ChallengeContext } from './types.js';
import { pick, randomString } from './utils.js';

type Encoding = 'base64' | 'hex';

const encodeToken = (token: string, encoding: Encoding) => {
  if (encoding === 'hex') {
    return Buffer.from(token, 'utf8').toString('hex');
  }

  return Buffer.from(token, 'utf8').toString('base64');
};

const decodeToken = (value: string, encoding: Encoding) => {
  try {
    if (encoding === 'hex') {
      return Buffer.from(value, 'hex').toString('utf8');
    }

    return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return '';
  }
};

export const generateDownloadedFileEncoded = (context: ChallengeContext) => {
  const token = `ENC-${randomString(12, context.rng)}`.toUpperCase();
  const encoding = pick<Encoding>(['base64', 'hex'], context.rng);
  const filename = `challenge-${context.index}-${encoding}.dat`;
  const encoded = encodeToken(token, encoding);
  const content = `encoding=${encoding}\npayload=${encoded}\n`;

  return {
    token,
    encoding,
    filename,
    content,
  };
};

export const renderDownloadedFileEncoded = (
  context: ChallengeContext,
  data: { encoding: Encoding; filename: string },
) => {
  const downloadPath = `/m/${context.session.accessMethod}/challenge/${context.index}/download`;
  return `
    <h1>Challenge ${context.index}: Encoded Download Token</h1>
    <p class="muted">A file is downloaded when this page loads. Decode it and submit the token.</p>
    <p class="muted">Decode rule for this session: <strong>${data.encoding}</strong></p>
    <p class="muted">Expected download name: <strong>${data.filename}</strong></p>
    <div class="row" style="margin-bottom: 12px;">
      <a id="downloadLink" class="button" href="${downloadPath}">Download encoded file</a>
    </div>
    <label class="muted" for="answer">Decoded token</label>
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

export const validateDownloadedFileEncoded = (
  data: { token: string; encoding: Encoding },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  if (!answer) {
    return false;
  }

  if (answer === data.token) {
    return true;
  }

  return decodeToken(answer, data.encoding) === data.token;
};
