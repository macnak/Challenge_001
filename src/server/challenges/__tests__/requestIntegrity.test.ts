import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { validateRequestIntegrity } from '../requestIntegrity.js';

describe('request integrity', () => {
  it('validates correct hmac', () => {
    const secret = 'secret-key';
    const nonce = 'nonce123';
    const hmac = crypto.createHmac('sha256', secret).update(nonce).digest('hex');
    const result = validateRequestIntegrity({ secret, nonce }, { answer: hmac });
    expect(result).toBe(true);
  });

  it('rejects incorrect hmac', () => {
    const result = validateRequestIntegrity(
      { secret: 'secret', nonce: 'nonce' },
      { answer: 'bad' },
    );
    expect(result).toBe(false);
  });
});
