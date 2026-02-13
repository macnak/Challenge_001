import { describe, expect, it } from 'vitest';
import { validateDownloadedFilePlain } from '../downloadedFilePlain.js';

describe('downloaded file plain', () => {
  it('accepts matching token', () => {
    const result = validateDownloadedFilePlain({ token: 'FILE-ABC123' }, { answer: 'FILE-ABC123' });
    expect(result).toBe(true);
  });

  it('rejects wrong token', () => {
    const result = validateDownloadedFilePlain({ token: 'FILE-ABC123' }, { answer: 'FILE-XYZ999' });
    expect(result).toBe(false);
  });
});
