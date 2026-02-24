import { describe, expect, it } from 'vitest';
import { validateFixedFormSelectRadio } from '../fixedFormSelectRadio.js';

const baseData = {
  required: {
    clientCode: 'CL-742',
    region: 'EMEA',
    authMode: 'basic',
  },
  optional: {
    note: 'regional smoke test',
  },
  options: {
    regions: ['NA', 'EMEA', 'APAC', 'LATAM'],
    authModes: ['jwt', 'basic', 'none', 'user-pass'],
  },
};

describe('fixed form select radio', () => {
  it('accepts correct required fields with optional note omitted', () => {
    const result = validateFixedFormSelectRadio(baseData, {
      clientCode: 'CL-742',
      region: 'EMEA',
      authMode: 'basic',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('accepts optional note when it matches expected', () => {
    const result = validateFixedFormSelectRadio(baseData, {
      clientCode: 'CL-742',
      region: 'EMEA',
      authMode: 'basic',
      note: 'regional smoke test',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong region selection', () => {
    const result = validateFixedFormSelectRadio(baseData, {
      clientCode: 'CL-742',
      region: 'NA',
      authMode: 'basic',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note value when provided', () => {
    const result = validateFixedFormSelectRadio(baseData, {
      clientCode: 'CL-742',
      region: 'EMEA',
      authMode: 'basic',
      note: 'unexpected note',
    });

    expect(result).toBe(false);
  });
});
