import { describe, expect, it } from 'vitest';
import { validateMenuHoverDelay } from '../menuHoverDelay.js';

const baseData = {
  menuId: 'hover-menu',
  items: [
    { id: 'reports', label: 'Reports' },
    { id: 'exports', label: 'Exports' },
  ],
  required: {
    itemId: 'reports',
    itemLabel: 'Reports',
    minHoverMs: 500,
    expectedMenuState: 'hover-open',
  },
};

describe('menu hover delay', () => {
  it('accepts valid hover-open state, sufficient delay, and correct item', () => {
    const result = validateMenuHoverDelay(baseData, {
      menuState: 'hover-open',
      hoverDurationMs: '520',
      selectedItemLabel: 'Reports',
    });

    expect(result).toBe(true);
  });

  it('rejects if menu is not opened by hover', () => {
    const result = validateMenuHoverDelay(baseData, {
      menuState: 'open',
      hoverDurationMs: '520',
      selectedItemLabel: 'Reports',
    });

    expect(result).toBe(false);
  });

  it('rejects if hover duration is below required threshold', () => {
    const result = validateMenuHoverDelay(baseData, {
      menuState: 'hover-open',
      hoverDurationMs: '300',
      selectedItemLabel: 'Reports',
    });

    expect(result).toBe(false);
  });

  it('rejects if selected label does not match required item', () => {
    const result = validateMenuHoverDelay(baseData, {
      menuState: 'hover-open',
      hoverDurationMs: '520',
      selectedItemLabel: 'Exports',
    });

    expect(result).toBe(false);
  });
});
