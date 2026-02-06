import { describe, expect, it } from 'vitest';
import { validateHiddenFieldMetadataAuto } from '../hiddenFieldMetadataAuto.js';

describe('hidden field metadata auto', () => {
  it('accepts when any payload value matches token', () => {
    const result = validateHiddenFieldMetadataAuto({ token: 'HF-123' }, { foo: 'HF-123' });
    expect(result).toBe(true);
  });

  it('rejects when no payload matches token', () => {
    const result = validateHiddenFieldMetadataAuto({ token: 'HF-123' }, { foo: 'HF-999' });
    expect(result).toBe(false);
  });
});
