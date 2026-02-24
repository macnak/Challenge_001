import { describe, expect, it } from 'vitest';
import { validateRefreshRotation } from '../refreshRotation.js';

const baseData = {
  required: {
    sessionId: 'sess-a1b2c3d4',
    refreshTokenV1: 'RT1-ABC123DEF456',
    refreshTokenV2: 'RT2-789XYZ456ABC',
    accessTokenStep1: 'AT1-1111AAAA22',
    accessTokenStep2: 'AT2-BBBB3333CC',
    rotationState: 'RT1-ABC123DEF456->RT2-789XYZ456ABC',
  },
  optional: {
    note: 'first refresh invalidates prior token',
  },
};

describe('refresh rotation', () => {
  it('accepts valid rotated refresh token sequence', () => {
    const result = validateRefreshRotation(baseData, {
      sessionId: 'sess-a1b2c3d4',
      refreshTokenStep1: 'RT1-ABC123DEF456',
      accessTokenStep1: 'AT1-1111AAAA22',
      refreshTokenStep2: 'RT2-789XYZ456ABC',
      accessTokenStep2: 'AT2-BBBB3333CC',
      rotationState: 'RT1-ABC123DEF456->RT2-789XYZ456ABC',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects when step 2 reuses step 1 token', () => {
    const result = validateRefreshRotation(baseData, {
      sessionId: 'sess-a1b2c3d4',
      refreshTokenStep1: 'RT1-ABC123DEF456',
      accessTokenStep1: 'AT1-1111AAAA22',
      refreshTokenStep2: 'RT1-ABC123DEF456',
      accessTokenStep2: 'AT2-BBBB3333CC',
      rotationState: 'RT1-ABC123DEF456->RT2-789XYZ456ABC',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong step 2 access token', () => {
    const result = validateRefreshRotation(baseData, {
      sessionId: 'sess-a1b2c3d4',
      refreshTokenStep1: 'RT1-ABC123DEF456',
      accessTokenStep1: 'AT1-1111AAAA22',
      refreshTokenStep2: 'RT2-789XYZ456ABC',
      accessTokenStep2: 'AT2-WRONG0000',
      rotationState: 'RT1-ABC123DEF456->RT2-789XYZ456ABC',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note', () => {
    const result = validateRefreshRotation(baseData, {
      sessionId: 'sess-a1b2c3d4',
      refreshTokenStep1: 'RT1-ABC123DEF456',
      accessTokenStep1: 'AT1-1111AAAA22',
      refreshTokenStep2: 'RT2-789XYZ456ABC',
      accessTokenStep2: 'AT2-BBBB3333CC',
      rotationState: 'RT1-ABC123DEF456->RT2-789XYZ456ABC',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
