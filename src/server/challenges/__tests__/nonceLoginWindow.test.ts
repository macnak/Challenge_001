import { describe, expect, it } from 'vitest';
import { validateNonceLoginWindow } from '../nonceLoginWindow.js';

const now = Date.now();

const baseData = {
  required: {
    username: 'nonce_a1b2c3',
    nonce: 'NON-ABC123',
    nonceIssuedAt: now,
    nonceWindowMs: 10000,
    loginProof: 'LP-XYZ789',
  },
  optional: {
    note: 'nonce refresh expected',
  },
};

describe('nonce login window', () => {
  it('accepts valid login payload within nonce window', () => {
    const result = validateNonceLoginWindow(baseData, {
      username: 'nonce_a1b2c3',
      nonce: 'NON-ABC123',
      loginProof: 'LP-XYZ789',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects expired nonce window', () => {
    const result = validateNonceLoginWindow(
      {
        ...baseData,
        required: {
          ...baseData.required,
          nonceIssuedAt: now - 20000,
          nonceWindowMs: 1000,
        },
      },
      {
        username: 'nonce_a1b2c3',
        nonce: 'NON-ABC123',
        loginProof: 'LP-XYZ789',
      },
    );

    expect(result).toBe(false);
  });

  it('rejects wrong nonce value', () => {
    const result = validateNonceLoginWindow(baseData, {
      username: 'nonce_a1b2c3',
      nonce: 'NON-WRONG',
      loginProof: 'LP-XYZ789',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note', () => {
    const result = validateNonceLoginWindow(baseData, {
      username: 'nonce_a1b2c3',
      nonce: 'NON-ABC123',
      loginProof: 'LP-XYZ789',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
