import { describe, expect, it } from 'vitest';
import { validateDomShuffling } from '../domShuffling.js';

describe('dom shuffling', () => {
  it('accepts correct value', () => {
    const result = validateDomShuffling({ correct: 'DOM-123' }, { answer: 'DOM-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateDomShuffling({ correct: 'DOM-123' }, { answer: 'DOM-999' });
    expect(result).toBe(false);
  });
});
