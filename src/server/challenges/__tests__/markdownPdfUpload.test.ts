import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  markdownToPlainText,
  normalizePdfText,
  validateMarkdownPdfUpload,
} from '../markdownPdfUpload.js';

const hashText = (value: string) => createHash('sha256').update(value).digest('hex');

const buildPseudoPdf = (text: string) => {
  const escaped = text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  return `%PDF-1.4\n1 0 obj\n<< /Length 44 >>\nstream\nBT\n(${escaped}) Tj\nET\nendstream\nendobj\ntrailer\n<<>>\n%%EOF`;
};

describe('markdown pdf upload challenge', () => {
  it('normalizes markdown to stable plain text', () => {
    const plain = markdownToPlainText('# Title\n\n- Item one\n- Item two\n\n`code`');
    expect(plain).toContain('Title');
    expect(plain).toContain('Item one');
    expect(plain).toContain('code');
  });

  it('accepts matching pseudo-pdf upload', () => {
    const markdown = '# Header\n\nToken MPDF-ABC123\n\n- one\n- two';
    const expectedText = markdownToPlainText(markdown);
    const expectedHash = hashText(normalizePdfText(expectedText));
    const pdf = buildPseudoPdf(expectedText);

    const result = validateMarkdownPdfUpload(
      {
        expectedFilename: 'markdown-1-test.pdf',
        expectedHash,
      },
      {
        uploadedFile: {
          filename: 'markdown-1-test.pdf',
          content: pdf,
          contentBase64: Buffer.from(pdf, 'utf8').toString('base64'),
        },
      },
    );

    expect(result).toBe(true);
  });

  it('rejects non-pdf content', () => {
    const result = validateMarkdownPdfUpload(
      {
        expectedFilename: 'markdown-1-test.pdf',
        expectedHash: hashText('whatever'),
      },
      {
        uploadedFile: {
          filename: 'markdown-1-test.pdf',
          content: 'not a pdf',
        },
      },
    );

    expect(result).toBe(false);
  });
});
