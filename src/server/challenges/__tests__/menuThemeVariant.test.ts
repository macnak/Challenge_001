import { describe, expect, it } from 'vitest';
import { validateMenuThemeVariant } from '../menuThemeVariant.js';

const baseData = {
  menuId: 'theme-actions',
  items: [
    { id: 'export-emea', label: 'Export EMEA' },
    { id: 'sync-users', label: 'Sync Users' },
  ],
  required: {
    itemId: 'export-emea',
    itemLabel: 'Export EMEA',
    expectedMenuState: 'open',
    variant: 'aria-route' as const,
  },
};

describe('menu theme variant', () => {
  it('accepts correct menu state, item id, and active variant', () => {
    const result = validateMenuThemeVariant(baseData, {
      menuState: 'open',
      selectedItemId: 'export-emea',
      variantKey: 'aria-route',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong menu state', () => {
    const result = validateMenuThemeVariant(baseData, {
      menuState: 'closed',
      selectedItemId: 'export-emea',
      variantKey: 'aria-route',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong selected item id', () => {
    const result = validateMenuThemeVariant(baseData, {
      menuState: 'open',
      selectedItemId: 'sync-users',
      variantKey: 'aria-route',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong variant key', () => {
    const result = validateMenuThemeVariant(baseData, {
      menuState: 'open',
      selectedItemId: 'export-emea',
      variantKey: 'data-key',
    });

    expect(result).toBe(false);
  });
});
