import { describe, expect, it, vi } from 'vitest';
import { validateTimingWindow } from '../timingWindow.js';

describe('timing window', () => {
  it('accepts READY within window', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now + 5000);

    const result = validateTimingWindow(
      { createdAt: now, minDelayMs: 2000, maxDelayMs: 8000 },
      { answer: 'READY' },
    );

    expect(result).toBe(true);
    vi.restoreAllMocks();
  });

  it('rejects outside window', () => {
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now + 10000);

    const result = validateTimingWindow(
      { createdAt: now, minDelayMs: 2000, maxDelayMs: 8000 },
      { answer: 'READY' },
    );

    expect(result).toBe(false);
    vi.restoreAllMocks();
  });
});
