import { describe, expect, it } from 'vitest';
import { validateWsDelivered } from '../wsDelivered.js';

describe('ws delivered', () => {
  it('accepts correct value', () => {
    const result = validateWsDelivered({ value: 'WS-123' }, { answer: 'WS-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateWsDelivered({ value: 'WS-123' }, { answer: 'WS-999' });
    expect(result).toBe(false);
  });
});
