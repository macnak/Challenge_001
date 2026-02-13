import type { ChallengeContext } from './types.js';
import { pick, randomString } from './utils.js';

type UploadEncoding = 'plain' | 'base64';
type UploadedFilePayload = { filename: string; content: string };

const decodeContent = (content: string, encoding: UploadEncoding) => {
  if (encoding === 'plain') {
    return content;
  }

  try {
    return Buffer.from(content, 'base64').toString('utf8');
  } catch {
    return '';
  }
};

export const generateCreateUploadFile = (context: ChallengeContext) => {
  const token = `UP-${randomString(10, context.rng)}`.toUpperCase();
  const encoding = pick<UploadEncoding>(['plain', 'base64'], context.rng);
  const expectedFilename = `upload-${context.index}-${randomString(4, context.rng)}.txt`;

  return {
    token,
    encoding,
    expectedFilename,
  };
};

export const renderCreateUploadFile = (
  context: ChallengeContext,
  data: { token: string; encoding: UploadEncoding; expectedFilename: string },
) => {
  const encodingInstruction =
    data.encoding === 'base64'
      ? 'Encode the file content using Base64.'
      : 'Use plain text content.';

  return `
    <h1>Challenge ${context.index}: Create and Upload File</h1>
    <p class="muted">Create a local file using the values below, then upload it.</p>
    <ul class="muted">
      <li>Required filename: <strong>${data.expectedFilename}</strong></li>
      <li>Required content token: <strong>${data.token}</strong></li>
      <li>Encoding rule: <strong>${data.encoding}</strong> (${encodingInstruction})</li>
    </ul>
    <label class="muted" for="uploadFile">Upload file</label>
    <input id="uploadFile" name="uploadFile" type="file" />
    <p class="muted">Submit sends the uploaded file for server-side verification.</p>
  `;
};

const getUploadedFile = (payload: Record<string, unknown>): UploadedFilePayload | null => {
  const uploaded = payload.uploadedFile;
  if (uploaded && typeof uploaded === 'object') {
    const filename =
      'filename' in uploaded && typeof uploaded.filename === 'string'
        ? uploaded.filename.trim()
        : '';
    const content =
      'content' in uploaded && typeof uploaded.content === 'string' ? uploaded.content.trim() : '';
    if (filename && content) {
      return { filename, content };
    }
  }

  const fallbackFilename =
    typeof payload.uploadedFileName === 'string' ? payload.uploadedFileName.trim() : '';
  const fallbackContent = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  if (fallbackFilename && fallbackContent) {
    return { filename: fallbackFilename, content: fallbackContent };
  }

  return null;
};

export const validateCreateUploadFile = (
  data: { token: string; encoding: UploadEncoding; expectedFilename: string },
  payload: Record<string, unknown>,
) => {
  const uploadedFile = getUploadedFile(payload);

  if (!uploadedFile || uploadedFile.filename !== data.expectedFilename) {
    return false;
  }

  return decodeContent(uploadedFile.content, data.encoding) === data.token;
};
