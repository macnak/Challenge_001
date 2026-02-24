import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type AuthCookieBootData = {
  required: {
    username: string;
    cookieToken: string;
    formToken: string;
    bootState: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = ['cookie bootstrap run', 'initial auth handoff', 'session preflight'];

const pickNote = (context: ChallengeContext) => {
  const index = randomInt(0, NOTE_OPTIONS.length - 1, context.rng);
  return NOTE_OPTIONS[index];
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateAuthCookieBoot = (context: ChallengeContext): AuthCookieBootData => {
  return {
    required: {
      username: `boot_${randomHex(3).toLowerCase()}`,
      cookieToken: `CK-${randomHex(6).toUpperCase()}`,
      formToken: `FT-${randomHex(6).toUpperCase()}`,
      bootState: 'bootstrapped',
    },
    optional: {
      note: pickNote(context),
    },
  };
};

export const renderAuthCookieBoot = (context: ChallengeContext, data: AuthCookieBootData) => {
  return `
    <h1>Challenge ${context.index}: Auth Cookie Boot</h1>
    <p class="muted">Submit the bootstrap auth payload with matching cookie and form tokens.</p>
    <ul class="muted">
      <li>Username*: <strong>${data.required.username}</strong></li>
      <li>Cookie token*: <strong>${data.required.cookieToken}</strong></li>
      <li>Form token*: <strong>${data.required.formToken}</strong></li>
      <li>Boot state*: <strong>${data.required.bootState}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="cookieToken">Cookie token*</label>
    <input id="cookieToken" name="cookieToken" type="text" required />

    <label class="muted" for="formToken">Form token*</label>
    <input id="formToken" name="formToken" type="text" required />

    <label class="muted" for="bootState">Boot state*</label>
    <input id="bootState" name="bootState" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateAuthCookieBoot = (
  data: AuthCookieBootData,
  payload: Record<string, unknown>,
) => {
  const username = read(payload, 'username');
  const cookieToken = read(payload, 'cookieToken');
  const formToken = read(payload, 'formToken');
  const bootState = read(payload, 'bootState').toLowerCase();

  if (username !== data.required.username) {
    return false;
  }

  if (cookieToken !== data.required.cookieToken) {
    return false;
  }

  if (formToken !== data.required.formToken) {
    return false;
  }

  if (bootState !== data.required.bootState) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
