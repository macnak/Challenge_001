import type { ChallengeContext } from './types.js';
import { pick, randomInt, randomString } from './utils.js';

type FioriCell = {
  rowKey: string;
  stock: string;
  volatileCellId: string;
};

type FioriTableIdPatternData = {
  tableId: string;
  cells: FioriCell[];
  required: {
    rowKey: string;
    columnKey: 'stock';
    volatileCellId: string;
    expectedIdentity: string;
  };
};

const ROW_KEYS = ['EMEA-EXPORT', 'APAC-EXPORT', 'NA-SYNC', 'LATAM-AUDIT', 'CORE-OPS'];

const makeVolatileCellId = (column: number, row: number) => `table_C${column}R${row}_stock`;

export const generateFioriTableIdPattern = (context: ChallengeContext): FioriTableIdPatternData => {
  const tableId = `fiori-grid-${randomString(4, context.rng)}`;
  const rowCount = randomInt(4, 6, context.rng);

  const cells: FioriCell[] = Array.from({ length: rowCount }, (_, index) => {
    const rowKey = `${pick(ROW_KEYS, context.rng)}-${index + 1}`;
    const stock = String(randomInt(20, 980, context.rng));
    const volatileCellId = makeVolatileCellId(
      randomInt(8, 42, context.rng),
      randomInt(100, 999, context.rng),
    );

    return {
      rowKey,
      stock,
      volatileCellId,
    };
  });

  const targetIndex = randomInt(0, cells.length - 1, context.rng);
  const target = cells[targetIndex];

  return {
    tableId,
    cells,
    required: {
      rowKey: target.rowKey,
      columnKey: 'stock',
      volatileCellId: target.volatileCellId,
      expectedIdentity: `${target.rowKey}|stock`,
    },
  };
};

export const renderFioriTableIdPattern = (
  context: ChallengeContext,
  data: FioriTableIdPatternData,
) => {
  const rows = data.cells
    .map(
      (cell) => `
        <tr data-row-key="${cell.rowKey}">
          <td>${cell.rowKey}</td>
          <td id="${cell.volatileCellId}" data-col="stock">${cell.stock}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Fiori Table ID Pattern</h1>
    <p class="muted">Resolve the target stock cell using robust selector logic, not full volatile id matching.</p>
    <ul class="muted">
      <li>Target row key*: <strong>${data.required.rowKey}</strong></li>
      <li>Target column*: <strong>${data.required.columnKey}</strong></li>
      <li>Example volatile id pattern: <strong>table_CxxRxxx_stock</strong></li>
    </ul>

    <table id="${data.tableId}" style="width:100%; border-collapse: collapse; margin: 10px 0;">
      <thead>
        <tr>
          <th style="text-align:left;">Row key</th>
          <th style="text-align:left;">Stock</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <label class="muted" for="rowKey">Resolved row key*</label>
    <input id="rowKey" name="rowKey" type="text" required />

    <label class="muted" for="columnKey">Resolved column key*</label>
    <input id="columnKey" name="columnKey" type="text" required />

    <label class="muted" for="resolvedIdentity">Resolved identity*</label>
    <input id="resolvedIdentity" name="resolvedIdentity" type="text" placeholder="ROW_KEY|stock" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateFioriTableIdPattern = (
  data: FioriTableIdPatternData,
  payload: Record<string, unknown>,
) => {
  const rowKey = read(payload, 'rowKey');
  const columnKey = read(payload, 'columnKey').toLowerCase();
  const resolvedIdentity = read(payload, 'resolvedIdentity');

  if (rowKey !== data.required.rowKey) {
    return false;
  }

  if (columnKey !== data.required.columnKey) {
    return false;
  }

  if (resolvedIdentity !== data.required.expectedIdentity) {
    return false;
  }

  return true;
};
