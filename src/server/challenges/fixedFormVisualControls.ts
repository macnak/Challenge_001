import type { ChallengeContext } from './types.js';
import { pick, randomInt } from './utils.js';

type FixedFormVisualControlsData = {
  required: {
    clientRef: string;
    trustScore: number;
    alertsEnabled: boolean;
    accessProfile: string;
  };
  options: {
    accessProfiles: string[];
  };
  optional: {
    note: string;
  };
};

const ACCESS_PROFILES = ['viewer', 'operator', 'admin', 'auditor'];
const NOTE_OPTIONS = [
  'visual-control baseline',
  'access profile rehearsal',
  'slider/toggle verification',
  'manual control check',
];

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

const parseBoolean = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return ['true', '1', 'yes', 'on'].includes(normalized);
};

export const generateFixedFormVisualControls = (
  context: ChallengeContext,
): FixedFormVisualControlsData => {
  return {
    required: {
      clientRef: `VC-${randomInt(1000, 9999, context.rng)}`,
      trustScore: randomInt(10, 95, context.rng),
      alertsEnabled: randomInt(0, 1, context.rng) === 1,
      accessProfile: pick(ACCESS_PROFILES, context.rng),
    },
    options: {
      accessProfiles: ACCESS_PROFILES,
    },
    optional: {
      note: pick(NOTE_OPTIONS, context.rng),
    },
  };
};

export const renderFixedFormVisualControls = (
  context: ChallengeContext,
  data: FixedFormVisualControlsData,
) => {
  const accessProfiles = data.options.accessProfiles
    .map((profile) => `<option value="${profile}">${profile}</option>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Fixed Form (Visual Controls)</h1>
    <p class="muted">Submit exact values using mixed visual controls.</p>
    <ul class="muted">
      <li>Client Ref*: <strong>${data.required.clientRef}</strong></li>
      <li>Trust Score* (slider): <strong>${data.required.trustScore}</strong></li>
      <li>Alerts Enabled* (toggle): <strong>${data.required.alertsEnabled ? 'true' : 'false'}</strong></li>
      <li>Access Profile* (combobox/select): <strong>${data.required.accessProfile}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="clientRef">Client Ref*</label>
    <input id="clientRef" name="clientRef" type="text" required />

    <label class="muted" for="trustScore">Trust Score*</label>
    <input id="trustScore" name="trustScore" type="range" min="0" max="100" />

    <label class="muted" for="alertsEnabled">Alerts Enabled*</label>
    <input id="alertsEnabled" name="alertsEnabled" type="checkbox" />

    <label class="muted" for="accessProfile">Access Profile*</label>
    <select id="accessProfile" name="accessProfile" required>
      <option value="">-- Select profile --</option>
      ${accessProfiles}
    </select>

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />
  `;
};

export const validateFixedFormVisualControls = (
  data: FixedFormVisualControlsData,
  payload: Record<string, unknown>,
) => {
  const clientRef = read(payload, 'clientRef');
  const trustScoreRaw = read(payload, 'trustScore');
  const accessProfile = read(payload, 'accessProfile');
  const alertsRaw = read(payload, 'alertsEnabled');

  if (clientRef !== data.required.clientRef) {
    return false;
  }

  const trustScore = Number.parseInt(trustScoreRaw, 10);
  if (!Number.isFinite(trustScore) || trustScore !== data.required.trustScore) {
    return false;
  }

  if (accessProfile !== data.required.accessProfile) {
    return false;
  }

  const alertsEnabled = parseBoolean(alertsRaw);
  if (alertsEnabled !== data.required.alertsEnabled) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
