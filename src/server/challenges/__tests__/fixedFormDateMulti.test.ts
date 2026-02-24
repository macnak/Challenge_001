import { describe, expect, it } from 'vitest';
import { validateFixedFormDateMulti } from '../fixedFormDateMulti.js';

const baseData = {
  required: {
    clientRef: 'DT-4821',
    goLiveDate: '2026-03-15',
    summary: 'Enable rollout after control checks pass',
    tags: ['security', 'ops'],
  },
  options: {
    tags: ['security', 'billing', 'ops', 'compliance', 'integration', 'analytics'],
  },
  optional: {
    reviewerNote: 'baseline review',
  },
};

describe('fixed form date multi', () => {
  it('accepts valid mandatory values with normalized summary and tags', () => {
    const result = validateFixedFormDateMulti(baseData, {
      clientRef: 'DT-4821',
      goLiveDate: '2026-03-15',
      summary: 'Enable   rollout after   control checks pass',
      tags: ['ops', 'security'],
      reviewerNote: '',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong go-live date', () => {
    const result = validateFixedFormDateMulti(baseData, {
      clientRef: 'DT-4821',
      goLiveDate: '2026-03-16',
      summary: 'Enable rollout after control checks pass',
      tags: ['security', 'ops'],
    });

    expect(result).toBe(false);
  });

  it('rejects missing one required multi-select tag', () => {
    const result = validateFixedFormDateMulti(baseData, {
      clientRef: 'DT-4821',
      goLiveDate: '2026-03-15',
      summary: 'Enable rollout after control checks pass',
      tags: ['security'],
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional reviewer note', () => {
    const result = validateFixedFormDateMulti(baseData, {
      clientRef: 'DT-4821',
      goLiveDate: '2026-03-15',
      summary: 'Enable rollout after control checks pass',
      tags: ['security', 'ops'],
      reviewerNote: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
