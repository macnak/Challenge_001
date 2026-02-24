import { describe, expect, it } from 'vitest';
import { validateFormPreSubmitEncoding } from '../formPreSubmitEncoding.js';

const buildRaw = (accountId: string, regionCode: string, passphrase: string, nonce: string) =>
  `${accountId}|${regionCode}|${passphrase.toLowerCase()}|${nonce}`;

const encodePayload = (
  accountId: string,
  regionCode: string,
  passphrase: string,
  nonce: string,
  mode: 'base64' | 'reverse-base64' | 'base64url' = 'base64',
) => {
  const raw = buildRaw(accountId, regionCode, passphrase, nonce);
  if (mode === 'reverse-base64') {
    return Buffer.from(raw.split('').reverse().join(''), 'utf8').toString('base64');
  }

  if (mode === 'base64url') {
    return Buffer.from(raw, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  return Buffer.from(raw, 'utf8').toString('base64');
};

const baseData = {
  required: {
    accountId: 'acct-ABC123',
    regionCode: 'EMEA',
    passphrase: 'pw-Token77',
    nonce: 'N-44AA11BB',
    encodingMode: 'base64' as const,
    encodingRule: 'base64(accountId|regionCode|lower(passphrase)|nonce)',
    encodedPayload: encodePayload('acct-ABC123', 'EMEA', 'pw-Token77', 'N-44AA11BB', 'base64'),
  },
  optional: {
    note: 'submit triggers pre-encoding script',
  },
};

describe('form pre-submit encoding', () => {
  it('accepts valid encoded payload chain', () => {
    const result = validateFormPreSubmitEncoding(baseData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: encodePayload('acct-ABC123', 'EMEA', 'pw-Token77', 'N-44AA11BB', 'base64'),
      note: '',
    });

    expect(result).toBe(true);
  });

  it('rejects missing encoded payload', () => {
    const result = validateFormPreSubmitEncoding(baseData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: '',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong encoded payload content', () => {
    const result = validateFormPreSubmitEncoding(baseData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: Buffer.from('acct-ABC123|EMEA|pw-wrong|N-44AA11BB', 'utf8').toString(
        'base64',
      ),
    });

    expect(result).toBe(false);
  });

  it('accepts reverse-base64 mode payload', () => {
    const reverseData = {
      ...baseData,
      required: {
        ...baseData.required,
        encodingMode: 'reverse-base64' as const,
        encodingRule: 'base64(reverse(accountId|regionCode|lower(passphrase)|nonce))',
        encodedPayload: encodePayload(
          'acct-ABC123',
          'EMEA',
          'pw-Token77',
          'N-44AA11BB',
          'reverse-base64',
        ),
      },
    };

    const result = validateFormPreSubmitEncoding(reverseData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: encodePayload(
        'acct-ABC123',
        'EMEA',
        'pw-Token77',
        'N-44AA11BB',
        'reverse-base64',
      ),
    });

    expect(result).toBe(true);
  });

  it('accepts base64url mode payload', () => {
    const urlData = {
      ...baseData,
      required: {
        ...baseData.required,
        encodingMode: 'base64url' as const,
        encodingRule: 'base64url(accountId|regionCode|lower(passphrase)|nonce)',
        encodedPayload: encodePayload(
          'acct-ABC123',
          'EMEA',
          'pw-Token77',
          'N-44AA11BB',
          'base64url',
        ),
      },
    };

    const result = validateFormPreSubmitEncoding(urlData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: encodePayload('acct-ABC123', 'EMEA', 'pw-Token77', 'N-44AA11BB', 'base64url'),
    });

    expect(result).toBe(true);
  });

  it('rejects invalid optional note', () => {
    const result = validateFormPreSubmitEncoding(baseData, {
      accountId: 'acct-ABC123',
      regionCode: 'EMEA',
      passphrase: 'pw-Token77',
      nonce: 'N-44AA11BB',
      encodedPayload: encodePayload('acct-ABC123', 'EMEA', 'pw-Token77', 'N-44AA11BB', 'base64'),
      note: 'unexpected',
    });

    expect(result).toBe(false);
  });
});
