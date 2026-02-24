import { describe, expect, it } from 'vitest';
import { validateMenuClickBasic } from '../menuClickBasic.js';

const baseData = {
  menuId: 'main-actions',
  items: [
    { id: 'settings', label: 'Settings' },
    { id: 'reports', label: 'Reports' },
  ],
  required: {
    itemId: 'settings',
    itemLabel: 'Settings',
    expectedMenuState: 'open',
  },
};

describe('menu click basic', () => {
  it('accepts when menu is open and selected label matches instruction', () => {
    const result = validateMenuClickBasic(baseData, {
      menuState: 'open',
      selectedItemLabel: 'Settings',
    });

    expect(result).toBe(true);
  });

  it('rejects when menu is not open', () => {
    const result = validateMenuClickBasic(baseData, {
      menuState: 'closed',
      selectedItemLabel: 'Settings',
    });

    expect(result).toBe(false);
  });

  it('rejects when selected item does not match required label', () => {
    const result = validateMenuClickBasic(baseData, {
      menuState: 'open',
      selectedItemLabel: 'Reports',
    });

    expect(result).toBe(false);
  });
});
