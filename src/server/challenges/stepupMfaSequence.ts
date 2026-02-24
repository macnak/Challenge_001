import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

export type StepupMfaSequenceData = {
  transactionId: string;
  username: string;
  passwordHint: string;
  mfaMethod: 'totp' | 'push';
  otpCode: string;
  approvalToken: string;
  finalSessionToken: string;
  expiresAt: number;
};

const makeCode = (digits: number) =>
  String(randomInt(10 ** (digits - 1), 10 ** digits - 1)).slice(0, digits);

export const generateStepupMfaSequence = (_context: ChallengeContext): StepupMfaSequenceData => {
  const transactionId = `AUTH-${randomHex(5).toUpperCase()}`;
  const mfaMethod = randomInt(0, 1) === 0 ? 'totp' : 'push';
  const otpCode = makeCode(6);
  const approvalToken = `APP-${randomHex(4).toUpperCase()}`;
  const finalSessionToken = `SESS-${randomHex(6).toUpperCase()}`;

  return {
    transactionId,
    username: `user_${randomHex(3).toLowerCase()}`,
    passwordHint: `pw-${randomHex(2).toLowerCase()}`,
    mfaMethod,
    otpCode,
    approvalToken,
    finalSessionToken,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
};

export const renderStepupMfaSequence = (context: ChallengeContext, data: StepupMfaSequenceData) => {
  return `
    <h1>Challenge ${context.index}: Step-up MFA Sequence</h1>
    <p class="muted">Complete the authentication chain in strict order and submit the final session token.</p>
    <ul class="muted">
      <li>Transaction ID*: <strong>${data.transactionId}</strong></li>
      <li>Username*: <strong>${data.username}</strong></li>
      <li>Password hint*: <strong>${data.passwordHint}</strong></li>
      <li>MFA method*: <strong>${data.mfaMethod}</strong></li>
      <li>OTP code*: <strong>${data.otpCode}</strong></li>
      <li>Approval token*: <strong>${data.approvalToken}</strong></li>
      <li>Final session token*: <strong>${data.finalSessionToken}</strong></li>
    </ul>

    <label class="muted" for="transactionId">Transaction ID*</label>
    <input id="transactionId" name="transactionId" type="text" required />

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="passwordHint">Password hint*</label>
    <input id="passwordHint" name="passwordHint" type="text" required />

    <label class="muted" for="mfaMethod">MFA method*</label>
    <input id="mfaMethod" name="mfaMethod" type="text" required />

    <label class="muted" for="otpCode">OTP code*</label>
    <input id="otpCode" name="otpCode" type="text" required />

    <label class="muted" for="approvalToken">Approval token*</label>
    <input id="approvalToken" name="approvalToken" type="text" required />

    <label class="muted" for="finalSessionToken">Final session token*</label>
    <input id="finalSessionToken" name="finalSessionToken" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateStepupMfaSequence = (
  data: StepupMfaSequenceData,
  payload: Record<string, unknown>,
) => {
  if (Date.now() > data.expiresAt) {
    return false;
  }

  const transactionId = read(payload, 'transactionId');
  const username = read(payload, 'username');
  const passwordHint = read(payload, 'passwordHint');
  const mfaMethod = read(payload, 'mfaMethod');
  const otpCode = read(payload, 'otpCode');
  const approvalToken = read(payload, 'approvalToken');
  const finalSessionToken = read(payload, 'finalSessionToken');

  if (transactionId !== data.transactionId) {
    return false;
  }

  if (username !== data.username || passwordHint !== data.passwordHint) {
    return false;
  }

  if (mfaMethod !== data.mfaMethod) {
    return false;
  }

  if (otpCode !== data.otpCode) {
    return false;
  }

  if (approvalToken !== data.approvalToken) {
    return false;
  }

  if (finalSessionToken !== data.finalSessionToken) {
    return false;
  }

  return true;
};
