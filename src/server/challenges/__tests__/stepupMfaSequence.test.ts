import { describe, expect, it } from 'vitest';
import { validateStepupMfaSequence } from '../stepupMfaSequence.js';
import type { StepupMfaSequenceData } from '../stepupMfaSequence.js';

const now = Date.now();

const baseData: StepupMfaSequenceData = {
  transactionId: 'AUTH-ABC12',
  username: 'user_1a2b',
  passwordHint: 'pw-xy',
  mfaMethod: 'totp',
  otpCode: '123456',
  approvalToken: 'APP-A1B2',
  finalSessionToken: 'SESS-A1B2C3',
  expiresAt: now + 120000,
};

describe('stepup mfa sequence', () => {
  it('accepts valid full auth sequence payload', () => {
    const result = validateStepupMfaSequence(baseData, {
      transactionId: 'AUTH-ABC12',
      username: 'user_1a2b',
      passwordHint: 'pw-xy',
      mfaMethod: 'totp',
      otpCode: '123456',
      approvalToken: 'APP-A1B2',
      finalSessionToken: 'SESS-A1B2C3',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong OTP code', () => {
    const result = validateStepupMfaSequence(baseData, {
      transactionId: 'AUTH-ABC12',
      username: 'user_1a2b',
      passwordHint: 'pw-xy',
      mfaMethod: 'totp',
      otpCode: '000000',
      approvalToken: 'APP-A1B2',
      finalSessionToken: 'SESS-A1B2C3',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong step ordering continuity token', () => {
    const result = validateStepupMfaSequence(baseData, {
      transactionId: 'AUTH-ABC12',
      username: 'user_1a2b',
      passwordHint: 'pw-xy',
      mfaMethod: 'totp',
      otpCode: '123456',
      approvalToken: 'APP-WRONG',
      finalSessionToken: 'SESS-A1B2C3',
    });

    expect(result).toBe(false);
  });

  it('rejects expired sequence', () => {
    const result = validateStepupMfaSequence(
      {
        ...baseData,
        expiresAt: now - 1,
      },
      {
        transactionId: 'AUTH-ABC12',
        username: 'user_1a2b',
        passwordHint: 'pw-xy',
        mfaMethod: 'totp',
        otpCode: '123456',
        approvalToken: 'APP-A1B2',
        finalSessionToken: 'SESS-A1B2C3',
      },
    );

    expect(result).toBe(false);
  });
});
