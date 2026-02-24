import { describe, expect, it } from 'vitest';
import { validateRedirectTokenBranching } from '../redirectTokenBranching.js';

describe('redirect token branching', () => {
  it('rejects before pickup confirmation', () => {
    const result = validateRedirectTokenBranching(
      {
        expectedBranch: 'alpha',
        tokens: { alpha: 'RB-A-AAAA1111', beta: 'RB-B-BBBB2222' },
        hopKeys: { alpha: 'aa11', beta: 'bb22' },
        pickupConfirmed: false,
        pickedBranch: null,
      },
      { answer: 'RB-A-AAAA1111' },
    );

    expect(result).toBe(false);
  });

  it('rejects when wrong branch was used', () => {
    const result = validateRedirectTokenBranching(
      {
        expectedBranch: 'alpha',
        tokens: { alpha: 'RB-A-AAAA1111', beta: 'RB-B-BBBB2222' },
        hopKeys: { alpha: 'aa11', beta: 'bb22' },
        pickupConfirmed: true,
        pickedBranch: 'beta',
      },
      { answer: 'RB-B-BBBB2222' },
    );

    expect(result).toBe(false);
  });

  it('accepts when expected branch and token match', () => {
    const result = validateRedirectTokenBranching(
      {
        expectedBranch: 'beta',
        tokens: { alpha: 'RB-A-AAAA1111', beta: 'RB-B-BBBB2222' },
        hopKeys: { alpha: 'aa11', beta: 'bb22' },
        pickupConfirmed: true,
        pickedBranch: 'beta',
      },
      { answer: 'RB-B-BBBB2222' },
    );

    expect(result).toBe(true);
  });
});
