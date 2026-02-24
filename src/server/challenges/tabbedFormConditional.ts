import type { ChallengeContext } from './types.js';
import { pick, randomInt, randomString } from './utils.js';

type TabbedFormConditionalData = {
  required: {
    caseId: string;
    contactEmail: string;
    supportTier: string;
    region: string;
  };
  optional: {
    note: string;
    priorityCode: string;
    complianceTag: string;
  };
  conditions: {
    requirePriorityCode: boolean;
    requireComplianceTag: boolean;
  };
  expectedTabOrder: string;
  supportTierOptions: string[];
  regionOptions: string[];
};

const SUPPORT_TIERS = ['standard', 'priority'];
const REGIONS = ['NA', 'EMEA', 'APAC', 'LATAM'];
const NOTE_OPTIONS = ['triage only', 'ops handoff', 'training run', 'audit sample'];

export const generateTabbedFormConditional = (
  context: ChallengeContext,
): TabbedFormConditionalData => {
  const supportTier = pick(SUPPORT_TIERS, context.rng);
  const region = pick(REGIONS, context.rng);
  const local = randomString(4, context.rng);

  return {
    required: {
      caseId: `CASE-${randomInt(1000, 9999, context.rng)}`,
      contactEmail: `agent.${local}@support.example`.toLowerCase(),
      supportTier,
      region,
    },
    optional: {
      note: pick(NOTE_OPTIONS, context.rng),
      priorityCode: `PR-${randomInt(100, 999, context.rng)}`,
      complianceTag: `CMP-${randomInt(1000, 9999, context.rng)}`,
    },
    conditions: {
      requirePriorityCode: supportTier === 'priority',
      requireComplianceTag: region === 'EMEA',
    },
    expectedTabOrder: 'profile>routing>confirm',
    supportTierOptions: SUPPORT_TIERS,
    regionOptions: REGIONS,
  };
};

export const renderTabbedFormConditional = (
  context: ChallengeContext,
  data: TabbedFormConditionalData,
) => {
  const supportTierOptions = data.supportTierOptions
    .map((value) => `<option value="${value}">${value}</option>`)
    .join('');

  const regionOptions = data.regionOptions
    .map((value) => `<option value="${value}">${value}</option>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Tabbed Form (Conditional)</h1>
    <p class="muted">Complete required fields and apply conditional required rules driven by prior choices.</p>
    <ul class="muted">
      <li>Case ID* (Profile): <strong>${data.required.caseId}</strong></li>
      <li>Support Tier* (Profile): <strong>${data.required.supportTier}</strong></li>
      <li>Contact Email* (Routing): <strong>${data.required.contactEmail}</strong></li>
      <li>Region* (Confirm): <strong>${data.required.region}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
      <li>Priority Code: <strong>${data.optional.priorityCode}</strong> (required only when Support Tier is priority)</li>
      <li>Compliance Tag: <strong>${data.optional.complianceTag}</strong> (required only when Region is EMEA)</li>
      <li>Expected tab order*: <strong>${data.expectedTabOrder}</strong></li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-tab-target="profile">Profile</button>
      <button type="button" class="button" data-tab-target="routing">Routing</button>
      <button type="button" class="button" data-tab-target="confirm">Confirm</button>
    </div>

    <section data-tab-panel="profile" style="margin: 8px 0;">
      <h2 style="margin-bottom: 6px;">Profile</h2>
      <label class="muted" for="caseId">Case ID*</label>
      <input id="caseId" name="caseId" type="text" required />

      <label class="muted" for="supportTier">Support Tier*</label>
      <select id="supportTier" name="supportTier" required>
        <option value="">-- Select support tier --</option>
        ${supportTierOptions}
      </select>
    </section>

    <section data-tab-panel="routing" style="margin: 8px 0;">
      <h2 style="margin-bottom: 6px;">Routing</h2>
      <label class="muted" for="contactEmail">Contact Email*</label>
      <input id="contactEmail" name="contactEmail" type="text" required />

      <label class="muted" for="priorityCode">Priority Code (conditional)</label>
      <input id="priorityCode" name="priorityCode" type="text" />

      <label class="muted" for="note">Note (optional)</label>
      <input id="note" name="note" type="text" />
    </section>

    <section data-tab-panel="confirm" style="margin: 8px 0;">
      <h2 style="margin-bottom: 6px;">Confirm</h2>
      <label class="muted" for="region">Region*</label>
      <select id="region" name="region" required>
        <option value="">-- Select region --</option>
        ${regionOptions}
      </select>

      <label class="muted" for="complianceTag">Compliance Tag (conditional)</label>
      <input id="complianceTag" name="complianceTag" type="text" />

      <label class="muted" for="tabOrder">Tab order*</label>
      <input id="tabOrder" name="tabOrder" type="text" placeholder="profile>routing>confirm" required />
    </section>
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateTabbedFormConditional = (
  data: TabbedFormConditionalData,
  payload: Record<string, unknown>,
) => {
  const caseId = read(payload, 'caseId');
  const contactEmail = read(payload, 'contactEmail').toLowerCase();
  const supportTier = read(payload, 'supportTier');
  const region = read(payload, 'region');
  const tabOrder = read(payload, 'tabOrder').toLowerCase();

  if (
    caseId !== data.required.caseId ||
    contactEmail !== data.required.contactEmail.toLowerCase() ||
    supportTier !== data.required.supportTier ||
    region !== data.required.region
  ) {
    return false;
  }

  if (tabOrder !== data.expectedTabOrder) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  const priorityCode = read(payload, 'priorityCode');
  if (data.conditions.requirePriorityCode && priorityCode !== data.optional.priorityCode) {
    return false;
  }
  if (
    !data.conditions.requirePriorityCode &&
    priorityCode &&
    priorityCode !== data.optional.priorityCode
  ) {
    return false;
  }

  const complianceTag = read(payload, 'complianceTag');
  if (data.conditions.requireComplianceTag && complianceTag !== data.optional.complianceTag) {
    return false;
  }
  if (
    !data.conditions.requireComplianceTag &&
    complianceTag &&
    complianceTag !== data.optional.complianceTag
  ) {
    return false;
  }

  return true;
};
