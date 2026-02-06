import { describe, expect, it } from 'vitest';
import { validateSseDelivered } from '../sseDelivered.js';

describe('sse delivered', () => {
  it('accepts correct value', () => {
    const result = validateSseDelivered({ value: 'SSE-123' }, { answer: 'SSE-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect value', () => {
    const result = validateSseDelivered({ value: 'SSE-123' }, { answer: 'SSE-999' });
    expect(result).toBe(false);
  });
});
