import { describe, expect, it } from 'vitest';
import { validateAuthHeaderSwitch } from '../authHeaderSwitch.js';

const baseData = {
  required: {
    username: 'auth_a1b2c3',
    correlationId: 'COR-ABC123',
    headerName: 'X-Correlation-Auth',
    headerValue: 'COR-ABC123.AT-9F01A',
    rule: 'correlation-bound' as const,
  },
  optional: {
    note: 'header source shifts by session rule',
  },
};

describe('auth header switch', () => {
  it('accepts valid dynamic header submission', () => {
    const result = validateAuthHeaderSwitch(baseData, {
      username: 'auth_a1b2c3',
      headerName: 'x-correlation-auth',
      headerValue: 'COR-ABC123.AT-9F01A',
      correlationId: 'COR-ABC123',
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong header name', () => {
    const result = validateAuthHeaderSwitch(baseData, {
      username: 'auth_a1b2c3',
      headerName: 'X-Nonce-Auth',
      headerValue: 'COR-ABC123.AT-9F01A',
      correlationId: 'COR-ABC123',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong header value', () => {
    const result = validateAuthHeaderSwitch(baseData, {
      username: 'auth_a1b2c3',
      headerName: 'X-Correlation-Auth',
      headerValue: 'COR-ABC123.AT-WRONG',
      correlationId: 'COR-ABC123',
    });

    expect(result).toBe(false);
  });

  it('rejects invalid optional note', () => {
    const result = validateAuthHeaderSwitch(baseData, {
      username: 'auth_a1b2c3',
      headerName: 'X-Correlation-Auth',
      headerValue: 'COR-ABC123.AT-9F01A',
      correlationId: 'COR-ABC123',
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
