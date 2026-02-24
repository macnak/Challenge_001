import { describe, expect, it } from 'vitest';
import { validateRedirectTokenPickupBasic } from '../redirectTokenPickupBasic.js';

describe('redirect token pickup basic', () => {
  it('rejects submission before pickup confirmation', () => {
    const result = validateRedirectTokenPickupBasic(
      {
        token: 'RT-ABC12345',
        hopToken: 'aa11bb22',
        pickupConfirmed: false,
      },
      { answer: 'RT-ABC12345' },
    );

    expect(result).toBe(false);
  });

  it('accepts correct answer after pickup confirmation', () => {
    const result = validateRedirectTokenPickupBasic(
      {
        token: 'RT-ABC12345',
        hopToken: 'aa11bb22',
        pickupConfirmed: true,
      },
      { answer: 'RT-ABC12345' },
    );

    expect(result).toBe(true);
  });

  it('rejects wrong token even after pickup confirmation', () => {
    const result = validateRedirectTokenPickupBasic(
      {
        token: 'RT-ABC12345',
        hopToken: 'aa11bb22',
        pickupConfirmed: true,
      },
      { answer: 'RT-WRONG000' },
    );

    expect(result).toBe(false);
  });
});
