import type { ChallengeContext } from './types.js';
import { randomHex, randomInt, randomString } from './utils.js';

type JwtLiteClaimsData = {
  required: {
    jwtToken: string;
    claimKey: string;
    claimValue: string;
  };
  optional: {
    note: string;
  };
};

type JwtPayload = {
  sub: string;
  aud: string;
  nonce: string;
  tier: string;
  sid: string;
};

const NOTE_OPTIONS = [
  'decode payload claims from unsigned token',
  'extract claim from jwt-lite payload',
  'training token uses alg none',
];

const CLAIM_KEYS: Array<keyof JwtPayload> = ['sub', 'aud', 'nonce', 'tier', 'sid'];

const base64UrlEncode = (value: string) => {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const normalizeBase64 = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  const padding = normalized.length % 4;
  if (padding === 0) {
    return normalized;
  }
  return normalized + '='.repeat(4 - padding);
};

const base64UrlDecode = (value: string) => {
  try {
    return Buffer.from(normalizeBase64(value), 'base64').toString('utf8');
  } catch {
    return '';
  }
};

const parseJwtPayload = (token: string) => {
  const segments = token.split('.');
  if (segments.length < 2) {
    return null;
  }

  const payloadJson = base64UrlDecode(segments[1]);
  if (!payloadJson) {
    return null;
  }

  try {
    return JSON.parse(payloadJson) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export const generateJwtLiteClaims = (context: ChallengeContext): JwtLiteClaimsData => {
  const payload: JwtPayload = {
    sub: `user-${randomString(5, context.rng)}`,
    aud: `training-${randomString(4, context.rng)}`,
    nonce: `NON-${randomHex(4, context.rng).toUpperCase()}`,
    tier: ['bronze', 'silver', 'gold'][randomInt(0, 2, context.rng)],
    sid: `SID-${randomHex(5, context.rng).toUpperCase()}`,
  };

  const header = {
    alg: 'none',
    typ: 'JWT',
  };

  const claimKey = CLAIM_KEYS[randomInt(0, CLAIM_KEYS.length - 1, context.rng)];
  const claimValue = payload[claimKey];

  const jwtToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.`;

  return {
    required: {
      jwtToken,
      claimKey,
      claimValue,
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderJwtLiteClaims = (context: ChallengeContext, data: JwtLiteClaimsData) => {
  return `
    <h1>Challenge ${context.index}: JWT-lite Claims</h1>
    <p class="muted">Decode the non-signed training token payload and submit the required claim.</p>
    <ul class="muted">
      <li>JWT token*: <strong>${data.required.jwtToken}</strong></li>
      <li>Required claim key*: <strong>${data.required.claimKey}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="jwtToken">JWT token*</label>
    <input id="jwtToken" name="jwtToken" type="text" required />

    <label class="muted" for="claimKey">Claim key*</label>
    <input id="claimKey" name="claimKey" type="text" required />

    <label class="muted" for="claimValue">Claim value*</label>
    <input id="claimValue" name="claimValue" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateJwtLiteClaims = (
  data: JwtLiteClaimsData,
  payload: Record<string, unknown>,
) => {
  const jwtToken = typeof payload.jwtToken === 'string' ? payload.jwtToken.trim() : '';
  const claimKey = typeof payload.claimKey === 'string' ? payload.claimKey.trim() : '';
  const claimValue = typeof payload.claimValue === 'string' ? payload.claimValue.trim() : '';

  if (!jwtToken || !claimKey || !claimValue) {
    return false;
  }

  if (jwtToken !== data.required.jwtToken) {
    return false;
  }

  if (claimKey !== data.required.claimKey) {
    return false;
  }

  const decodedPayload = parseJwtPayload(jwtToken);
  if (!decodedPayload) {
    return false;
  }

  const decodedClaim = decodedPayload[claimKey];
  if (typeof decodedClaim !== 'string') {
    return false;
  }

  if (decodedClaim !== data.required.claimValue) {
    return false;
  }

  if (claimValue !== data.required.claimValue) {
    return false;
  }

  const note = typeof payload.note === 'string' ? payload.note.trim() : '';
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
