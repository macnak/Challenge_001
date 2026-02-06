import { describe, expect, it } from 'vitest';
import { validateWhitespaceToken } from '../whitespaceToken.js';

describe('whitespace token', () => {
  it('accepts trimmed token', () => {
    const result = validateWhitespaceToken({ token: 'TK-ABC' }, { answer: '  TK-ABC  ' });
    expect(result).toBe(true);
  });

  it('rejects wrong token', () => {
    const result = validateWhitespaceToken({ token: 'TK-ABC' }, { answer: 'TK-XYZ' });
    expect(result).toBe(false);
  });
});
