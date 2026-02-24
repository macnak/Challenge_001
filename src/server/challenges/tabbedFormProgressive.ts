import type { ChallengeContext } from './types.js';
import { pick, randomInt, randomString } from './utils.js';

type TabbedFormProgressiveData = {
  required: {
    profileId: string;
    email: string;
    region: string;
  };
  optional: {
    note: string;
  };
  expectedTabOrder: string;
  regionOptions: string[];
};

const REGIONS = ['NA', 'EMEA', 'APAC', 'LATAM'];
const NOTE_OPTIONS = ['baseline pass', 'script rehearsal', 'dry run only', 'optional memo'];

export const generateTabbedFormProgressive = (
  context: ChallengeContext,
): TabbedFormProgressiveData => {
  const profileId = `PF-${randomInt(1000, 9999, context.rng)}`;
  const local = randomString(3, context.rng);
  const domain = pick(['client.example', 'training.example', 'internal.example'], context.rng);
  const email = `user.${local}@${domain}`.toLowerCase();

  return {
    required: {
      profileId,
      email,
      region: pick(REGIONS, context.rng),
    },
    optional: {
      note: pick(NOTE_OPTIONS, context.rng),
    },
    expectedTabOrder: 'profile>contact>confirm',
    regionOptions: REGIONS,
  };
};

export const renderTabbedFormProgressive = (
  context: ChallengeContext,
  data: TabbedFormProgressiveData,
) => {
  const regionOptions = data.regionOptions
    .map((region) => `<option value="${region}">${region}</option>`)
    .join('');

  return `
    <h1>Challenge ${context.index}: Tabbed Form (Progressive)</h1>
    <p class="muted">Complete required fields across tabs and submit the tab traversal order.</p>
    <ul class="muted">
      <li>Profile ID* (Profile tab): <strong>${data.required.profileId}</strong></li>
      <li>Email* (Contact tab): <strong>${data.required.email}</strong></li>
      <li>Region* (Confirm tab): <strong>${data.required.region}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
      <li>Expected tab order*: <strong>${data.expectedTabOrder}</strong></li>
    </ul>

    <div class="row" style="margin-bottom: 8px;">
      <button type="button" class="button" data-tab-target="profile">Profile</button>
      <button type="button" class="button" data-tab-target="contact">Contact</button>
      <button type="button" class="button" data-tab-target="confirm">Confirm</button>
    </div>

    <section data-tab-panel="profile" style="margin: 8px 0;">
      <h2 style="margin-bottom: 6px;">Profile</h2>
      <label class="muted" for="profileId">Profile ID*</label>
      <input id="profileId" name="profileId" type="text" required />
    </section>

    <section data-tab-panel="contact" style="margin: 8px 0;">
      <h2 style="margin-bottom: 6px;">Contact</h2>
      <label class="muted" for="email">Email*</label>
      <input id="email" name="email" type="text" required />

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

      <label class="muted" for="tabOrder">Tab order*</label>
      <input id="tabOrder" name="tabOrder" type="text" placeholder="profile>contact>confirm" required />
    </section>
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateTabbedFormProgressive = (
  data: TabbedFormProgressiveData,
  payload: Record<string, unknown>,
) => {
  const profileId = read(payload, 'profileId');
  const email = read(payload, 'email').toLowerCase();
  const region = read(payload, 'region');
  const tabOrder = read(payload, 'tabOrder').toLowerCase();

  if (
    profileId !== data.required.profileId ||
    email !== data.required.email.toLowerCase() ||
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

  return true;
};
