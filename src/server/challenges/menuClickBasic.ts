import type { ChallengeContext } from './types.js';
import { pick } from './utils.js';

type MenuClickBasicData = {
  menuId: string;
  items: { id: string; label: string }[];
  required: {
    itemId: string;
    itemLabel: string;
    expectedMenuState: string;
  };
};

const MENU_ITEMS = [
  { id: 'settings', label: 'Settings' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users' },
  { id: 'billing', label: 'Billing' },
  { id: 'audit', label: 'Audit Logs' },
];

export const generateMenuClickBasic = (context: ChallengeContext): MenuClickBasicData => {
  const requiredItem = pick(MENU_ITEMS, context.rng);

  return {
    menuId: 'main-actions',
    items: MENU_ITEMS,
    required: {
      itemId: requiredItem.id,
      itemLabel: requiredItem.label,
      expectedMenuState: 'open',
    },
  };
};

export const renderMenuClickBasic = (context: ChallengeContext, data: MenuClickBasicData) => {
  const menuRows = data.items
    .map((item) => `<li data-menu-item-id="${item.id}">${item.label}</li>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Menu Click Basic</h1>
    <p class="muted">Open the menu and select the instructed item by visible label.</p>
    <ul class="muted">
      <li>Instruction: <strong>Select: ${data.required.itemLabel}</strong></li>
      <li>Menu must be opened before selection.</li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-menu-trigger="${data.menuId}">Open Menu</button>
    </div>

    <nav aria-label="Main Actions" data-menu-id="${data.menuId}">
      <ul>
        ${menuRows}
      </ul>
    </nav>

    <label class="muted" for="menuState">Menu state*</label>
    <input id="menuState" name="menuState" type="text" placeholder="open" required />

    <label class="muted" for="selectedItemLabel">Selected item label*</label>
    <input id="selectedItemLabel" name="selectedItemLabel" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateMenuClickBasic = (
  data: MenuClickBasicData,
  payload: Record<string, unknown>,
) => {
  const menuState = read(payload, 'menuState').toLowerCase();
  const selectedItemLabel = read(payload, 'selectedItemLabel');

  if (menuState !== data.required.expectedMenuState) {
    return false;
  }

  if (selectedItemLabel !== data.required.itemLabel) {
    return false;
  }

  return true;
};
