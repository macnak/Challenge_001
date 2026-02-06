import { describe, expect, it } from 'vitest';
import { validateRadioCheckbox } from '../radioCheckbox.js';

describe('radio checkbox', () => {
  it('accepts correct selection', () => {
    const result = validateRadioCheckbox({ correct: 'OPT-1' }, { choice: 'OPT-1' });
    expect(result).toBe(true);
  });

  it('rejects incorrect selection', () => {
    const result = validateRadioCheckbox({ correct: 'OPT-1' }, { choice: 'OPT-2' });
    expect(result).toBe(false);
  });
});
