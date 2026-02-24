import { describe, expect, it } from 'vitest';
import { validateTabbedFormProgressive } from '../tabbedFormProgressive.js';

const baseData = {
  required: {
    profileId: 'PF-4821',
    email: 'user.xyz@client.example',
    region: 'EMEA',
  },
  optional: {
    note: 'baseline pass',
  },
  expectedTabOrder: 'profile>contact>confirm',
  regionOptions: ['NA', 'EMEA', 'APAC', 'LATAM'],
};

describe('tabbed form progressive', () => {
  it('accepts valid required fields and correct tab order', () => {
    const result = validateTabbedFormProgressive(baseData, {
      profileId: 'PF-4821',
      email: 'user.xyz@client.example',
      region: 'EMEA',
      tabOrder: 'profile>contact>confirm',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong tab order', () => {
    const result = validateTabbedFormProgressive(baseData, {
      profileId: 'PF-4821',
      email: 'user.xyz@client.example',
      region: 'EMEA',
      tabOrder: 'contact>profile>confirm',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong required region value', () => {
    const result = validateTabbedFormProgressive(baseData, {
      profileId: 'PF-4821',
      email: 'user.xyz@client.example',
      region: 'NA',
      tabOrder: 'profile>contact>confirm',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note when provided', () => {
    const result = validateTabbedFormProgressive(baseData, {
      profileId: 'PF-4821',
      email: 'user.xyz@client.example',
      region: 'EMEA',
      tabOrder: 'profile>contact>confirm',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
