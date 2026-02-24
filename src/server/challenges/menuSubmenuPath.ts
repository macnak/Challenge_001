import type { ChallengeContext } from './types.js';
import { pick } from './utils.js';

type MenuLeaf = {
  id: string;
  label: string;
};

type MenuBranch = {
  id: string;
  label: string;
  submenu: {
    id: string;
    label: string;
    items: MenuLeaf[];
  }[];
};

type MenuSubmenuPathData = {
  menuId: string;
  branches: MenuBranch[];
  required: {
    menuLabel: string;
    submenuLabel: string;
    itemLabel: string;
    itemId: string;
    expectedPath: string;
    expectedMenuState: string;
  };
};

const BRANCHES: MenuBranch[] = [
  {
    id: 'admin',
    label: 'Admin',
    submenu: [
      {
        id: 'users',
        label: 'Users',
        items: [
          { id: 'invite-user', label: 'Invite' },
          { id: 'disable-user', label: 'Disable' },
        ],
      },
      {
        id: 'roles',
        label: 'Roles',
        items: [
          { id: 'create-role', label: 'Create Role' },
          { id: 'audit-role', label: 'Audit Role' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    submenu: [
      {
        id: 'regional',
        label: 'Regional',
        items: [
          { id: 'export-emea', label: 'Export EMEA' },
          { id: 'export-apac', label: 'Export APAC' },
        ],
      },
      {
        id: 'monthly',
        label: 'Monthly',
        items: [
          { id: 'download-summary', label: 'Download Summary' },
          { id: 'download-detail', label: 'Download Detail' },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    submenu: [
      {
        id: 'tickets',
        label: 'Tickets',
        items: [
          { id: 'open-ticket', label: 'Open Ticket' },
          { id: 'escalate-ticket', label: 'Escalate' },
        ],
      },
      {
        id: 'maintenance',
        label: 'Maintenance',
        items: [
          { id: 'schedule-window', label: 'Schedule Window' },
          { id: 'pause-window', label: 'Pause Window' },
        ],
      },
    ],
  },
];

export const generateMenuSubmenuPath = (context: ChallengeContext): MenuSubmenuPathData => {
  const branch = pick(BRANCHES, context.rng);
  const submenu = pick(branch.submenu, context.rng);
  const item = pick(submenu.items, context.rng);

  return {
    menuId: 'nested-actions',
    branches: BRANCHES,
    required: {
      menuLabel: branch.label,
      submenuLabel: submenu.label,
      itemLabel: item.label,
      itemId: item.id,
      expectedPath: `${branch.label}>${submenu.label}>${item.label}`,
      expectedMenuState: 'open',
    },
  };
};

export const renderMenuSubmenuPath = (context: ChallengeContext, data: MenuSubmenuPathData) => {
  const branchMarkup = data.branches
    .map((branch) => {
      const submenuMarkup = branch.submenu
        .map((submenu) => {
          const itemsMarkup = submenu.items
            .map((item) => `<li data-menu-item-id="${item.id}">${item.label}</li>`)
            .join('');

          return `
            <li data-submenu-id="${submenu.id}">
              <strong>${submenu.label}</strong>
              <ul>
                ${itemsMarkup}
              </ul>
            </li>
          `;
        })
        .join('');

      return `
        <li data-menu-branch-id="${branch.id}">
          <strong>${branch.label}</strong>
          <ul>
            ${submenuMarkup}
          </ul>
        </li>
      `;
    })
    .join('');

  return `
    <h1>Challenge ${context.index}: Menu Submenu Path</h1>
    <p class="muted">Open the nested menu and submit the exact path selection.</p>
    <ul class="muted">
      <li>Instruction: <strong>Select: ${data.required.menuLabel} > ${data.required.submenuLabel} > ${data.required.itemLabel}</strong></li>
      <li>Submission must include both selected item id and selected path.</li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-menu-trigger="${data.menuId}">Open Nested Menu</button>
    </div>

    <nav aria-label="Nested Actions" data-menu-id="${data.menuId}">
      <ul>
        ${branchMarkup}
      </ul>
    </nav>

    <label class="muted" for="menuState">Menu state*</label>
    <input id="menuState" name="menuState" type="text" placeholder="open" required />

    <label class="muted" for="selectedItemId">Selected item id*</label>
    <input id="selectedItemId" name="selectedItemId" type="text" required />

    <label class="muted" for="selectedPath">Selected path*</label>
    <input id="selectedPath" name="selectedPath" type="text" placeholder="Menu>Submenu>Item" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateMenuSubmenuPath = (
  data: MenuSubmenuPathData,
  payload: Record<string, unknown>,
) => {
  const menuState = read(payload, 'menuState').toLowerCase();
  const selectedItemId = read(payload, 'selectedItemId');
  const selectedPath = read(payload, 'selectedPath');

  if (menuState !== data.required.expectedMenuState) {
    return false;
  }

  if (selectedItemId !== data.required.itemId) {
    return false;
  }

  if (selectedPath !== data.required.expectedPath) {
    return false;
  }

  return true;
};
