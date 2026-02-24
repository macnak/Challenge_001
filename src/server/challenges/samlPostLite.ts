import type { ChallengeContext } from './types.js';
import { randomHex, randomString } from './utils.js';

type SamlPostLiteData = {
  nameId: string;
  audience: string;
  recipient: string;
  notOnOrAfter: string;
  samlResponseB64: string;
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

export const generateSamlPostLite = (_context: ChallengeContext): SamlPostLiteData => {
  const nameId = `user-${randomString(6).toLowerCase()}@example.com`;
  const audience = `urn:example:sp:${randomString(5).toLowerCase()}`;
  const recipient = `https://sp.example.com/acs/${randomHex(3).toLowerCase()}`;
  const notOnOrAfter = new Date(Date.now() + 20 * 60 * 1000).toISOString();

  const responseXml = `<Response><Assertion NotOnOrAfter="${notOnOrAfter}"><NameID>${nameId}</NameID><Audience>${audience}</Audience><Recipient>${recipient}</Recipient></Assertion></Response>`;

  return {
    nameId,
    audience,
    recipient,
    notOnOrAfter,
    samlResponseB64: Buffer.from(responseXml, 'utf8').toString('base64'),
  };
};

export const renderSamlPostLite = (context: ChallengeContext, data: SamlPostLiteData) => {
  return `
    <h1>Challenge ${context.index}: SAML Post Lite</h1>
    <p class="muted">Validate simplified SAML POST semantics from a base64 encoded SAMLResponse payload.</p>
    <ul class="muted">
      <li>Encoded SAMLResponse*: <strong>${data.samlResponseB64}</strong></li>
      <li>Extract and submit: <strong>NameID</strong>, <strong>Audience</strong>, <strong>Recipient</strong>, <strong>NotOnOrAfter</strong>.</li>
    </ul>

    <label class="muted" for="samlResponse">SAMLResponse (base64)*</label>
    <input id="samlResponse" name="samlResponse" type="text" required />

    <label class="muted" for="nameId">NameID*</label>
    <input id="nameId" name="nameId" type="text" required />

    <label class="muted" for="audience">Audience*</label>
    <input id="audience" name="audience" type="text" required />

    <label class="muted" for="recipient">Recipient*</label>
    <input id="recipient" name="recipient" type="text" required />

    <label class="muted" for="notOnOrAfter">NotOnOrAfter*</label>
    <input id="notOnOrAfter" name="notOnOrAfter" type="text" required />
  `;
};

export const validateSamlPostLite = (data: SamlPostLiteData, payload: Record<string, unknown>) => {
  const samlResponse = typeof payload.samlResponse === 'string' ? payload.samlResponse.trim() : '';
  const nameId = typeof payload.nameId === 'string' ? payload.nameId.trim() : '';
  const audience = typeof payload.audience === 'string' ? payload.audience.trim() : '';
  const recipient = typeof payload.recipient === 'string' ? payload.recipient.trim() : '';
  const notOnOrAfter = typeof payload.notOnOrAfter === 'string' ? payload.notOnOrAfter.trim() : '';

  if (!samlResponse || !nameId || !audience || !recipient || !notOnOrAfter) {
    return false;
  }

  const decodedXml = decodeB64(samlResponse);
  if (!decodedXml) {
    return false;
  }

  const parsedNameId = extractTag(decodedXml, 'NameID');
  const parsedAudience = extractTag(decodedXml, 'Audience');
  const parsedRecipient = extractTag(decodedXml, 'Recipient');
  const parsedNotOnOrAfter = extractAttr(decodedXml, 'NotOnOrAfter');

  if (parsedNameId !== data.nameId || nameId !== data.nameId) {
    return false;
  }

  if (parsedAudience !== data.audience || audience !== data.audience) {
    return false;
  }

  if (parsedRecipient !== data.recipient || recipient !== data.recipient) {
    return false;
  }

  if (parsedNotOnOrAfter !== data.notOnOrAfter || notOnOrAfter !== data.notOnOrAfter) {
    return false;
  }

  const expiryMs = Date.parse(parsedNotOnOrAfter);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) {
    return false;
  }

  return true;
};
