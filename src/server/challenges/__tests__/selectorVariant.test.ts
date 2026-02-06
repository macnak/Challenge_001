import { describe, expect, it } from 'vitest';
import { validateSelectorVariant } from '../selectorVariant.js';

describe('selector variant', () => {
  it('accepts correct value', () => {
    const result = validateSelectorVariant({ value: 'A-123' }, { answer: 'A-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateSelectorVariant({ value: 'A-123' }, { answer: 'A-999' });
    expect(result).toBe(false);
  });
});
