import { describe, expect, it } from 'vitest';
import { validateSortingSingle } from '../sortingSingle.js';

describe('sorting single', () => {
  it('validates ascending list with comma delimiter', () => {
    const data = { numbers: [3, 1, 2], order: 'asc', delimiter: ',' };
    const result = validateSortingSingle(data, { answer: '1,2,3' });
    expect(result).toBe(true);
  });

  it('rejects wrong order', () => {
    const data = { numbers: [3, 1, 2], order: 'desc', delimiter: ',' };
    const result = validateSortingSingle(data, { answer: '1,2,3' });
    expect(result).toBe(false);
  });
});
