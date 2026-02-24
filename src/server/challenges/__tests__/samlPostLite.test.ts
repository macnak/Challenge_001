import { describe, expect, it } from 'vitest';
import { validateSamlPostLite } from '../samlPostLite.js';

const samlResponseB64 =
  'PFJlc3BvbnNlPjxBc3NlcnRpb24gTm90T25PckFmdGVyPSIyMDk5LTAxLTAxVDAwOjAwOjAwLjAwMFoiPjxOYW1lSUQ+dXNlci1hbHBoYUBleGFtcGxlLmNvbTwvTmFtZUlEPjxBdWRpZW5jZT51cm46ZXhhbXBsZTpzcDphbHBoYTwvQXVkaWVuY2U+PFJlY2lwaWVudD5odHRwczovL3NwLmV4YW1wbGUuY29tL2Fjcy9hYmM8L1JlY2lwaWVudD48L0Fzc2VydGlvbj48L1Jlc3BvbnNlPg==';

const baseData = {
  nameId: 'user-alpha@example.com',
  audience: 'urn:example:sp:alpha',
  recipient: 'https://sp.example.com/acs/abc',
  notOnOrAfter: '2099-01-01T00:00:00.000Z',
  samlResponseB64,
};

describe('saml post lite', () => {
  it('accepts valid decoded SAML response fields', () => {
    const result = validateSamlPostLite(baseData, {
      samlResponse: samlResponseB64,
      nameId: 'user-alpha@example.com',
      audience: 'urn:example:sp:alpha',
      recipient: 'https://sp.example.com/acs/abc',
      notOnOrAfter: '2099-01-01T00:00:00.000Z',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong audience', () => {
    const result = validateSamlPostLite(baseData, {
      samlResponse: samlResponseB64,
      nameId: 'user-alpha@example.com',
      audience: 'urn:example:sp:beta',
      recipient: 'https://sp.example.com/acs/abc',
      notOnOrAfter: '2099-01-01T00:00:00.000Z',
    });

    expect(result).toBe(false);
  });

  it('rejects expired NotOnOrAfter', () => {
    const expiredPayload = {
      ...baseData,
      notOnOrAfter: '2000-01-01T00:00:00.000Z',
    };

    const result = validateSamlPostLite(expiredPayload, {
      samlResponse:
        'PFJlc3BvbnNlPjxBc3NlcnRpb24gTm90T25PckFmdGVyPSIyMDAwLTAxLTAxVDAwOjAwOjAwLjAwMFoiPjxOYW1lSUQ+dXNlci1hbHBoYUBleGFtcGxlLmNvbTwvTmFtZUlEPjxBdWRpZW5jZT51cm46ZXhhbXBsZTpzcDphbHBoYTwvQXVkaWVuY2U+PFJlY2lwaWVudD5odHRwczovL3NwLmV4YW1wbGUuY29tL2Fjcy9hYmM8L1JlY2lwaWVudD48L0Fzc2VydGlvbj48L1Jlc3BvbnNlPg==',
      nameId: 'user-alpha@example.com',
      audience: 'urn:example:sp:alpha',
      recipient: 'https://sp.example.com/acs/abc',
      notOnOrAfter: '2000-01-01T00:00:00.000Z',
    });

    expect(result).toBe(false);
  });

  it('rejects malformed SAMLResponse encoding', () => {
    const result = validateSamlPostLite(baseData, {
      samlResponse: 'bad-base64-@',
      nameId: 'user-alpha@example.com',
      audience: 'urn:example:sp:alpha',
      recipient: 'https://sp.example.com/acs/abc',
      notOnOrAfter: '2099-01-01T00:00:00.000Z',
    });

    expect(result).toBe(false);
  });
});
