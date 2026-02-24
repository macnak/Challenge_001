import { describe, expect, it } from 'vitest';
import { validateFioriTableIdPattern } from '../fioriTableIdPattern.js';

const baseData = {
  tableId: 'fiori-grid-ab12',
  cells: [
    { rowKey: 'EMEA-EXPORT-1', stock: '210', volatileCellId: 'table_C12R125_stock' },
    { rowKey: 'APAC-EXPORT-2', stock: '332', volatileCellId: 'table_C8R904_stock' },
  ],
  required: {
    rowKey: 'EMEA-EXPORT-1',
    columnKey: 'stock' as const,
    volatileCellId: 'table_C12R125_stock',
    expectedIdentity: 'EMEA-EXPORT-1|stock',
  },
};

describe('fiori table id pattern', () => {
  it('accepts canonical row/column resolution', () => {
    const result = validateFioriTableIdPattern(baseData, {
      rowKey: 'EMEA-EXPORT-1',
      columnKey: 'stock',
      resolvedIdentity: 'EMEA-EXPORT-1|stock',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong row key even with valid-looking volatile id context', () => {
    const result = validateFioriTableIdPattern(baseData, {
      rowKey: 'APAC-EXPORT-2',
      columnKey: 'stock',
      resolvedIdentity: 'APAC-EXPORT-2|stock',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong column key', () => {
    const result = validateFioriTableIdPattern(baseData, {
      rowKey: 'EMEA-EXPORT-1',
      columnKey: 'price',
      resolvedIdentity: 'EMEA-EXPORT-1|price',
    });

    expect(result).toBe(false);
  });

  it('rejects mismatched canonical identity', () => {
    const result = validateFioriTableIdPattern(baseData, {
      rowKey: 'EMEA-EXPORT-1',
      columnKey: 'stock',
      resolvedIdentity: 'EMEA-EXPORT-1|price',
    });

    expect(result).toBe(false);
  });
});
