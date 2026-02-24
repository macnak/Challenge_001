import type { ChallengeContext } from './types.js';
import { pick, randomInt } from './utils.js';

type MenuHoverDelayData = {
  menuId: string;
  items: { id: string; label: string }[];
  required: {
    itemId: string;
    itemLabel: string;
    minHoverMs: number;
    expectedMenuState: string;
  };
};

const MENU_ITEMS = [
  { id: 'reports', label: 'Reports' },
  { id: 'exports', label: 'Exports' },
  { id: 'audit', label: 'Audit Logs' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'integrations', label: 'Integrations' },
];

export const generateMenuHoverDelay = (context: ChallengeContext): MenuHoverDelayData => {
  const requiredItem = pick(MENU_ITEMS, context.rng);

  return {
    menuId: 'hover-menu',
    items: MENU_ITEMS,
    required: {
      itemId: requiredItem.id,
      itemLabel: requiredItem.label,
      minHoverMs: randomInt(350, 900, context.rng),
      expectedMenuState: 'hover-open',
    },
  };
};

export const renderMenuHoverDelay = (context: ChallengeContext, data: MenuHoverDelayData) => {
  const menuRows = data.items
    .map((item) => `<li data-menu-item-id="${item.id}">${item.label}</li>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Menu Hover Delay</h1>
    <p class="muted">Hover to open the menu, wait for the delay window, then select the instructed item.</p>
    <ul class="muted">
      <li>Instruction: <strong>Hover menu then select: ${data.required.itemLabel}</strong></li>
      <li>Minimum hover duration*: <strong>${data.required.minHoverMs}ms</strong></li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-menu-hover-trigger="${data.menuId}">Hover Menu</button>
    </div>

    <nav aria-label="Hover Actions" data-menu-id="${data.menuId}">
      <ul>
        ${menuRows}
      </ul>
    </nav>

    <label class="muted" for="menuState">Menu state*</label>
    <input id="menuState" name="menuState" type="text" placeholder="hover-open" required />

    <label class="muted" for="hoverDurationMs">Hover duration ms*</label>
    <input id="hoverDurationMs" name="hoverDurationMs" type="text" required />

    <label class="muted" for="selectedItemLabel">Selected item label*</label>
    <input id="selectedItemLabel" name="selectedItemLabel" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateMenuHoverDelay = (
  data: MenuHoverDelayData,
  payload: Record<string, unknown>,
) => {
  const menuState = read(payload, 'menuState').toLowerCase();
  const hoverDurationRaw = read(payload, 'hoverDurationMs');
  const selectedItemLabel = read(payload, 'selectedItemLabel');

  if (menuState !== data.required.expectedMenuState) {
    return false;
  }

  const hoverDurationMs = Number.parseInt(hoverDurationRaw, 10);
  if (!Number.isFinite(hoverDurationMs) || hoverDurationMs < data.required.minHoverMs) {
    return false;
  }

  if (selectedItemLabel !== data.required.itemLabel) {
    return false;
  }

  return true;
};
