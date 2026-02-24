import { describe, expect, it } from 'vitest';
import { validatePageTimeoutStepWindow } from '../pageTimeoutStepWindow.js';

const now = Date.now();

const activeData = {
  transactionId: 'TX-ABC123',
  issuedAt: now,
  expiresAt: now + 60_000,
  maxStepGapMs: 5000,
  stepTokens: {
    step1: 'SW-11111',
    step2: 'SW-22222',
    step3: 'SW-33333',
  },
};

describe('page timeout step window', () => {
  it('accepts valid token chain within constraints', () => {
    const result = validatePageTimeoutStepWindow(activeData, {
      transactionId: 'TX-ABC123',
      step1Token: 'SW-11111',
      step2PrevToken: 'SW-11111',
      step2Token: 'SW-22222',
      step3PrevToken: 'SW-22222',
      step3Token: 'SW-33333',
      reportedStepGapMs: '4200',
      finalToken: 'SW-33333',
    });

    expect(result).toBe(true);
  });

  it('rejects when overall challenge expiry has passed', () => {
    const expiredData = {
      ...activeData,
      expiresAt: now - 1,
    };

    const result = validatePageTimeoutStepWindow(expiredData, {
      transactionId: 'TX-ABC123',
      step1Token: 'SW-11111',
      step2PrevToken: 'SW-11111',
      step2Token: 'SW-22222',
      step3PrevToken: 'SW-22222',
      step3Token: 'SW-33333',
      reportedStepGapMs: '4200',
      finalToken: 'SW-33333',
    });

    expect(result).toBe(false);
  });

  it('rejects broken step-token continuity', () => {
    const result = validatePageTimeoutStepWindow(activeData, {
      transactionId: 'TX-ABC123',
      step1Token: 'SW-11111',
      step2PrevToken: 'SW-00000',
      step2Token: 'SW-22222',
      step3PrevToken: 'SW-22222',
      step3Token: 'SW-33333',
      reportedStepGapMs: '4200',
      finalToken: 'SW-33333',
    });

    expect(result).toBe(false);
  });

  it('rejects step gap larger than allowed window', () => {
    const result = validatePageTimeoutStepWindow(activeData, {
      transactionId: 'TX-ABC123',
      step1Token: 'SW-11111',
      step2PrevToken: 'SW-11111',
      step2Token: 'SW-22222',
      step3PrevToken: 'SW-22222',
      step3Token: 'SW-33333',
      reportedStepGapMs: '8000',
      finalToken: 'SW-33333',
    });

    expect(result).toBe(false);
  });
});
