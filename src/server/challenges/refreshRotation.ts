import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type RefreshRotationData = {
  required: {
    sessionId: string;
    refreshTokenV1: string;
    refreshTokenV2: string;
    accessTokenStep1: string;
    accessTokenStep2: string;
    rotationState: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = [
  'first refresh invalidates prior token',
  'second refresh must use rotated token',
  'token lifecycle chain validation',
];

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateRefreshRotation = (context: ChallengeContext): RefreshRotationData => {
  const refreshTokenV1 = `RT1-${randomHex(6, context.rng).toUpperCase()}`;
  const refreshTokenV2 = `RT2-${randomHex(6, context.rng).toUpperCase()}`;

  return {
    required: {
      sessionId: `sess-${randomHex(4, context.rng).toLowerCase()}`,
      refreshTokenV1,
      refreshTokenV2,
      accessTokenStep1: `AT1-${randomHex(5, context.rng).toUpperCase()}`,
      accessTokenStep2: `AT2-${randomHex(5, context.rng).toUpperCase()}`,
      rotationState: `${refreshTokenV1}->${refreshTokenV2}`,
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderRefreshRotation = (context: ChallengeContext, data: RefreshRotationData) => {
  return `
    <h1>Challenge ${context.index}: Refresh Rotation</h1>
    <p class="muted">Validate two-step refresh rotation where the old refresh token cannot be reused.</p>
    <ul class="muted">
      <li>Session ID*: <strong>${data.required.sessionId}</strong></li>
      <li>Step 1 refresh token*: <strong>${data.required.refreshTokenV1}</strong></li>
      <li>Step 1 access token*: <strong>${data.required.accessTokenStep1}</strong></li>
      <li>Step 2 rotated refresh token*: <strong>${data.required.refreshTokenV2}</strong></li>
      <li>Step 2 access token*: <strong>${data.required.accessTokenStep2}</strong></li>
      <li>Rotation state*: <strong>${data.required.rotationState}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="sessionId">Session ID*</label>
    <input id="sessionId" name="sessionId" type="text" required />

    <label class="muted" for="refreshTokenStep1">Refresh token (step 1)*</label>
    <input id="refreshTokenStep1" name="refreshTokenStep1" type="text" required />

    <label class="muted" for="accessTokenStep1">Access token (step 1)*</label>
    <input id="accessTokenStep1" name="accessTokenStep1" type="text" required />

    <label class="muted" for="refreshTokenStep2">Refresh token (step 2)*</label>
    <input id="refreshTokenStep2" name="refreshTokenStep2" type="text" required />

    <label class="muted" for="accessTokenStep2">Access token (step 2)*</label>
    <input id="accessTokenStep2" name="accessTokenStep2" type="text" required />

    <label class="muted" for="rotationState">Rotation state*</label>
    <input id="rotationState" name="rotationState" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateRefreshRotation = (
  data: RefreshRotationData,
  payload: Record<string, unknown>,
) => {
  const sessionId = read(payload, 'sessionId');
  const refreshTokenStep1 = read(payload, 'refreshTokenStep1');
  const accessTokenStep1 = read(payload, 'accessTokenStep1');
  const refreshTokenStep2 = read(payload, 'refreshTokenStep2');
  const accessTokenStep2 = read(payload, 'accessTokenStep2');
  const rotationState = read(payload, 'rotationState');

  if (
    !sessionId ||
    !refreshTokenStep1 ||
    !accessTokenStep1 ||
    !refreshTokenStep2 ||
    !accessTokenStep2 ||
    !rotationState
  ) {
    return false;
  }

  if (sessionId !== data.required.sessionId) {
    return false;
  }

  if (refreshTokenStep1 !== data.required.refreshTokenV1) {
    return false;
  }

  if (accessTokenStep1 !== data.required.accessTokenStep1) {
    return false;
  }

  if (refreshTokenStep2 !== data.required.refreshTokenV2) {
    return false;
  }

  if (refreshTokenStep2 === refreshTokenStep1) {
    return false;
  }

  if (accessTokenStep2 !== data.required.accessTokenStep2) {
    return false;
  }

  if (rotationState !== data.required.rotationState) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
