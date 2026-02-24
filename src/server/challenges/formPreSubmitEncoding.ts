import type { ChallengeContext } from './types.js';
import { randomHex, randomInt, randomString } from './utils.js';

type FormPreSubmitEncodingData = {
  required: {
    accountId: string;
    regionCode: string;
    passphrase: string;
    nonce: string;
    encodingMode: 'base64' | 'reverse-base64' | 'base64url';
    encodingRule: string;
    encodedPayload: string;
  };
  optional: {
    note: string;
  };
};

const NOTE_OPTIONS = [
  'submit triggers pre-encoding script',
  'hidden payload must match encoded output',
  'replicate transform if bypassing browser submit hook',
];

const REGION_OPTIONS = ['EMEA', 'AMER', 'APAC'];
const ENCODING_MODES = ['base64', 'reverse-base64', 'base64url'] as const;

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

const normalizeBase64 = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
  const padding = normalized.length % 4;
  if (padding === 0) {
    return normalized;
  }
  return normalized + '='.repeat(4 - padding);
};

const decodeBase64 = (value: string) => {
  try {
    return Buffer.from(normalizeBase64(value), 'base64').toString('utf8');
  } catch {
    return '';
  }
};

const toBase64Url = (value: string) => {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const reverseString = (value: string) => value.split('').reverse().join('');

const buildRawPayload = (
  accountId: string,
  regionCode: string,
  passphrase: string,
  nonce: string,
) => {
  return `${accountId}|${regionCode}|${passphrase.toLowerCase()}|${nonce}`;
};

const encodePayload = (
  accountId: string,
  regionCode: string,
  passphrase: string,
  nonce: string,
  mode: 'base64' | 'reverse-base64' | 'base64url',
) => {
  const raw = buildRawPayload(accountId, regionCode, passphrase, nonce);
  if (mode === 'reverse-base64') {
    return Buffer.from(reverseString(raw), 'utf8').toString('base64');
  }

  if (mode === 'base64url') {
    return toBase64Url(raw);
  }

  return Buffer.from(raw, 'utf8').toString('base64');
};

export const generateFormPreSubmitEncoding = (
  context: ChallengeContext,
): FormPreSubmitEncodingData => {
  const accountId = `acct-${randomHex(3, context.rng).toUpperCase()}`;
  const regionCode = REGION_OPTIONS[randomInt(0, REGION_OPTIONS.length - 1, context.rng)];
  const passphrase = `pw-${randomString(6, context.rng)}`;
  const nonce = `N-${randomHex(4, context.rng).toUpperCase()}`;
  const encodingMode = ENCODING_MODES[randomInt(0, ENCODING_MODES.length - 1, context.rng)];

  const encodingRule =
    encodingMode === 'base64'
      ? 'base64(accountId|regionCode|lower(passphrase)|nonce)'
      : encodingMode === 'reverse-base64'
        ? 'base64(reverse(accountId|regionCode|lower(passphrase)|nonce))'
        : 'base64url(accountId|regionCode|lower(passphrase)|nonce)';

  return {
    required: {
      accountId,
      regionCode,
      passphrase,
      nonce,
      encodingMode,
      encodingRule,
      encodedPayload: encodePayload(accountId, regionCode, passphrase, nonce, encodingMode),
    },
    optional: {
      note: NOTE_OPTIONS[randomInt(0, NOTE_OPTIONS.length - 1, context.rng)],
    },
  };
};

export const renderFormPreSubmitEncoding = (
  context: ChallengeContext,
  data: FormPreSubmitEncodingData,
) => {
  return `
    <h1>Challenge ${context.index}: Form Pre-submit Encoding</h1>
    <p class="muted">Fill required fields. A pre-submit script computes an encoded hidden payload that the server validates.</p>
    <ul class="muted">
      <li>Account ID*: <strong>${data.required.accountId}</strong></li>
      <li>Region code*: <strong>${data.required.regionCode}</strong></li>
      <li>Passphrase*: <strong>${data.required.passphrase}</strong></li>
      <li>Nonce*: <strong>${data.required.nonce}</strong></li>
      <li>Encoding rule*: <strong>${data.required.encodingRule}</strong></li>
      <li>Note (optional): <strong>${data.optional.note}</strong></li>
    </ul>

    <label class="muted" for="accountId">Account ID*</label>
    <input id="accountId" name="accountId" type="text" required />

    <label class="muted" for="regionCode">Region code*</label>
    <input id="regionCode" name="regionCode" type="text" required />

    <label class="muted" for="passphrase">Passphrase*</label>
    <input id="passphrase" name="passphrase" type="text" required />

    <label class="muted" for="nonce">Nonce*</label>
    <input id="nonce" name="nonce" type="text" required />

    <label class="muted" for="note">Note (optional)</label>
    <input id="note" name="note" type="text" />

    <input id="encodedPayload" name="encodedPayload" type="hidden" />
    <input id="encodingMode" name="encodingMode" type="hidden" value="${data.required.encodingMode}" />

    <script>
      (function () {
        const form = document.getElementById('challenge-form');
        if (!form) {
          return;
        }

        form.addEventListener('submit', function () {
          const accountId = (document.getElementById('accountId') || {}).value || '';
          const regionCode = (document.getElementById('regionCode') || {}).value || '';
          const passphrase = (document.getElementById('passphrase') || {}).value || '';
          const nonce = (document.getElementById('nonce') || {}).value || '';
          const mode = (document.getElementById('encodingMode') || {}).value || 'base64';
          const payload = [
            String(accountId).trim(),
            String(regionCode).trim(),
            String(passphrase).trim().toLowerCase(),
            String(nonce).trim(),
          ].join('|');

          let encoded = '';
          if (typeof btoa === 'function') {
            if (mode === 'reverse-base64') {
              encoded = btoa(payload.split('').reverse().join(''));
            } else if (mode === 'base64url') {
              encoded = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
            } else {
              encoded = btoa(payload);
            }
          }

          const hidden = document.getElementById('encodedPayload');
          if (hidden) {
            hidden.value = encoded;
          }
        });
      })();
    </script>
  `;
};

export const validateFormPreSubmitEncoding = (
  data: FormPreSubmitEncodingData,
  payload: Record<string, unknown>,
) => {
  const accountId = read(payload, 'accountId');
  const regionCode = read(payload, 'regionCode');
  const passphrase = read(payload, 'passphrase');
  const nonce = read(payload, 'nonce');
  const encodedPayload = read(payload, 'encodedPayload');

  if (!accountId || !regionCode || !passphrase || !nonce || !encodedPayload) {
    return false;
  }

  if (accountId !== data.required.accountId) {
    return false;
  }

  if (regionCode !== data.required.regionCode) {
    return false;
  }

  if (passphrase !== data.required.passphrase) {
    return false;
  }

  if (nonce !== data.required.nonce) {
    return false;
  }

  if (encodedPayload !== data.required.encodedPayload) {
    return false;
  }

  const expectedDecoded = buildRawPayload(
    data.required.accountId,
    data.required.regionCode,
    data.required.passphrase,
    data.required.nonce,
  );

  const decoded = decodeBase64(encodedPayload);
  if (!decoded && data.required.encodingMode !== 'base64url') {
    return false;
  }

  if (data.required.encodingMode === 'reverse-base64') {
    if (reverseString(decoded) !== expectedDecoded) {
      return false;
    }
  } else if (decoded !== expectedDecoded) {
    return false;
  }

  const note = read(payload, 'note');
  if (note && note !== data.optional.note) {
    return false;
  }

  return true;
};
