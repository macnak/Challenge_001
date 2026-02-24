import type { ChallengeContext } from './types.js';
import { pick, randomInt } from './utils.js';

type FixedFormSelectRadioData = {
  required: {
    clientCode: string;
    region: string;
    authMode: string;
  };
  optional: {
    note: string;
  };
  options: {
    regions: string[];
    authModes: string[];
  };
};

const REGION_OPTIONS = ['NA', 'EMEA', 'APAC', 'LATAM'];
const AUTH_OPTIONS = ['jwt', 'basic', 'none', 'user-pass'];
const NOTE_OPTIONS = [
  'priority onboarding',
  'performance baseline run',
  'new tenant rehearsal',
  'regional smoke test',
];

export const generateFixedFormSelectRadio = (
  context: ChallengeContext,
): FixedFormSelectRadioData => {
  return {
    required: {
      clientCode: `CL-${randomInt(100, 999, context.rng)}`,
      region: pick(REGION_OPTIONS, context.rng),
      authMode: pick(AUTH_OPTIONS, context.rng),
    },
    optional: {
      note: pick(NOTE_OPTIONS, context.rng),
    },
    options: {
      regions: REGION_OPTIONS,
      authModes: AUTH_OPTIONS,
    },
  };
};

export const renderFixedFormSelectRadio = (
  context: ChallengeContext,
  data: FixedFormSelectRadioData,
) => {
  const regionSelect = data.options.regions
    .map((option) => `<option value="${option}">${option}</option>`)
    .join('');

  const authControls = data.options.authModes
    .map(
      (mode) => `
        <label style="display:block; margin: 6px 0;">
          <input type="radio" name="authMode" value="${mode}" /> ${mode}
        </label>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Fixed Form (Select + Radio)</h1>
    <p class="muted">Fill mandatory values exactly. Optional note may be blank or match the provided value.</p>
    <ul class="muted">
      <li>Client Code*: <strong>${data.required.clientCode}</strong></li>
      <li>Region*: <strong>${data.required.region}</strong></li>
      <li>Auth Mode*: <strong>${data.required.authMode}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="clientCode">Client Code*</label>
    <input id="clientCode" name="clientCode" type="text" required />

    <label class="muted" for="region">Region*</label>
    <select id="region" name="region" required>
      <option value="">-- Select region --</option>
      ${regionSelect}
    </select>

    <p class="muted" style="margin-bottom: 4px;">Auth Mode*</p>
    ${authControls}

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

const readValue = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateFixedFormSelectRadio = (
  data: FixedFormSelectRadioData,
  payload: Record<string, unknown>,
) => {
  const clientCode = readValue(payload, 'clientCode');
  const region = readValue(payload, 'region');
  const authMode = readValue(payload, 'authMode');

  if (
    clientCode !== data.required.clientCode ||
    region !== data.required.region ||
    authMode !== data.required.authMode
  ) {
    return false;
  }

  const note = readValue(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
