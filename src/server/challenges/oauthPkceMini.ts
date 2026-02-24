import { createHash } from 'node:crypto';
import type { ChallengeContext } from './types.js';
import { randomHex, randomInt, randomString } from './utils.js';

type OauthPkceMiniData = {
  required: {
    clientId: string;
    redirectUri: string;
    state: string;
    authCode: string;
    codeVerifier: string;
    codeChallengeMethod: 'S256';
    codeChallenge: string;
    tokenBinding: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = [
  'simulate code exchange with verifier chain',
  'validate oauth state and pkce correlation',
  's256 challenge must match verifier',
];

const toBase64Url = (value: Buffer) => {
  return value.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const createCodeChallenge = (codeVerifier: string) => {
  const digest = createHash('sha256').update(codeVerifier, 'utf8').digest();
  return toBase64Url(digest);
};

const createTokenBinding = (authCode: string, codeChallenge: string) => {
  return `${authCode}:${codeChallenge.slice(0, 8)}`;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateOauthPkceMini = (context: ChallengeContext): OauthPkceMiniData => {
  const codeVerifier = `${randomString(14, context.rng)}${randomHex(4, context.rng)}`;
  const codeChallenge = createCodeChallenge(codeVerifier);
  const authCode = `AC-${randomHex(6, context.rng).toUpperCase()}`;

  return {
    required: {
      clientId: `client-${randomString(5, context.rng)}`,
      redirectUri: `https://app.example.com/callback/${randomString(4, context.rng)}`,
      state: `st-${randomHex(4, context.rng).toLowerCase()}`,
      authCode,
      codeVerifier,
      codeChallengeMethod: 'S256',
      codeChallenge,
      tokenBinding: createTokenBinding(authCode, codeChallenge),
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderOauthPkceMini = (context: ChallengeContext, data: OauthPkceMiniData) => {
  return `
    <h1>Challenge ${context.index}: OAuth PKCE Mini</h1>
    <p class="muted">Simulate one-page OAuth code exchange with strict state and PKCE verifier chain checks.</p>
    <ul class="muted">
      <li>Client ID*: <strong>${data.required.clientId}</strong></li>
      <li>Redirect URI*: <strong>${data.required.redirectUri}</strong></li>
      <li>State*: <strong>${data.required.state}</strong></li>
      <li>Auth code*: <strong>${data.required.authCode}</strong></li>
      <li>Code verifier*: <strong>${data.required.codeVerifier}</strong></li>
      <li>Code challenge method*: <strong>${data.required.codeChallengeMethod}</strong></li>
      <li>Submit computed code challenge and token binding (<strong>authCode:first8(codeChallenge)</strong>).</li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="clientId">Client ID*</label>
    <input id="clientId" name="clientId" type="text" required />

    <label class="muted" for="redirectUri">Redirect URI*</label>
    <input id="redirectUri" name="redirectUri" type="text" required />

    <label class="muted" for="state">State*</label>
    <input id="state" name="state" type="text" required />

    <label class="muted" for="authCode">Auth code*</label>
    <input id="authCode" name="authCode" type="text" required />

    <label class="muted" for="codeVerifier">Code verifier*</label>
    <input id="codeVerifier" name="codeVerifier" type="text" required />

    <label class="muted" for="codeChallenge">Code challenge (S256)*</label>
    <input id="codeChallenge" name="codeChallenge" type="text" required />

    <label class="muted" for="tokenBinding">Token binding*</label>
    <input id="tokenBinding" name="tokenBinding" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateOauthPkceMini = (
  data: OauthPkceMiniData,
  payload: Record<string, unknown>,
) => {
  const clientId = read(payload, 'clientId');
  const redirectUri = read(payload, 'redirectUri');
  const state = read(payload, 'state');
  const authCode = read(payload, 'authCode');
  const codeVerifier = read(payload, 'codeVerifier');
  const codeChallenge = read(payload, 'codeChallenge');
  const tokenBinding = read(payload, 'tokenBinding');

  if (
    !clientId ||
    !redirectUri ||
    !state ||
    !authCode ||
    !codeVerifier ||
    !codeChallenge ||
    !tokenBinding
  ) {
    return false;
  }

  if (clientId !== data.required.clientId) {
    return false;
  }

  if (redirectUri !== data.required.redirectUri) {
    return false;
  }

  if (state !== data.required.state) {
    return false;
  }

  if (authCode !== data.required.authCode) {
    return false;
  }

  if (codeVerifier !== data.required.codeVerifier) {
    return false;
  }

  const calculatedCodeChallenge = createCodeChallenge(codeVerifier);
  if (codeChallenge !== calculatedCodeChallenge || codeChallenge !== data.required.codeChallenge) {
    return false;
  }

  const calculatedTokenBinding = createTokenBinding(authCode, codeChallenge);
  if (tokenBinding !== calculatedTokenBinding || tokenBinding !== data.required.tokenBinding) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
