import { describe, expect, it } from 'vitest';
import {
  computeWordOrderExpected,
  generateWordOrderPosition,
  validateWordOrderPosition,
} from '../wordOrderPosition.js';

describe('word order position', () => {
  it('generates word count and nth position in required bounds', () => {
    const data = generateWordOrderPosition({
      session: {} as never,
      index: 1,
      rng: Math.random,
    });

    expect(data.words.length).toBeGreaterThanOrEqual(10);
    expect(data.words.length).toBeLessThanOrEqual(20);
    expect(data.nth).toBeGreaterThanOrEqual(2);
    expect(data.nth).toBeLessThanOrEqual(Math.min(6, data.words.length));
    expect(typeof data.expected).toBe('string');
    expect(data.expected.length).toBeGreaterThan(0);
  });

  it('computes expected word for insensitive ascending from top', () => {
    const expected = computeWordOrderExpected({
      words: ['zeta', 'Alpha', 'beta'],
      direction: 'asc',
      caseMode: 'insensitive',
      nth: 2,
      from: 'top',
    });

    expect(expected).toBe('beta');
  });

  it('computes expected word for descending from bottom', () => {
    const expected = computeWordOrderExpected({
      words: ['Lime', 'apple', 'Berry'],
      direction: 'desc',
      caseMode: 'sensitive',
      nth: 1,
      from: 'bottom',
    });

    expect(expected).toBeTruthy();
  });

  it('validates expected answer', () => {
    const result = validateWordOrderPosition({ expected: 'Orbit' }, { answer: 'Orbit' });
    expect(result).toBe(true);
  });
});
