import { describe, expect, it } from 'vitest';
import { validateMenuSubmenuPath } from '../menuSubmenuPath.js';

const baseData = {
  menuId: 'nested-actions',
  branches: [],
  required: {
    menuLabel: 'Admin',
    submenuLabel: 'Users',
    itemLabel: 'Invite',
    itemId: 'invite-user',
    expectedPath: 'Admin>Users>Invite',
    expectedMenuState: 'open',
  },
};

describe('menu submenu path', () => {
  it('accepts correct nested path submission', () => {
    const result = validateMenuSubmenuPath(baseData, {
      menuState: 'open',
      selectedItemId: 'invite-user',
      selectedPath: 'Admin>Users>Invite',
    });

    expect(result).toBe(true);
  });

  it('rejects closed menu state', () => {
    const result = validateMenuSubmenuPath(baseData, {
      menuState: 'closed',
      selectedItemId: 'invite-user',
      selectedPath: 'Admin>Users>Invite',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong selected item id', () => {
    const result = validateMenuSubmenuPath(baseData, {
      menuState: 'open',
      selectedItemId: 'disable-user',
      selectedPath: 'Admin>Users>Invite',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong submenu path sequence', () => {
    const result = validateMenuSubmenuPath(baseData, {
      menuState: 'open',
      selectedItemId: 'invite-user',
      selectedPath: 'Admin>Roles>Invite',
    });

    expect(result).toBe(false);
  });
});
