import { describe, expect, it } from 'vitest';
import { refreshPageTimeoutIdle, validatePageTimeoutIdle } from '../pageTimeoutIdle.js';

describe('page timeout idle', () => {
  it('accepts correct token within timeout window', () => {
    const now = Date.now();
    const result = validatePageTimeoutIdle(
      {
        token: 'TO-ABCDE12345',
        issuedAt: now - 500,
        idleTimeoutMs: 3000,
        refreshCount: 0,
      },
      { answer: 'TO-ABCDE12345' },
    );

    expect(result).toBe(true);
  });

  it('rejects correct token after timeout window', () => {
    const now = Date.now();
    const result = validatePageTimeoutIdle(
      {
        token: 'TO-ABCDE12345',
        issuedAt: now - 5000,
        idleTimeoutMs: 1000,
        refreshCount: 0,
      },
      { answer: 'TO-ABCDE12345' },
    );

    expect(result).toBe(false);
  });

  it('refresh helper rotates token and increments refresh count', () => {
    const original = {
      token: 'TO-OLDTOKEN',
      issuedAt: Date.now() - 10000,
      idleTimeoutMs: 9000,
      refreshCount: 1,
    };

    const refreshed = refreshPageTimeoutIdle(original);

    expect(refreshed.refreshCount).toBe(2);
    expect(refreshed.token).not.toBe(original.token);
    expect(refreshed.issuedAt).toBeGreaterThanOrEqual(original.issuedAt);
  });
});
