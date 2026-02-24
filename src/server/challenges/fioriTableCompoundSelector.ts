import type { ChallengeContext } from './types.js';
import { pick, randomInt, randomString } from './utils.js';

type FioriCompoundCell = {
  rowKey: string;
  action: string;
  metric: 'stock' | 'latency';
  value: string;
  volatileCellId: string;
  roleAnchor: string;
};

type FioriTableCompoundSelectorData = {
  tableId: string;
  cells: FioriCompoundCell[];
  required: {
    rowKey: string;
    action: string;
    metric: 'stock' | 'latency';
    roleAnchor: string;
    expectedIdentity: string;
  };
};

const ROW_KEYS = ['EMEA', 'APAC', 'NA', 'LATAM', 'CORE'];
const ACTIONS = ['Export', 'Sync', 'Audit', 'Rotate', 'Archive'];
const METRICS: Array<'stock' | 'latency'> = ['stock', 'latency'];

const makeVolatileCellId = (metric: string, context: ChallengeContext) => {
  return `table_C${randomInt(10, 60, context.rng)}R${randomInt(100, 999, context.rng)}_${metric}`;
};

export const generateFioriTableCompoundSelector = (
  context: ChallengeContext,
): FioriTableCompoundSelectorData => {
  const tableId = `fiori-compound-${randomString(4, context.rng)}`;
  const rowCount = randomInt(5, 7, context.rng);

  const cells: FioriCompoundCell[] = Array.from({ length: rowCount }, (_, index) => {
    const rowKey = `${pick(ROW_KEYS, context.rng)}-${index + 1}`;
    const action = pick(ACTIONS, context.rng);
    const metric = pick(METRICS, context.rng);
    const roleAnchor = `cell-${action.toLowerCase()}-${metric}`;

    return {
      rowKey,
      action,
      metric,
      value: String(randomInt(10, 990, context.rng)),
      volatileCellId: makeVolatileCellId(metric, context),
      roleAnchor,
    };
  });

  const targetIndex = randomInt(0, cells.length - 1, context.rng);
  const target = cells[targetIndex];

  return {
    tableId,
    cells,
    required: {
      rowKey: target.rowKey,
      action: target.action,
      metric: target.metric,
      roleAnchor: target.roleAnchor,
      expectedIdentity: `${target.rowKey}|${target.action}|${target.metric}`,
    },
  };
};

export const renderFioriTableCompoundSelector = (
  context: ChallengeContext,
  data: FioriTableCompoundSelectorData,
) => {
  const rows = data.cells
    .map(
      (cell) => `
        <tr data-row-key="${cell.rowKey}" data-action="${cell.action}">
          <td>${cell.rowKey}</td>
          <td>${cell.action}</td>
          <td id="${cell.volatileCellId}" data-col="${cell.metric}" data-role-anchor="${cell.roleAnchor}">${cell.value}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Fiori Table Compound Selector</h1>
    <p class="muted">Resolve the target using compound anchors and ignore volatile numeric id segments.</p>
    <ul class="muted">
      <li>Target row key*: <strong>${data.required.rowKey}</strong></li>
      <li>Target action*: <strong>${data.required.action}</strong></li>
      <li>Target metric*: <strong>${data.required.metric}</strong></li>
      <li>Role anchor*: <strong>${data.required.roleAnchor}</strong></li>
    </ul>

    <table id="${data.tableId}" style="width:100%; border-collapse: collapse; margin: 10px 0;">
      <thead>
        <tr>
          <th style="text-align:left;">Row key</th>
          <th style="text-align:left;">Action</th>
          <th style="text-align:left;">Metric value</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <label class="muted" for="rowKey">Resolved row key*</label>
    <input id="rowKey" name="rowKey" type="text" required />

    <label class="muted" for="action">Resolved action*</label>
    <input id="action" name="action" type="text" required />

    <label class="muted" for="metric">Resolved metric*</label>
    <input id="metric" name="metric" type="text" required />

    <label class="muted" for="roleAnchor">Resolved role anchor*</label>
    <input id="roleAnchor" name="roleAnchor" type="text" required />

    <label class="muted" for="resolvedIdentity">Resolved identity*</label>
    <input id="resolvedIdentity" name="resolvedIdentity" type="text" placeholder="ROW|ACTION|METRIC" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateFioriTableCompoundSelector = (
  data: FioriTableCompoundSelectorData,
  payload: Record<string, unknown>,
) => {
  const rowKey = read(payload, 'rowKey');
  const action = read(payload, 'action');
  const metric = read(payload, 'metric').toLowerCase() as 'stock' | 'latency';
  const roleAnchor = read(payload, 'roleAnchor');
  const resolvedIdentity = read(payload, 'resolvedIdentity');

  if (rowKey !== data.required.rowKey) {
    return false;
  }

  if (action !== data.required.action) {
    return false;
  }

  if (metric !== data.required.metric) {
    return false;
  }

  if (roleAnchor !== data.required.roleAnchor) {
    return false;
  }

  if (resolvedIdentity !== data.required.expectedIdentity) {
    return false;
  }

  return true;
};
