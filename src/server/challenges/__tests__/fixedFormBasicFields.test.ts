import { describe, expect, it } from 'vitest';
import { validateFixedFormBasicFields } from '../fixedFormBasicFields.js';

const baseData = {
  required: {
    firstName: 'Ava',
    lastName: 'Rivera',
    email: 'ava.rivera.abc@client.example',
    employeeId: 'EMP-4821',
  },
  optional: {
    department: 'Engineering',
    nickname: 'AV-XYZ',
  },
};

describe('fixed form basic fields', () => {
  it('accepts valid required fields with optional fields omitted', () => {
    const result = validateFixedFormBasicFields(baseData, {
      firstName: 'Ava',
      lastName: 'Rivera',
      email: 'ava.rivera.abc@client.example',
      employeeId: 'EMP-4821',
      department: '',
      nickname: '',
    });

    expect(result).toBe(true);
  });

  it('accepts valid optional fields when provided', () => {
    const result = validateFixedFormBasicFields(baseData, {
      firstName: 'Ava',
      lastName: 'Rivera',
      email: 'ava.rivera.abc@client.example',
      employeeId: 'EMP-4821',
      department: 'Engineering',
      nickname: 'AV-XYZ',
    });

    expect(result).toBe(true);
  });

  it('rejects when required value is incorrect', () => {
    const result = validateFixedFormBasicFields(baseData, {
      firstName: 'Ava',
      lastName: 'Rivera',
      email: 'ava.rivera.abc@client.example',
      employeeId: 'EMP-9999',
    });

    expect(result).toBe(false);
  });

  it('rejects when optional value is provided but incorrect', () => {
    const result = validateFixedFormBasicFields(baseData, {
      firstName: 'Ava',
      lastName: 'Rivera',
      email: 'ava.rivera.abc@client.example',
      employeeId: 'EMP-4821',
      department: 'Finance',
    });

    expect(result).toBe(false);
  });

  it('normalizes email case when validating', () => {
    const result = validateFixedFormBasicFields(baseData, {
      firstName: 'Ava',
      lastName: 'Rivera',
      email: 'AVA.RIVERA.ABC@CLIENT.EXAMPLE',
      employeeId: 'EMP-4821',
    });

    expect(result).toBe(true);
  });
});
