import { describe, expect, it } from 'vitest';
import { validateOnePageAuthWizard } from '../onePageAuthWizard.js';
import type { OnePageAuthWizardData } from '../onePageAuthWizard.js';

const now = Date.now();

const baseData: OnePageAuthWizardData = {
  transactionId: 'WIZ-ABC12',
  username: 'wizard_a1b2',
  secretAnswer: 'ans-xy',
  mfaCode: '654321',
  finalSessionToken: 'WSESS-A1B2C3',
  stepTokens: {
    step1: 'W1-AAAA',
    step2: 'W2-BBBB',
    step3: 'W3-CCCC',
  },
  expectedWizardState: 'step1>step2>step3>complete',
  expiresAt: now + 120000,
};

describe('one-page auth wizard', () => {
  it('accepts a valid full wizard sequence', () => {
    const result = validateOnePageAuthWizard(baseData, {
      transactionId: 'WIZ-ABC12',
      username: 'wizard_a1b2',
      secretAnswer: 'ans-xy',
      step1Token: 'W1-AAAA',
      step2PrevToken: 'W1-AAAA',
      step2Token: 'W2-BBBB',
      step3PrevToken: 'W2-BBBB',
      step3Token: 'W3-CCCC',
      mfaCode: '654321',
      wizardState: 'step1>step2>step3>complete',
      finalSessionToken: 'WSESS-A1B2C3',
    });

    expect(result).toBe(true);
  });

  it('rejects broken step token chaining', () => {
    const result = validateOnePageAuthWizard(baseData, {
      transactionId: 'WIZ-ABC12',
      username: 'wizard_a1b2',
      secretAnswer: 'ans-xy',
      step1Token: 'W1-AAAA',
      step2PrevToken: 'W1-XXXX',
      step2Token: 'W2-BBBB',
      step3PrevToken: 'W2-BBBB',
      step3Token: 'W3-CCCC',
      mfaCode: '654321',
      wizardState: 'step1>step2>step3>complete',
      finalSessionToken: 'WSESS-A1B2C3',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong wizard state progression', () => {
    const result = validateOnePageAuthWizard(baseData, {
      transactionId: 'WIZ-ABC12',
      username: 'wizard_a1b2',
      secretAnswer: 'ans-xy',
      step1Token: 'W1-AAAA',
      step2PrevToken: 'W1-AAAA',
      step2Token: 'W2-BBBB',
      step3PrevToken: 'W2-BBBB',
      step3Token: 'W3-CCCC',
      mfaCode: '654321',
      wizardState: 'step1>step3>complete',
      finalSessionToken: 'WSESS-A1B2C3',
    });

    expect(result).toBe(false);
  });

  it('rejects expired wizard flow', () => {
    const result = validateOnePageAuthWizard(
      {
        ...baseData,
        expiresAt: now - 1,
      },
      {
        transactionId: 'WIZ-ABC12',
        username: 'wizard_a1b2',
        secretAnswer: 'ans-xy',
        step1Token: 'W1-AAAA',
        step2PrevToken: 'W1-AAAA',
        step2Token: 'W2-BBBB',
        step3PrevToken: 'W2-BBBB',
        step3Token: 'W3-CCCC',
        mfaCode: '654321',
        wizardState: 'step1>step2>step3>complete',
        finalSessionToken: 'WSESS-A1B2C3',
      },
    );

    expect(result).toBe(false);
  });
});
