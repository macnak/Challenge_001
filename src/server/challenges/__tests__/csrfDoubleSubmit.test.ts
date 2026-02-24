import { describe, expect, it } from 'vitest';
import { validateCsrfDoubleSubmit } from '../csrfDoubleSubmit.js';

const baseData = {
  required: {
    username: 'csrf_a1b2c3',
    csrfCookie: 'CSRF-ABC123',
    csrfBody: 'CSRF-ABC123',
    requestNonce: 'NONCE-ZYX98',
  },
  optional: {
    note: 'double submit check',
  },
};

describe('csrf double submit', () => {
  it('accepts valid matching CSRF cookie/body values', () => {
    const result = validateCsrfDoubleSubmit(baseData, {
      username: 'csrf_a1b2c3',
      csrfCookie: 'CSRF-ABC123',
      csrfBody: 'CSRF-ABC123',
      requestNonce: 'NONCE-ZYX98',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects when cookie and body tokens differ', () => {
    const result = validateCsrfDoubleSubmit(baseData, {
      username: 'csrf_a1b2c3',
      csrfCookie: 'CSRF-ABC123',
      csrfBody: 'CSRF-DIFF00',
      requestNonce: 'NONCE-ZYX98',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong request nonce', () => {
    const result = validateCsrfDoubleSubmit(baseData, {
      username: 'csrf_a1b2c3',
      csrfCookie: 'CSRF-ABC123',
      csrfBody: 'CSRF-ABC123',
      requestNonce: 'NONCE-WRONG',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note value', () => {
    const result = validateCsrfDoubleSubmit(baseData, {
      username: 'csrf_a1b2c3',
      csrfCookie: 'CSRF-ABC123',
      csrfBody: 'CSRF-ABC123',
      requestNonce: 'NONCE-ZYX98',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
