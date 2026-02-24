import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type CsrfDoubleSubmitData = {
  required: {
    username: string;
    csrfCookie: string;
    csrfBody: string;
    requestNonce: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = ['csrf match required', 'double submit check', 'nonce-bound validation'];

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateCsrfDoubleSubmit = (context: ChallengeContext): CsrfDoubleSubmitData => {
  const csrf = `CSRF-${randomHex(6, context.rng).toUpperCase()}`;
  const nonce = `NONCE-${randomHex(5, context.rng).toUpperCase()}`;

  return {
    required: {
      username: `csrf_${randomHex(3, context.rng).toLowerCase()}`,
      csrfCookie: csrf,
      csrfBody: csrf,
      requestNonce: nonce,
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderCsrfDoubleSubmit = (context: ChallengeContext, data: CsrfDoubleSubmitData) => {
  return `
    <h1>Challenge ${context.index}: CSRF Double-submit</h1>
    <p class="muted">Submit matching CSRF cookie/body tokens and the required request nonce.</p>
    <ul class="muted">
      <li>Username*: <strong>${data.required.username}</strong></li>
      <li>CSRF cookie token*: <strong>${data.required.csrfCookie}</strong></li>
      <li>CSRF body token*: <strong>${data.required.csrfBody}</strong></li>
      <li>Request nonce*: <strong>${data.required.requestNonce}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="csrfCookie">CSRF cookie token*</label>
    <input id="csrfCookie" name="csrfCookie" type="text" required />

    <label class="muted" for="csrfBody">CSRF body token*</label>
    <input id="csrfBody" name="csrfBody" type="text" required />

    <label class="muted" for="requestNonce">Request nonce*</label>
    <input id="requestNonce" name="requestNonce" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateCsrfDoubleSubmit = (
  data: CsrfDoubleSubmitData,
  payload: Record<string, unknown>,
) => {
  const username = read(payload, 'username');
  const csrfCookie = read(payload, 'csrfCookie');
  const csrfBody = read(payload, 'csrfBody');
  const requestNonce = read(payload, 'requestNonce');

  if (username !== data.required.username) {
    return false;
  }

  if (csrfCookie !== data.required.csrfCookie) {
    return false;
  }

  if (csrfBody !== data.required.csrfBody) {
    return false;
  }

  if (csrfCookie !== csrfBody) {
    return false;
  }

  if (requestNonce !== data.required.requestNonce) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
