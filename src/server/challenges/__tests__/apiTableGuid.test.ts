import { describe, expect, it } from 'vitest';
import {
  buildApiTablePayload,
  resolveApiTableRuleMode,
  validateApiTableGuid,
} from '../apiTableGuid.js';

describe('api table guid', () => {
  const context = {
    session: {} as never,
    index: 1,
    rng: () => 0.2,
  };

  it('uses forced mode when provided', () => {
    const mode = resolveApiTableRuleMode(context, { forcedMode: 'compound' });
    expect(mode).toBe('compound');
  });

  it('uses sequence mode by index when provided', () => {
    const modeIndexOne = resolveApiTableRuleMode(
      { ...context, index: 1 },
      {
        sequence: ['sku', 'rating-under-cap'],
      },
    );
    const modeIndexTwo = resolveApiTableRuleMode(
      { ...context, index: 2 },
      {
        sequence: ['sku', 'rating-under-cap'],
      },
    );

    expect(modeIndexOne).toBe('sku');
    expect(modeIndexTwo).toBe('rating-under-cap');
  });

  it('accepts matching guid', () => {
    const result = validateApiTableGuid({ targetGuid: 'guid-123' }, { answer: 'guid-123' });
    expect(result).toBe(true);
  });

  it('rejects incorrect guid', () => {
    const result = validateApiTableGuid({ targetGuid: 'guid-123' }, { answer: 'guid-999' });
    expect(result).toBe(false);
  });

  it('builds payload with target and products', () => {
    const payload = buildApiTablePayload({
      targetRule: {
        mode: 'sku',
        sku: 'ELE-1001',
        instruction: 'Find the row where SKU = ELE-1001 and submit its guid.',
      },
      products: [
        {
          guid: 'g-1',
          sku: 'ELE-1001',
          name: 'Nova Lamp',
          category: 'Electronics',
          priceCents: 1099,
          stock: 12,
          rating: 4.6,
        },
      ],
    });

    expect(payload.target.mode).toBe('sku');
    if (payload.target.mode === 'sku') {
      expect(payload.target.sku).toBe('ELE-1001');
    }
    expect(payload.products).toHaveLength(1);
    expect(payload.products[0].guid).toBe('g-1');
  });

  it('builds payload for rating-under-cap rule', () => {
    const payload = buildApiTablePayload({
      targetRule: {
        mode: 'rating-under-cap',
        priceCapCents: 15000,
        metric: 'rating',
        order: 'desc',
        instruction: 'Find highest rating under price cap and submit guid.',
      },
      products: [
        {
          guid: 'g-2',
          sku: 'OFF-3001',
          name: 'Atlas Bag',
          category: 'Office',
          priceCents: 14999,
          stock: 9,
          rating: 4.9,
        },
      ],
    });

    expect(payload.target.mode).toBe('rating-under-cap');
    if (payload.target.mode === 'rating-under-cap') {
      expect(payload.target.priceCapCents).toBe(15000);
    }
  });
});
