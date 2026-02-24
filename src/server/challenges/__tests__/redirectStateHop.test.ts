import { describe, expect, it } from 'vitest';
import { validateRedirectStateHop } from '../redirectStateHop.js';

const baseData = {
  required: {
    initialPath: '/auth/start',
    intermediatePath: '/auth/hop',
    finalPath: '/auth/final',
    state: 'ST-ABC12345',
    hopTrail: '/auth/start>/auth/hop>/auth/final',
    redirectSignature: 'SIG-ABCDE',
  },
};

describe('redirect state hop', () => {
  it('accepts correct state, hop trail, and signature', () => {
    const result = validateRedirectStateHop(baseData, {
      state: 'ST-ABC12345',
      hopTrail: '/auth/start>/auth/hop>/auth/final',
      redirectSignature: 'SIG-ABCDE',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong state', () => {
    const result = validateRedirectStateHop(baseData, {
      state: 'ST-WRONG',
      hopTrail: '/auth/start>/auth/hop>/auth/final',
      redirectSignature: 'SIG-ABCDE',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong hop trail order', () => {
    const result = validateRedirectStateHop(baseData, {
      state: 'ST-ABC12345',
      hopTrail: '/auth/start>/auth/final>/auth/hop',
      redirectSignature: 'SIG-ABCDE',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong redirect signature', () => {
    const result = validateRedirectStateHop(baseData, {
      state: 'ST-ABC12345',
      hopTrail: '/auth/start>/auth/hop>/auth/final',
      redirectSignature: 'SIG-WRONG',
    });

    expect(result).toBe(false);
  });
});
