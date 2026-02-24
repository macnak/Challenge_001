import { describe, expect, it } from 'vitest';
import { validateJwtLiteClaims } from '../jwtLiteClaims.js';

const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }), 'utf8')
  .toString('base64url')
  .replace(/=+$/g, '');
const payloadSegment = Buffer.from(
  JSON.stringify({ sub: 'user-demo', aud: 'training-app', nonce: 'NON-ABC123' }),
  'utf8',
)
  .toString('base64url')
  .replace(/=+$/g, '');

const token = `${header}.${payloadSegment}.`;

const baseData = {
  required: {
    jwtToken: token,
    claimKey: 'nonce',
    claimValue: 'NON-ABC123',
  },
  optional: {
    note: 'decode payload claims from unsigned token',
  },
};

describe('jwt lite claims', () => {
  it('accepts valid decoded claim', () => {
    const result = validateJwtLiteClaims(baseData, {
      jwtToken: token,
      claimKey: 'nonce',
      claimValue: 'NON-ABC123',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects mismatched token', () => {
    const result = validateJwtLiteClaims(baseData, {
      jwtToken: `${header}.${payloadSegment}.bad`,
      claimKey: 'nonce',
      claimValue: 'NON-ABC123',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong decoded claim value', () => {
    const result = validateJwtLiteClaims(baseData, {
      jwtToken: token,
      claimKey: 'nonce',
      claimValue: 'NON-WRONG',
    });

    expect(result).toBe(false);
  });

  it('rejects malformed token payload', () => {
    const malformedToken = `${header}.not-base64.`;

    const result = validateJwtLiteClaims(baseData, {
      jwtToken: malformedToken,
      claimKey: 'nonce',
      claimValue: 'NON-ABC123',
    });

    expect(result).toBe(false);
  });
});
