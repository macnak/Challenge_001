import { describe, expect, it } from 'vitest';
import { validateAutoFilledJs } from '../autoFilledJs.js';

describe('auto filled js', () => {
  it('accepts auto value', () => {
    const result = validateAutoFilledJs({ value: 'AUTO-123' }, { answer: 'AUTO-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateAutoFilledJs({ value: 'AUTO-123' }, { answer: 'AUTO-999' });
    expect(result).toBe(false);
  });
});
