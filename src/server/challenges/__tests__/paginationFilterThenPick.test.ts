import { describe, expect, it } from 'vitest';
import { validatePaginationFilterThenPick } from '../paginationFilterThenPick.js';

const baseData = {
  pages: [
    {
      page: 1,
      rows: [
        {
          ticketId: 'TCK-1101',
          region: 'EMEA',
          status: 'open',
          priority: 8,
          isTarget: false,
        },
      ],
    },
  ],
  rule: {
    filterMode: 'region' as const,
    filterValue: 'EMEA',
    sortMode: 'priority-desc' as const,
    expectedPageTrail: '1>2>3',
  },
  expected: {
    targetTicketId: 'TCK-3399',
  },
};

describe('pagination filter then pick', () => {
  it('accepts fully correct filtered/sorted submission', () => {
    const result = validatePaginationFilterThenPick(baseData, {
      targetTicketId: 'TCK-3399',
      filterMode: 'region',
      filterValue: 'EMEA',
      sortMode: 'priority-desc',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong filter mode', () => {
    const result = validatePaginationFilterThenPick(baseData, {
      targetTicketId: 'TCK-3399',
      filterMode: 'status',
      filterValue: 'EMEA',
      sortMode: 'priority-desc',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong sort mode', () => {
    const result = validatePaginationFilterThenPick(baseData, {
      targetTicketId: 'TCK-3399',
      filterMode: 'region',
      filterValue: 'EMEA',
      sortMode: 'ticket-asc',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong page trail', () => {
    const result = validatePaginationFilterThenPick(baseData, {
      targetTicketId: 'TCK-3399',
      filterMode: 'region',
      filterValue: 'EMEA',
      sortMode: 'priority-desc',
      pageTrail: '1>3>2',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong final ticket selection', () => {
    const result = validatePaginationFilterThenPick(baseData, {
      targetTicketId: 'TCK-0000',
      filterMode: 'region',
      filterValue: 'EMEA',
      sortMode: 'priority-desc',
      pageTrail: '1>2>3',
    });

    expect(result).toBe(false);
  });
});
