import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type NonceLoginWindowData = {
  required: {
    username: string;
    nonce: string;
    nonceIssuedAt: number;
    nonceWindowMs: number;
    loginProof: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = [
  'nonce refresh expected',
  'time-window validation',
  'short-lived login nonce',
];

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateNonceLoginWindow = (context: ChallengeContext): NonceLoginWindowData => {
  const nonce = `NON-${randomHex(6, context.rng).toUpperCase()}`;
  const username = `nonce_${randomHex(3, context.rng).toLowerCase()}`;
  const nonceWindowMs = randomInt(5000, 15000, context.rng);

  return {
    required: {
      username,
      nonce,
      nonceIssuedAt: Date.now(),
      nonceWindowMs,
      loginProof: `LP-${randomHex(6, context.rng).toUpperCase()}`,
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderNonceLoginWindow = (context: ChallengeContext, data: NonceLoginWindowData) => {
  const windowSeconds = Math.max(1, Math.round(data.required.nonceWindowMs / 1000));

  return `
    <h1>Challenge ${context.index}: Nonce Login Window</h1>
    <p class="muted">Submit login values before the nonce window expires.</p>
    <ul class="muted">
      <li>Username*: <strong>${data.required.username}</strong></li>
      <li>Nonce*: <strong>${data.required.nonce}</strong></li>
      <li>Nonce validity window*: <strong>${windowSeconds}s</strong></li>
      <li>Login proof*: <strong>${data.required.loginProof}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="nonce">Nonce*</label>
    <input id="nonce" name="nonce" type="text" required />

    <label class="muted" for="loginProof">Login proof*</label>
    <input id="loginProof" name="loginProof" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateNonceLoginWindow = (
  data: NonceLoginWindowData,
  payload: Record<string, unknown>,
) => {
  const now = Date.now();
  if (now - data.required.nonceIssuedAt > data.required.nonceWindowMs) {
    return false;
  }

  const username = read(payload, 'username');
  const nonce = read(payload, 'nonce');
  const loginProof = read(payload, 'loginProof');

  if (username !== data.required.username) {
    return false;
  }

  if (nonce !== data.required.nonce) {
    return false;
  }

  if (loginProof !== data.required.loginProof) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
