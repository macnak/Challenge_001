import { describe, expect, it } from 'vitest';
import { validatePaginationSequentialPick } from '../paginationSequentialPick.js';

const baseData = {
  pages: [
    {
      page: 1,
      rows: [
        { itemId: 'ITM-101', token: 'TK-11-111', isTarget: false },
        { itemId: 'ITM-102', token: 'TK-12-222', isTarget: true },
      ],
    },
    {
      page: 2,
      rows: [
        { itemId: 'ITM-201', token: 'TK-21-333', isTarget: true },
        { itemId: 'ITM-202', token: 'TK-22-444', isTarget: false },
      ],
    },
    {
      page: 3,
      rows: [
        { itemId: 'ITM-301', token: 'TK-31-555', isTarget: false },
        { itemId: 'ITM-302', token: 'TK-32-666', isTarget: true },
      ],
    },
  ],
  expected: {
    page1: 'TK-12-222',
    page2: 'TK-21-333',
    page3: 'TK-32-666',
  },
  expectedPageTrail: '1>2>3',
};

describe('pagination sequential pick', () => {
  it('accepts correct ordered tokens and page trail', () => {
    const result = validatePaginationSequentialPick(baseData, {
      page1Token: 'TK-12-222',
      page2Token: 'TK-21-333',
      page3Token: 'TK-32-666',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(true);
  });

  it('rejects incorrect page trail sequence', () => {
    const result = validatePaginationSequentialPick(baseData, {
      page1Token: 'TK-12-222',
      page2Token: 'TK-21-333',
      page3Token: 'TK-32-666',
      pageTrail: '1>3>2',
    });

    expect(result).toBe(false);
  });

  it('rejects token order mismatch across pages', () => {
    const result = validatePaginationSequentialPick(baseData, {
      page1Token: 'TK-21-333',
      page2Token: 'TK-12-222',
      page3Token: 'TK-32-666',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong token value for a required page', () => {
    const result = validatePaginationSequentialPick(baseData, {
      page1Token: 'TK-12-222',
      page2Token: 'TK-21-333',
      page3Token: 'TK-32-000',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(false);
  });
});
