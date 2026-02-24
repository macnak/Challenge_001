import { describe, expect, it } from 'vitest';
import { validateTabbedFormConditional } from '../tabbedFormConditional.js';

const conditionalRequiredData = {
  required: {
    caseId: 'CASE-4821',
    contactEmail: 'agent.test@support.example',
    supportTier: 'priority',
    region: 'EMEA',
  },
  optional: {
    note: 'ops handoff',
    priorityCode: 'PR-712',
    complianceTag: 'CMP-6491',
  },
  conditions: {
    requirePriorityCode: true,
    requireComplianceTag: true,
  },
  expectedTabOrder: 'profile>routing>confirm',
  supportTierOptions: ['standard', 'priority'],
  regionOptions: ['NA', 'EMEA', 'APAC', 'LATAM'],
};

const conditionalOptionalData = {
  required: {
    caseId: 'CASE-5033',
    contactEmail: 'agent.alpha@support.example',
    supportTier: 'standard',
    region: 'APAC',
  },
  optional: {
    note: 'training run',
    priorityCode: 'PR-333',
    complianceTag: 'CMP-1701',
  },
  conditions: {
    requirePriorityCode: false,
    requireComplianceTag: false,
  },
  expectedTabOrder: 'profile>routing>confirm',
  supportTierOptions: ['standard', 'priority'],
  regionOptions: ['NA', 'EMEA', 'APAC', 'LATAM'],
};

describe('tabbed form conditional', () => {
  it('accepts when promoted fields are present and valid', () => {
    const result = validateTabbedFormConditional(conditionalRequiredData, {
      caseId: 'CASE-4821',
      contactEmail: 'agent.test@support.example',
      supportTier: 'priority',
      region: 'EMEA',
      priorityCode: 'PR-712',
      complianceTag: 'CMP-6491',
      tabOrder: 'profile>routing>confirm',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects missing promoted priority code', () => {
    const result = validateTabbedFormConditional(conditionalRequiredData, {
      caseId: 'CASE-4821',
      contactEmail: 'agent.test@support.example',
      supportTier: 'priority',
      region: 'EMEA',
      complianceTag: 'CMP-6491',
      tabOrder: 'profile>routing>confirm',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong tab order', () => {
    const result = validateTabbedFormConditional(conditionalRequiredData, {
      caseId: 'CASE-4821',
      contactEmail: 'agent.test@support.example',
      supportTier: 'priority',
      region: 'EMEA',
      priorityCode: 'PR-712',
      complianceTag: 'CMP-6491',
      tabOrder: 'routing>profile>confirm',
    });

    expect(result).toBe(false);
  });

  it('accepts when conditional fields are not required and left blank', () => {
    const result = validateTabbedFormConditional(conditionalOptionalData, {
      caseId: 'CASE-5033',
      contactEmail: 'agent.alpha@support.example',
      supportTier: 'standard',
      region: 'APAC',
      priorityCode: '',
      complianceTag: '',
      tabOrder: 'profile>routing>confirm',
      note: 'training run',
    });

    expect(result).toBe(true);
  });

  it('rejects invalid optional note when provided', () => {
    const result = validateTabbedFormConditional(conditionalOptionalData, {
      caseId: 'CASE-5033',
      contactEmail: 'agent.alpha@support.example',
      supportTier: 'standard',
      region: 'APAC',
      tabOrder: 'profile>routing>confirm',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
