import { describe, expect, it } from 'vitest';
import { validateSortingMulti } from '../sortingMulti.js';

describe('sorting multi', () => {
  it('validates correct order', () => {
    const data = { numbers: [3, 1, 2], order: 'asc' };
    const result = validateSortingMulti(data, { answer: ['1', '2', '3'] });
    expect(result).toBe(true);
  });

  it('rejects incorrect order', () => {
    const data = { numbers: [3, 1, 2], order: 'desc' };
    const result = validateSortingMulti(data, { answer: ['1', '2', '3'] });
    expect(result).toBe(false);
  });
});
