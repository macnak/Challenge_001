import { describe, expect, it } from 'vitest';
import { validateHiddenFieldMetadata } from '../hiddenFieldMetadata.js';

describe('hidden field metadata', () => {
  it('accepts correct token', () => {
    const result = validateHiddenFieldMetadata({ token: 'HF-123' }, { answer: 'HF-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect token', () => {
    const result = validateHiddenFieldMetadata({ token: 'HF-123' }, { answer: 'HF-999' });
    expect(result).toBe(false);
  });
});
