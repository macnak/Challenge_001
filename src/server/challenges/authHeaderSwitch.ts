import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type HeaderRule = 'user-bound' | 'correlation-bound' | 'nonce-derived';

type AuthHeaderSwitchData = {
  required: {
    username: string;
    correlationId: string;
    headerName: string;
    headerValue: string;
    rule: HeaderRule;
  };
  optional: {
    note: string;
  };
};

const RULE_OPTIONS: HeaderRule[] = ['user-bound', 'correlation-bound', 'nonce-derived'];

const NOTE_OPTIONS = [
  'header source shifts by session rule',
  'derive auth header from active mode',
  'capture current header strategy',
];

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

const buildHeader = (
  rule: HeaderRule,
  username: string,
  correlationId: string,
  seedToken: string,
) => {
  if (rule === 'user-bound') {
    return {
      headerName: 'X-User-Auth',
      headerValue: `${username}:${seedToken}`,
    };
  }

  if (rule === 'correlation-bound') {
    return {
      headerName: 'X-Correlation-Auth',
      headerValue: `${correlationId}.${seedToken}`,
    };
  }

  return {
    headerName: 'X-Nonce-Auth',
    headerValue: `${seedToken}-${correlationId.slice(-4)}`,
  };
};

export const generateAuthHeaderSwitch = (context: ChallengeContext): AuthHeaderSwitchData => {
  const username = `auth_${randomHex(3, context.rng).toLowerCase()}`;
  const correlationId = `COR-${randomHex(6, context.rng).toUpperCase()}`;
  const seedToken = `AT-${randomHex(5, context.rng).toUpperCase()}`;
  const rule = RULE_OPTIONS[randomInt(0, RULE_OPTIONS.length - 1, context.rng)];
  const { headerName, headerValue } = buildHeader(rule, username, correlationId, seedToken);

  return {
    required: {
      username,
      correlationId,
      headerName,
      headerValue,
      rule,
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderAuthHeaderSwitch = (context: ChallengeContext, data: AuthHeaderSwitchData) => {
  return `
    <h1>Challenge ${context.index}: Auth Header Switch</h1>
    <p class="muted">Header source strategy changes by session. Submit values for the active rule.</p>
    <ul class="muted">
      <li>Username*: <strong>${data.required.username}</strong></li>
      <li>Rule*: <strong>${data.required.rule}</strong></li>
      <li>Header name*: <strong>${data.required.headerName}</strong></li>
      <li>Header value*: <strong>${data.required.headerValue}</strong></li>
      <li>Correlation ID*: <strong>${data.required.correlationId}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="headerName">Header name*</label>
    <input id="headerName" name="headerName" type="text" required />

    <label class="muted" for="headerValue">Header value*</label>
    <input id="headerValue" name="headerValue" type="text" required />

    <label class="muted" for="correlationId">Correlation ID*</label>
    <input id="correlationId" name="correlationId" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateAuthHeaderSwitch = (
  data: AuthHeaderSwitchData,
  payload: Record<string, unknown>,
) => {
  const username = read(payload, 'username');
  const headerName = read(payload, 'headerName').toLowerCase();
  const headerValue = read(payload, 'headerValue');
  const correlationId = read(payload, 'correlationId');

  if (username !== data.required.username) {
    return false;
  }

  if (headerName !== data.required.headerName.toLowerCase()) {
    return false;
  }

  if (headerValue !== data.required.headerValue) {
    return false;
  }

  if (correlationId !== data.required.correlationId) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
