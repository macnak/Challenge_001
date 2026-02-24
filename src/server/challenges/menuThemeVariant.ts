import type { ChallengeContext } from './types.js';
import { pick } from './utils.js';

type ThemeVariant = 'data-key' | 'aria-route' | 'test-id';

type MenuThemeVariantData = {
  menuId: string;
  items: { id: string; label: string }[];
  required: {
    itemId: string;
    itemLabel: string;
    expectedMenuState: string;
    variant: ThemeVariant;
  };
};

const MENU_ITEMS = [
  { id: 'export-emea', label: 'Export EMEA' },
  { id: 'export-apac', label: 'Export APAC' },
  { id: 'sync-users', label: 'Sync Users' },
  { id: 'rotate-keys', label: 'Rotate Keys' },
  { id: 'archive-logs', label: 'Archive Logs' },
];

const VARIANTS: ThemeVariant[] = ['data-key', 'aria-route', 'test-id'];

export const generateMenuThemeVariant = (context: ChallengeContext): MenuThemeVariantData => {
  const requiredItem = pick(MENU_ITEMS, context.rng);

  return {
    menuId: 'theme-actions',
    items: MENU_ITEMS,
    required: {
      itemId: requiredItem.id,
      itemLabel: requiredItem.label,
      expectedMenuState: 'open',
      variant: pick(VARIANTS, context.rng),
    },
  };
};

const renderItem = (variant: ThemeVariant, item: { id: string; label: string }) => {
  if (variant === 'data-key') {
    return `<li data-key="${item.id}">${item.label}</li>`;
  }

  if (variant === 'aria-route') {
    return `<li aria-label="route-${item.id}">${item.label}</li>`;
  }

  return `<li data-testid="menu-item-${item.id}">${item.label}</li>`;
};

export const renderMenuThemeVariant = (context: ChallengeContext, data: MenuThemeVariantData) => {
  const menuRows = data.items.map((item) => renderItem(data.required.variant, item)).join('');

  return `
    <h1>Challenge ${context.index}: Menu Theme Variant</h1>
    <p class="muted">Select the instructed item while menu markup variant rotates each run.</p>
    <ul class="muted">
      <li>Instruction: <strong>Select: ${data.required.itemLabel}</strong></li>
      <li>Active render variant: <strong>${data.required.variant}</strong></li>
      <li>Submission must include selected item id and variant key.</li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-menu-trigger="${data.menuId}">Open Themed Menu</button>
    </div>

    <nav aria-label="Theme Actions" data-menu-id="${data.menuId}">
      <ul>
        ${menuRows}
      </ul>
    </nav>

    <label class="muted" for="menuState">Menu state*</label>
    <input id="menuState" name="menuState" type="text" placeholder="open" required />

    <label class="muted" for="selectedItemId">Selected item id*</label>
    <input id="selectedItemId" name="selectedItemId" type="text" required />

    <label class="muted" for="variantKey">Variant key*</label>
    <input id="variantKey" name="variantKey" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateMenuThemeVariant = (
  data: MenuThemeVariantData,
  payload: Record<string, unknown>,
) => {
  const menuState = read(payload, 'menuState').toLowerCase();
  const selectedItemId = read(payload, 'selectedItemId');
  const variantKey = read(payload, 'variantKey');

  if (menuState !== data.required.expectedMenuState) {
    return false;
  }

  if (selectedItemId !== data.required.itemId) {
    return false;
  }

  if (variantKey !== data.required.variant) {
    return false;
  }

  return true;
};
