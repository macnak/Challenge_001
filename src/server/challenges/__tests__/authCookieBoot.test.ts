import { describe, expect, it } from 'vitest';
import { validateAuthCookieBoot } from '../authCookieBoot.js';

const baseData = {
  required: {
    username: 'boot_a1b2c3',
    cookieToken: 'CK-ABC123',
    formToken: 'FT-XYZ789',
    bootState: 'bootstrapped',
  },
  optional: {
    note: 'cookie bootstrap run',
  },
};

describe('auth cookie boot', () => {
  it('accepts valid bootstrap token correlation', () => {
    const result = validateAuthCookieBoot(baseData, {
      username: 'boot_a1b2c3',
      cookieToken: 'CK-ABC123',
      formToken: 'FT-XYZ789',
      bootState: 'bootstrapped',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects mismatched cookie token', () => {
    const result = validateAuthCookieBoot(baseData, {
      username: 'boot_a1b2c3',
      cookieToken: 'CK-WRONG',
      formToken: 'FT-XYZ789',
      bootState: 'bootstrapped',
    });

    expect(result).toBe(false);
  });

  it('rejects mismatched form token', () => {
    const result = validateAuthCookieBoot(baseData, {
      username: 'boot_a1b2c3',
      cookieToken: 'CK-ABC123',
      formToken: 'FT-WRONG',
      bootState: 'bootstrapped',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note value', () => {
    const result = validateAuthCookieBoot(baseData, {
      username: 'boot_a1b2c3',
      cookieToken: 'CK-ABC123',
      formToken: 'FT-XYZ789',
      bootState: 'bootstrapped',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
