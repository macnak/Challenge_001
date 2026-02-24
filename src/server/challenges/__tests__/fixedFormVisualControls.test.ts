import { describe, expect, it } from 'vitest';
import { validateFixedFormVisualControls } from '../fixedFormVisualControls.js';

const dataAlertsOn = {
  required: {
    clientRef: 'VC-4821',
    trustScore: 77,
    alertsEnabled: true,
    accessProfile: 'operator',
  },
  options: {
    accessProfiles: ['viewer', 'operator', 'admin', 'auditor'],
  },
  optional: {
    note: 'visual-control baseline',
  },
};

const dataAlertsOff = {
  required: {
    clientRef: 'VC-5033',
    trustScore: 41,
    alertsEnabled: false,
    accessProfile: 'auditor',
  },
  options: {
    accessProfiles: ['viewer', 'operator', 'admin', 'auditor'],
  },
  optional: {
    note: 'manual control check',
  },
};

describe('fixed form visual controls', () => {
  it('accepts valid values for slider/toggle/select', () => {
    const result = validateFixedFormVisualControls(dataAlertsOn, {
      clientRef: 'VC-4821',
      trustScore: '77',
      alertsEnabled: 'on',
      accessProfile: 'operator',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong trust score slider value', () => {
    const result = validateFixedFormVisualControls(dataAlertsOn, {
      clientRef: 'VC-4821',
      trustScore: '70',
      alertsEnabled: 'on',
      accessProfile: 'operator',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong toggle state when alerts should be false', () => {
    const result = validateFixedFormVisualControls(dataAlertsOff, {
      clientRef: 'VC-5033',
      trustScore: '41',
      alertsEnabled: 'on',
      accessProfile: 'auditor',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note value', () => {
    const result = validateFixedFormVisualControls(dataAlertsOff, {
      clientRef: 'VC-5033',
      trustScore: '41',
      alertsEnabled: '',
      accessProfile: 'auditor',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
