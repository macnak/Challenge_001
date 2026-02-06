import { describe, expect, it } from 'vitest';
import { validateDecoyInputs } from '../decoyInputs.js';

describe('decoy inputs', () => {
  it('accepts correct value', () => {
    const result = validateDecoyInputs({ correct: 'DV-123' }, { answer: 'DV-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateDecoyInputs({ correct: 'DV-123' }, { answer: 'DV-999' });
    expect(result).toBe(false);
  });
});
