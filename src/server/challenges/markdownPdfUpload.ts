import { createHash } from 'node:crypto';
import type { ChallengeContext } from './types.js';
import { pick, randomString } from './utils.js';

type UploadedFilePayload = {
  filename: string;
  content: string;
  contentBase64?: string;
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const normalizeUnicodePunctuation = (value: string) => {
  return value
    .replace(/[\u2018\u2019\u2032]/g, "'")
    .replace(/[\u201C\u201D\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u00A0/g, ' ');
};

export const normalizePdfText = (value: string) => {
  const normalizedLines = normalizeUnicodePunctuation(value)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim().replace(/[\t ]+/g, ' '));

  const collapsed = normalizedLines.join('\n').replace(/\n{3,}/g, '\n\n');
  return collapsed.trim();
};

const stripMarkdownDecorators = (markdown: string) => {
  return markdown
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, ''),
    )
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
};

export const markdownToPlainText = (markdown: string) => {
  return normalizePdfText(stripMarkdownDecorators(markdown));
};

const hashText = (value: string) => {
  return createHash('sha256').update(value).digest('hex');
};

const unescapePdfLiteral = (value: string) => {
  return value
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');
};

export const extractPdfTextHeuristic = (pdfBuffer: Buffer) => {
  const pdfLatin1 = pdfBuffer.toString('latin1');
  const extracted: string[] = [];

  const tjRegex = /\(([^)]*)\)\s*Tj/g;
  for (const match of pdfLatin1.matchAll(tjRegex)) {
    extracted.push(unescapePdfLiteral(match[1]));
  }

  const tjArrayRegex = /\[(.*?)\]\s*TJ/gs;
  for (const match of pdfLatin1.matchAll(tjArrayRegex)) {
    const segment = match[1];
    const tokenRegex = /\(([^)]*)\)/g;
    for (const tokenMatch of segment.matchAll(tokenRegex)) {
      extracted.push(unescapePdfLiteral(tokenMatch[1]));
    }
  }

  if (extracted.length === 0) {
    return '';
  }

  return extracted.join('\n');
};

const getUploadedFile = (payload: Record<string, unknown>): UploadedFilePayload | null => {
  const uploaded = payload.uploadedFile;
  if (uploaded && typeof uploaded === 'object') {
    const filename =
      'filename' in uploaded && typeof uploaded.filename === 'string'
        ? uploaded.filename.trim()
        : '';
    const content =
      'content' in uploaded && typeof uploaded.content === 'string' ? uploaded.content : '';
    const contentBase64 =
      'contentBase64' in uploaded && typeof uploaded.contentBase64 === 'string'
        ? uploaded.contentBase64
        : undefined;

    if (filename && (content || contentBase64)) {
      return { filename, content, contentBase64 };
    }
  }

  return null;
};

const pdfHeader = Buffer.from('%PDF-');

const toPdfBuffer = (uploadedFile: UploadedFilePayload) => {
  if (uploadedFile.contentBase64) {
    try {
      return Buffer.from(uploadedFile.contentBase64, 'base64');
    } catch {
      return Buffer.from(uploadedFile.content, 'utf8');
    }
  }

  return Buffer.from(uploadedFile.content, 'utf8');
};

const markdownTemplates = [
  (token: string) =>
    `# Training Artifact\n\nThis run validates **Markdown to PDF** conversion.\n\n- Keep line ordering stable\n- Preserve paragraph text\n- Include token: ${token}\n\nSubmission note: convert this content to PDF and upload.`,
  (token: string) =>
    `## Conversion Challenge\n\nUse your workflow to convert the markdown into a PDF document.\n\n1. Read all lines\n2. Preserve wording\n3. Keep token: ${token}\n\n\`inline sample\`: deterministic output matters.`,
  (token: string) =>
    `# Internal Training\n\nParagraph A: This challenge checks normalized text extraction from PDF uploads.\n\nParagraph B: token ${token}\n\n- bullet one\n- bullet two\n\nFinish by uploading the generated PDF.`,
];

export const generateMarkdownPdfUpload = (context: ChallengeContext) => {
  const token = `MPDF-${randomString(10, context.rng)}`.toUpperCase();
  const expectedFilename = `markdown-${context.index}-${randomString(4, context.rng)}.pdf`;
  const markdown = pick(markdownTemplates, context.rng)(token);
  const expectedPlainText = markdownToPlainText(markdown);
  const expectedHash = hashText(expectedPlainText);

  return {
    token,
    markdown,
    expectedFilename,
    expectedHash,
  };
};

export const renderMarkdownPdfUpload = (
  context: ChallengeContext,
  data: { markdown: string; expectedFilename: string },
) => {
  return `
    <h1>Challenge ${context.index}: Markdown to PDF Upload</h1>
    <p class="muted">Extract the markdown below, convert it to a PDF, and upload that PDF.</p>
    <p class="muted">Expected filename: <strong>${data.expectedFilename}</strong></p>
    <p class="muted">Normalization rules are strict (line endings, spaces, and repeated blank lines).</p>
    <label class="muted" for="sourceMarkdown">Source markdown</label>
    <textarea id="sourceMarkdown" rows="14" disabled>${escapeHtml(data.markdown)}</textarea>
    <label class="muted" for="uploadFile">Upload PDF</label>
    <input id="uploadFile" name="uploadFile" type="file" accept="application/pdf" />
  `;
};

export const validateMarkdownPdfUpload = (
  data: { expectedFilename: string; expectedHash: string },
  payload: Record<string, unknown>,
) => {
  const uploadedFile = getUploadedFile(payload);
  if (!uploadedFile) {
    return false;
  }

  if (uploadedFile.filename !== data.expectedFilename) {
    return false;
  }

  const pdfBuffer = toPdfBuffer(uploadedFile);
  if (
    pdfBuffer.length < pdfHeader.length ||
    !pdfBuffer.subarray(0, pdfHeader.length).equals(pdfHeader)
  ) {
    return false;
  }

  const extractedText = extractPdfTextHeuristic(pdfBuffer);
  if (!extractedText) {
    return false;
  }

  const extractedHash = hashText(normalizePdfText(extractedText));
  return extractedHash === data.expectedHash;
};
