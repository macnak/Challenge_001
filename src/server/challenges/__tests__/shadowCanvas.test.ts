import { describe, expect, it } from 'vitest';
import { validateShadowCanvas } from '../shadowCanvas.js';

describe('shadow canvas', () => {
  it('accepts correct token', () => {
    const result = validateShadowCanvas({ token: 'SC-123' }, { answer: 'SC-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect token', () => {
    const result = validateShadowCanvas({ token: 'SC-123' }, { answer: 'SC-999' });
    expect(result).toBe(false);
  });
});
