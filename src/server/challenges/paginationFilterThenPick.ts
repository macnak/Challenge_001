import type { ChallengeContext } from './types.js';
import { pick, randomInt } from './utils.js';

type FilterMode = 'region' | 'status';
type SortMode = 'priority-desc' | 'ticket-asc';

type PaginationFilterThenPickData = {
  pages: {
    page: number;
    rows: {
      ticketId: string;
      region: string;
      status: string;
      priority: number;
      isTarget: boolean;
    }[];
  }[];
  rule: {
    filterMode: FilterMode;
    filterValue: string;
    sortMode: SortMode;
    expectedPageTrail: string;
  };
  expected: {
    targetTicketId: string;
  };
};

const REGIONS = ['NA', 'EMEA', 'APAC', 'LATAM'];
const STATUSES = ['open', 'pending', 'hold', 'closed'];
const PAGE_COUNT = 3;
const ROWS_PER_PAGE = 4;

const sortRows = (
  rows: PaginationFilterThenPickData['pages'][number]['rows'][number][],
  mode: SortMode,
) => {
  if (mode === 'priority-desc') {
    return [...rows].sort((left, right) => right.priority - left.priority);
  }

  return [...rows].sort((left, right) => left.ticketId.localeCompare(right.ticketId));
};

const applyFilter = (
  rows: PaginationFilterThenPickData['pages'][number]['rows'][number][],
  mode: FilterMode,
  value: string,
) => {
  if (mode === 'region') {
    return rows.filter((row) => row.region === value);
  }

  return rows.filter((row) => row.status === value);
};

export const generatePaginationFilterThenPick = (
  context: ChallengeContext,
): PaginationFilterThenPickData => {
  const filterMode: FilterMode = pick(['region', 'status'], context.rng);
  const sortMode: SortMode = pick(['priority-desc', 'ticket-asc'], context.rng);
  const filterValue =
    filterMode === 'region' ? pick(REGIONS, context.rng) : pick(STATUSES, context.rng);

  const targetPage = randomInt(1, PAGE_COUNT, context.rng);
  const targetRow = randomInt(0, ROWS_PER_PAGE - 1, context.rng);

  const pages: PaginationFilterThenPickData['pages'] = [];
  for (let page = 1; page <= PAGE_COUNT; page += 1) {
    const rows = Array.from({ length: ROWS_PER_PAGE }, (_, rowIndex) => {
      const ticketId = `TCK-${page}${rowIndex + 1}${randomInt(100, 999, context.rng)}`;
      const region = pick(REGIONS, context.rng);
      const status = pick(STATUSES, context.rng);
      const priority = randomInt(1, 9, context.rng);
      return {
        ticketId,
        region,
        status,
        priority,
        isTarget: page === targetPage && rowIndex === targetRow,
      };
    });

    pages.push({ page, rows });
  }

  const target = pages[targetPage - 1].rows[targetRow];
  if (filterMode === 'region') {
    target.region = filterValue;
  } else {
    target.status = filterValue;
  }

  const filteredSorted = sortRows(
    applyFilter(
      pages.flatMap((page) => page.rows),
      filterMode,
      filterValue,
    ),
    sortMode,
  );
  const canonicalTarget = filteredSorted.find((row) => row.isTarget) ?? target;

  return {
    pages,
    rule: {
      filterMode,
      filterValue,
      sortMode,
      expectedPageTrail: '1>2>3',
    },
    expected: {
      targetTicketId: canonicalTarget.ticketId,
    },
  };
};

export const renderPaginationFilterThenPick = (
  context: ChallengeContext,
  data: PaginationFilterThenPickData,
) => {
  const pageBlocks = data.pages
    .map((pageData) => {
      const rows = pageData.rows
        .map((row) => {
          return `
            <tr>
              <td>${row.ticketId}</td>
              <td>${row.region}</td>
              <td>${row.status}</td>
              <td>${row.priority}</td>
              <td>${row.isTarget ? 'candidate' : 'noise'}</td>
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
                <th style="text-align:left;">Ticket</th>
                <th style="text-align:left;">Region</th>
                <th style="text-align:left;">Status</th>
                <th style="text-align:left;">Priority</th>
                <th style="text-align:left;">Marker</th>
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

  const filterInstruction =
    data.rule.filterMode === 'region'
      ? `Apply region filter: ${data.rule.filterValue}`
      : `Apply status filter: ${data.rule.filterValue}`;

  return `
    <h1>Challenge ${context.index}: Pagination Filter Then Pick</h1>
    <p class="muted">Apply filter and sort rules, traverse pages, then submit the final picked ticket.</p>
    <ul class="muted">
      <li>${filterInstruction}</li>
      <li>Apply sort mode: <strong>${data.rule.sortMode}</strong></li>
      <li>Traverse pages in order*: <strong>${data.rule.expectedPageTrail}</strong></li>
      <li>After filtering/sorting logic, submit the target ticket id.</li>
    </ul>

    ${pageBlocks}

    <label class="muted" for="targetTicketId">Target ticket id*</label>
    <input id="targetTicketId" name="targetTicketId" type="text" required />

    <label class="muted" for="filterMode">Filter mode*</label>
    <input id="filterMode" name="filterMode" type="text" required />

    <label class="muted" for="filterValue">Filter value*</label>
    <input id="filterValue" name="filterValue" type="text" required />

    <label class="muted" for="sortMode">Sort mode*</label>
    <input id="sortMode" name="sortMode" type="text" required />

    <label class="muted" for="pageTrail">Page trail*</label>
    <input id="pageTrail" name="pageTrail" type="text" placeholder="1>2>3" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validatePaginationFilterThenPick = (
  data: PaginationFilterThenPickData,
  payload: Record<string, unknown>,
) => {
  const targetTicketId = read(payload, 'targetTicketId');
  const filterMode = read(payload, 'filterMode') as FilterMode;
  const filterValue = read(payload, 'filterValue');
  const sortMode = read(payload, 'sortMode') as SortMode;
  const pageTrail = read(payload, 'pageTrail');

  if (filterMode !== data.rule.filterMode) {
    return false;
  }

  if (filterValue !== data.rule.filterValue) {
    return false;
  }

  if (sortMode !== data.rule.sortMode) {
    return false;
  }

  if (pageTrail !== data.rule.expectedPageTrail) {
    return false;
  }

  if (targetTicketId !== data.expected.targetTicketId) {
    return false;
  }

  return true;
};
