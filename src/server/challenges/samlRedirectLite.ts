import type { ChallengeContext } from './types.js';
import { randomHex, randomString } from './utils.js';

type SamlRedirectLiteData = {
  relayState: string;
  inResponseTo: string;
  issuer: string;
  samlRequestB64: string;
};

const normalizeB64 = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  const padding = normalized.length % 4;
  if (padding === 0) {
    return normalized;
  }
  return normalized + '='.repeat(4 - padding);
};

const decodeB64 = (value: string) => {
  try {
    return Buffer.from(normalizeB64(value), 'base64').toString('utf8');
  } catch {
    return '';
  }
};

const extractTag = (xml: string, tagName: string) => {
  const regex = new RegExp(`<${tagName}>([^<]+)</${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
};

const extractAttr = (xml: string, attrName: string) => {
  const regex = new RegExp(`${attrName}="([^"]+)"`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
};

export const generateSamlRedirectLite = (_context: ChallengeContext): SamlRedirectLiteData => {
  const relayState = `RS-${randomHex(4).toUpperCase()}`;
  const inResponseTo = `REQ-${randomHex(6).toUpperCase()}`;
  const issuer = `urn:example:idp:${randomString(6).toLowerCase()}`;

  const requestXml = `<AuthnRequest InResponseTo="${inResponseTo}"><Issuer>${issuer}</Issuer></AuthnRequest>`;

  return {
    relayState,
    inResponseTo,
    issuer,
    samlRequestB64: Buffer.from(requestXml, 'utf8').toString('base64'),
  };
};

export const renderSamlRedirectLite = (context: ChallengeContext, data: SamlRedirectLiteData) => {
  return `
    <h1>Challenge ${context.index}: SAML Redirect Lite</h1>
    <p class="muted">Use simplified SAML redirect semantics and validate required correlation fields.</p>
    <ul class="muted">
      <li>RelayState*: <strong>${data.relayState}</strong></li>
      <li>Encoded SAMLRequest*: <strong>${data.samlRequestB64}</strong></li>
      <li>Extract and submit expected <strong>InResponseTo</strong> and <strong>Issuer</strong>.</li>
    </ul>

    <label class="muted" for="relayState">RelayState*</label>
    <input id="relayState" name="relayState" type="text" required />

    <label class="muted" for="samlRequest">SAMLRequest (base64)*</label>
    <input id="samlRequest" name="samlRequest" type="text" required />

    <label class="muted" for="inResponseTo">InResponseTo*</label>
    <input id="inResponseTo" name="inResponseTo" type="text" required />

    <label class="muted" for="issuer">Issuer*</label>
    <input id="issuer" name="issuer" type="text" required />
  `;
};

export const validateSamlRedirectLite = (
  data: SamlRedirectLiteData,
  payload: Record<string, unknown>,
) => {
  const relayState = typeof payload.relayState === 'string' ? payload.relayState.trim() : '';
  const samlRequest = typeof payload.samlRequest === 'string' ? payload.samlRequest.trim() : '';
  const inResponseTo = typeof payload.inResponseTo === 'string' ? payload.inResponseTo.trim() : '';
  const issuer = typeof payload.issuer === 'string' ? payload.issuer.trim() : '';

  if (!relayState || !samlRequest || !inResponseTo || !issuer) {
    return false;
  }

  if (relayState !== data.relayState) {
    return false;
  }

  const decodedXml = decodeB64(samlRequest);
  if (!decodedXml) {
    return false;
  }

  const parsedInResponseTo = extractAttr(decodedXml, 'InResponseTo');
  const parsedIssuer = extractTag(decodedXml, 'Issuer');

  if (parsedInResponseTo !== data.inResponseTo || inResponseTo !== data.inResponseTo) {
    return false;
  }

  if (parsedIssuer !== data.issuer || issuer !== data.issuer) {
    return false;
  }

  return true;
};
