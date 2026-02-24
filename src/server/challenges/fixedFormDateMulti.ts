import type { ChallengeContext } from './types.js';
import { pick, randomInt } from './utils.js';

type FixedFormDateMultiData = {
  required: {
    clientRef: string;
    goLiveDate: string;
    summary: string;
    tags: string[];
  };
  options: {
    tags: string[];
  };
  optional: {
    reviewerNote: string;
  };
};

const TAG_OPTIONS = ['security', 'billing', 'ops', 'compliance', 'integration', 'analytics'];
const SUMMARY_OPTIONS = [
  'Enable rollout after control checks pass',
  'Approve handoff once staging validation is complete',
  'Proceed only with signed audit confirmation',
  'Release after profile alignment and smoke verification',
];
const NOTE_OPTIONS = ['baseline review', 'manual follow-up', 'ops-only note', 'optional memo'];

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

const normalizeList = (values: string[]) =>
  values
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .sort();

const readString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value : '';
};

const readList = (payload: Record<string, unknown>, key: string): string[] => {
  const value = payload[key];

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

export const generateFixedFormDateMulti = (context: ChallengeContext): FixedFormDateMultiData => {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() + randomInt(5, 60, context.rng));

  const firstTag = pick(TAG_OPTIONS, context.rng);
  const remaining = TAG_OPTIONS.filter((tag) => tag !== firstTag);
  const secondTag = pick(remaining, context.rng);

  return {
    required: {
      clientRef: `DT-${randomInt(1000, 9999, context.rng)}`,
      goLiveDate: toIsoDate(start),
      summary: pick(SUMMARY_OPTIONS, context.rng),
      tags: [firstTag, secondTag],
    },
    options: {
      tags: TAG_OPTIONS,
    },
    optional: {
      reviewerNote: pick(NOTE_OPTIONS, context.rng),
    },
  };
};

export const renderFixedFormDateMulti = (
  context: ChallengeContext,
  data: FixedFormDateMultiData,
) => {
  const tagOptions = data.options.tags
    .map((tag) => `<option value="${tag}">${tag}</option>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Fixed Form (Date + Multi-select)</h1>
    <p class="muted">Fill mandatory values and apply normalization rules for textarea and multi-select data.</p>
    <ul class="muted">
      <li>Client Ref*: <strong>${data.required.clientRef}</strong></li>
      <li>Go-live Date* (YYYY-MM-DD): <strong>${data.required.goLiveDate}</strong></li>
      <li>Summary* (whitespace-normalized): <strong>${data.required.summary}</strong></li>
      <li>Tags* (select both): <strong>${data.required.tags.join(', ')}</strong></li>
      <li>Reviewer Note (optional): <strong>${data.optional.reviewerNote}</strong></li>
    </ul>

    <label class="muted" for="clientRef">Client Ref*</label>
    <input id="clientRef" name="clientRef" type="text" required />

    <label class="muted" for="goLiveDate">Go-live Date*</label>
    <input id="goLiveDate" name="goLiveDate" type="date" required />

    <label class="muted" for="summary">Summary*</label>
    <textarea id="summary" name="summary" rows="3"></textarea>

    <label class="muted" for="tags">Tags* (multi-select)</label>
    <select id="tags" name="tags" multiple size="6">
      ${tagOptions}
    </select>

    <label class="muted" for="reviewerNote">Reviewer Note (optional)</label>
    <input id="reviewerNote" name="reviewerNote" type="text" />
  `;
};

export const validateFixedFormDateMulti = (
  data: FixedFormDateMultiData,
  payload: Record<string, unknown>,
) => {
  const clientRef = readString(payload, 'clientRef').trim();
  const goLiveDate = readString(payload, 'goLiveDate').trim();
  const summary = normalizeText(readString(payload, 'summary'));
  const tags = normalizeList(readList(payload, 'tags'));

  if (clientRef !== data.required.clientRef) {
    return false;
  }

  if (goLiveDate !== data.required.goLiveDate) {
    return false;
  }

  if (summary !== normalizeText(data.required.summary)) {
    return false;
  }

  if (tags.join('|') !== normalizeList(data.required.tags).join('|')) {
    return false;
  }

  const reviewerNote = readString(payload, 'reviewerNote').trim();
  if (reviewerNote && reviewerNote !== data.optional.reviewerNote) {
    return false;
  }

  return true;
};
