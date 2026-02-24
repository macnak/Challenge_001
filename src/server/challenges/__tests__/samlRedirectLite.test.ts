import { describe, expect, it } from 'vitest';
import { validateSamlRedirectLite } from '../samlRedirectLite.js';

const samlRequestB64 =
  'PEF1dGhuUmVxdWVzdCBJblJlc3BvbnNlVG89IlJFUS1BQkMxMjMiPjxJc3N1ZXI+dXJuOmV4YW1wbGU6aWRwOmFscGhhPC9Jc3N1ZXI+PC9BdXRoblJlcXVlc3Q+';

const baseData = {
  relayState: 'RS-ABCD',
  inResponseTo: 'REQ-ABC123',
  issuer: 'urn:example:idp:alpha',
  samlRequestB64,
};

describe('saml redirect lite', () => {
  it('accepts valid relay state and decoded SAML values', () => {
    const result = validateSamlRedirectLite(baseData, {
      relayState: 'RS-ABCD',
      samlRequest: samlRequestB64,
      inResponseTo: 'REQ-ABC123',
      issuer: 'urn:example:idp:alpha',
    });

    expect(result).toBe(true);
  });

  it('rejects wrong relay state', () => {
    const result = validateSamlRedirectLite(baseData, {
      relayState: 'RS-XXXX',
      samlRequest: samlRequestB64,
      inResponseTo: 'REQ-ABC123',
      issuer: 'urn:example:idp:alpha',
    });

    expect(result).toBe(false);
  });

  it('rejects wrong issuer', () => {
    const result = validateSamlRedirectLite(baseData, {
      relayState: 'RS-ABCD',
      samlRequest: samlRequestB64,
      inResponseTo: 'REQ-ABC123',
      issuer: 'urn:example:idp:beta',
    });

    expect(result).toBe(false);
  });

  it('rejects malformed SAMLRequest encoding', () => {
    const result = validateSamlRedirectLite(baseData, {
      relayState: 'RS-ABCD',
      samlRequest: 'not-base64-@',
      inResponseTo: 'REQ-ABC123',
      issuer: 'urn:example:idp:alpha',
    });

    expect(result).toBe(false);
  });
});
