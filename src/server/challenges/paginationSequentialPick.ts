import type { ChallengeContext } from './types.js';
import { randomInt } from './utils.js';

type PaginationSequentialPickData = {
  pages: {
    page: number;
    rows: { itemId: string; token: string; isTarget: boolean }[];
  }[];
  expected: {
    page1: string;
    page2: string;
    page3: string;
  };
  expectedPageTrail: string;
};

const PAGE_COUNT = 3;
const ROWS_PER_PAGE = 4;

const makeToken = (page: number, row: number, seedPart: number) => `TK-${page}${row}-${seedPart}`;

export const generatePaginationSequentialPick = (
  context: ChallengeContext,
): PaginationSequentialPickData => {
  const pages: PaginationSequentialPickData['pages'] = [];

  for (let page = 1; page <= PAGE_COUNT; page += 1) {
    const targetIndex = randomInt(0, ROWS_PER_PAGE - 1, context.rng);
    const rows = Array.from({ length: ROWS_PER_PAGE }, (_, rowIndex) => {
      const itemNo = page * 100 + rowIndex + 1;
      return {
        itemId: `ITM-${itemNo}`,
        token: makeToken(page, rowIndex + 1, randomInt(100, 999, context.rng)),
        isTarget: rowIndex === targetIndex,
      };
    });

    pages.push({ page, rows });
  }

  const expected = {
    page1: pages[0].rows.find((row) => row.isTarget)?.token ?? '',
    page2: pages[1].rows.find((row) => row.isTarget)?.token ?? '',
    page3: pages[2].rows.find((row) => row.isTarget)?.token ?? '',
  };

  return {
    pages,
    expected,
    expectedPageTrail: '1>2>3',
  };
};

export const renderPaginationSequentialPick = (
  context: ChallengeContext,
  data: PaginationSequentialPickData,
) => {
  const pageBlocks = data.pages
    .map((pageData) => {
      const rows = pageData.rows
        .map((row) => {
          const marker = row.isTarget ? 'target' : 'decoy';
          return `
            <tr data-row-role="${marker}">
              <td>${row.itemId}</td>
              <td>${row.token}</td>
              <td>${row.isTarget ? 'pick-me' : 'skip'}</td>
            </tr>
          `;
        })
        .join('');

      return `
        <section data-page-index="${pageData.page}" style="margin: 10px 0;">
          <h2 style="margin-bottom: 6px;">Page ${pageData.page}</h2>
          <table style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align:left;">Item</th>
                <th style="text-align:left;">Token</th>
                <th style="text-align:left;">Rule</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </section>
      `;
    })
    .join('');

  return `
    <h1>Challenge ${context.index}: Pagination Sequential Pick</h1>
    <p class="muted">Traverse pages in order and submit the picked token from each page in sequence.</p>
    <ul class="muted">
      <li>Pick exactly one row marked <strong>pick-me</strong> per page.</li>
      <li>Submit token for page 1, then page 2, then page 3.</li>
      <li>Required page trail*: <strong>${data.expectedPageTrail}</strong></li>
    </ul>

    ${pageBlocks}

    <label class="muted" for="page1Token">Page 1 token*</label>
    <input id="page1Token" name="page1Token" type="text" required />

    <label class="muted" for="page2Token">Page 2 token*</label>
    <input id="page2Token" name="page2Token" type="text" required />

    <label class="muted" for="page3Token">Page 3 token*</label>
    <input id="page3Token" name="page3Token" type="text" required />

    <label class="muted" for="pageTrail">Page trail*</label>
    <input id="pageTrail" name="pageTrail" type="text" placeholder="1>2>3" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validatePaginationSequentialPick = (
  data: PaginationSequentialPickData,
  payload: Record<string, unknown>,
) => {
  const page1Token = read(payload, 'page1Token');
  const page2Token = read(payload, 'page2Token');
  const page3Token = read(payload, 'page3Token');
  const pageTrail = read(payload, 'pageTrail');

  if (pageTrail !== data.expectedPageTrail) {
    return false;
  }

  if (
    page1Token !== data.expected.page1 ||
    page2Token !== data.expected.page2 ||
    page3Token !== data.expected.page3
  ) {
    return false;
  }

  return true;
};
