import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { validateOauthPkceMini } from '../oauthPkceMini.js';

const toBase64Url = (value: Buffer) =>
  value.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const challengeFromVerifier = (codeVerifier: string) => {
  const digest = createHash('sha256').update(codeVerifier, 'utf8').digest();
  return toBase64Url(digest);
};

const codeVerifier = 'verifier-demo-abc123';
const codeChallenge = challengeFromVerifier(codeVerifier);
const authCode = 'AC-ABC123DEF456';

const baseData = {
  required: {
    clientId: 'client-demo',
    redirectUri: 'https://app.example.com/callback/demo',
    state: 'st-a1b2c3d4',
    authCode,
    codeVerifier,
    codeChallengeMethod: 'S256' as const,
    codeChallenge,
    tokenBinding: `${authCode}:${codeChallenge.slice(0, 8)}`,
  },
  optional: {
    note: 'simulate code exchange with verifier chain',
  },
};

describe('oauth pkce mini', () => {
  it('accepts valid oauth pkce exchange payload', () => {
    const result = validateOauthPkceMini(baseData, {
      clientId: 'client-demo',
      redirectUri: 'https://app.example.com/callback/demo',
      state: 'st-a1b2c3d4',
      authCode: 'AC-ABC123DEF456',
      codeVerifier: codeVerifier,
      codeChallenge: codeChallenge,
      tokenBinding: `${authCode}:${codeChallenge.slice(0, 8)}`,
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong state value', () => {
    const result = validateOauthPkceMini(baseData, {
      clientId: 'client-demo',
      redirectUri: 'https://app.example.com/callback/demo',
      state: 'st-wrong',
      authCode: 'AC-ABC123DEF456',
      codeVerifier: codeVerifier,
      codeChallenge: codeChallenge,
      tokenBinding: `${authCode}:${codeChallenge.slice(0, 8)}`,
    });

    expect(result).toBe(false);
  });

  it('rejects challenge mismatch for verifier', () => {
    const result = validateOauthPkceMini(baseData, {
      clientId: 'client-demo',
      redirectUri: 'https://app.example.com/callback/demo',
      state: 'st-a1b2c3d4',
      authCode: 'AC-ABC123DEF456',
      codeVerifier: codeVerifier,
      codeChallenge: 'invalidChallenge',
      tokenBinding: `${authCode}:${codeChallenge.slice(0, 8)}`,
    });

    expect(result).toBe(false);
  });

  it('rejects invalid token binding', () => {
    const result = validateOauthPkceMini(baseData, {
      clientId: 'client-demo',
      redirectUri: 'https://app.example.com/callback/demo',
      state: 'st-a1b2c3d4',
      authCode: 'AC-ABC123DEF456',
      codeVerifier: codeVerifier,
      codeChallenge: codeChallenge,
      tokenBinding: 'AC-ABC123DEF456:WRONG000',
    });

    expect(result).toBe(false);
  });
});
