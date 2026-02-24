import { describe, expect, it } from 'vitest';
import { validateFioriTableCompoundSelector } from '../fioriTableCompoundSelector.js';

const baseData = {
  tableId: 'fiori-compound-a1b2',
  cells: [
    {
      rowKey: 'EMEA-1',
      action: 'Export',
      metric: 'stock' as const,
      value: '220',
      volatileCellId: 'table_C12R125_stock',
      roleAnchor: 'cell-export-stock',
    },
  ],
  required: {
    rowKey: 'EMEA-1',
    action: 'Export',
    metric: 'stock' as const,
    roleAnchor: 'cell-export-stock',
    expectedIdentity: 'EMEA-1|Export|stock',
  },
};

describe('fiori table compound selector', () => {
  it('accepts correct compound selector resolution', () => {
    const result = validateFioriTableCompoundSelector(baseData, {
      rowKey: 'EMEA-1',
      action: 'Export',
      metric: 'stock',
      roleAnchor: 'cell-export-stock',
      resolvedIdentity: 'EMEA-1|Export|stock',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong role anchor', () => {
    const result = validateFioriTableCompoundSelector(baseData, {
      rowKey: 'EMEA-1',
      action: 'Export',
      metric: 'stock',
      roleAnchor: 'cell-export-latency',
      resolvedIdentity: 'EMEA-1|Export|stock',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong metric', () => {
    const result = validateFioriTableCompoundSelector(baseData, {
      rowKey: 'EMEA-1',
      action: 'Export',
      metric: 'latency',
      roleAnchor: 'cell-export-stock',
      resolvedIdentity: 'EMEA-1|Export|latency',
    });

    expect(result).toBe(false);
  });

  it('rejects mismatched canonical identity', () => {
    const result = validateFioriTableCompoundSelector(baseData, {
      rowKey: 'EMEA-1',
      action: 'Export',
      metric: 'stock',
      roleAnchor: 'cell-export-stock',
      resolvedIdentity: 'EMEA-1|Export|latency',
    });

    expect(result).toBe(false);
  });
});
