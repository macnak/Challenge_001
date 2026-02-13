import { describe, expect, it } from 'vitest';
import { validateCreateUploadFile } from '../createUploadFile.js';

describe('create upload file', () => {
  it('accepts multipart uploaded file payload', () => {
    const result = validateCreateUploadFile(
      {
        token: 'UP-ABC123',
        encoding: 'plain',
        expectedFilename: 'upload-1-test.txt',
      },
      {
        uploadedFile: {
          filename: 'upload-1-test.txt',
          content: 'UP-ABC123',
        },
      },
    );

    expect(result).toBe(true);
  });

  it('accepts plain text file content and filename', () => {
    const result = validateCreateUploadFile(
      {
        token: 'UP-ABC123',
        encoding: 'plain',
        expectedFilename: 'upload-1-test.txt',
      },
      {
        answer: 'UP-ABC123',
        uploadedFileName: 'upload-1-test.txt',
      },
    );

    expect(result).toBe(true);
  });

  it('accepts base64 encoded file content', () => {
    const encoded = Buffer.from('UP-ABC123', 'utf8').toString('base64');
    const result = validateCreateUploadFile(
      {
        token: 'UP-ABC123',
        encoding: 'base64',
        expectedFilename: 'upload-1-test.txt',
      },
      {
        answer: encoded,
        uploadedFileName: 'upload-1-test.txt',
      },
    );

    expect(result).toBe(true);
  });

  it('rejects filename mismatch', () => {
    const result = validateCreateUploadFile(
      {
        token: 'UP-ABC123',
        encoding: 'plain',
        expectedFilename: 'upload-1-test.txt',
      },
      {
        answer: 'UP-ABC123',
        uploadedFileName: 'other.txt',
      },
    );

    expect(result).toBe(false);
  });
});
