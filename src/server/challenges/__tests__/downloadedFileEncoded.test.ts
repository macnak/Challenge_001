import { describe, expect, it } from 'vitest';
import { validateDownloadedFileEncoded } from '../downloadedFileEncoded.js';

describe('downloaded file encoded', () => {
  it('accepts decoded token directly', () => {
    const result = validateDownloadedFileEncoded(
      { token: 'ENC-ABC123', encoding: 'base64' },
      { answer: 'ENC-ABC123' },
    );
    expect(result).toBe(true);
  });

  it('accepts base64 token input', () => {
    const encoded = Buffer.from('ENC-ABC123', 'utf8').toString('base64');
    const result = validateDownloadedFileEncoded(
      { token: 'ENC-ABC123', encoding: 'base64' },
      { answer: encoded },
    );
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateDownloadedFileEncoded(
      { token: 'ENC-ABC123', encoding: 'hex' },
      { answer: 'ENC-XYZ999' },
    );
    expect(result).toBe(false);
  });
});
