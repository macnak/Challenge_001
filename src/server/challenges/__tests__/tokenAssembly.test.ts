import { describe, expect, it } from 'vitest';
import { validateTokenAssembly } from '../tokenAssembly.js';

describe('token assembly', () => {
  it('accepts correct token', () => {
    const result = validateTokenAssembly({ token: 'TA-123' }, { answer: 'TA-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect token', () => {
    const result = validateTokenAssembly({ token: 'TA-123' }, { answer: 'TA-124' });
    expect(result).toBe(false);
  });
});
