import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

type PageTimeoutStepWindowData = {
  transactionId: string;
  issuedAt: number;
  expiresAt: number;
  maxStepGapMs: number;
  stepTokens: {
    step1: string;
    step2: string;
    step3: string;
  };
};

const makeToken = () => `SW-${randomHex(5).toUpperCase()}`;

export const generatePageTimeoutStepWindow = (
  _context: ChallengeContext,
): PageTimeoutStepWindowData => {
  const issuedAt = Date.now();
  const maxStepGapMs = randomInt(3500, 9000);
  const ttlMs = randomInt(15000, 30000);

  return {
    transactionId: `TX-${randomHex(6).toUpperCase()}`,
    issuedAt,
    expiresAt: issuedAt + ttlMs,
    maxStepGapMs,
    stepTokens: {
      step1: makeToken(),
      step2: makeToken(),
      step3: makeToken(),
    },
  };
};

export const renderPageTimeoutStepWindow = (
  context: ChallengeContext,
  data: PageTimeoutStepWindowData,
) => {
  const ttlSeconds = Math.max(1, Math.round((data.expiresAt - data.issuedAt) / 1000));

  return `
    <h1>Challenge ${context.index}: Page Step Timeout Window</h1>
    <p class="muted">Complete a 3-step token chain while respecting per-step max gap and overall expiry.</p>
    <ul class="muted">
      <li>Transaction ID*: <strong>${data.transactionId}</strong></li>
      <li>Overall expiry window*: <strong>${ttlSeconds}s</strong></li>
      <li>Max gap between step transitions*: <strong>${data.maxStepGapMs}ms</strong></li>
      <li>Step 1 token: <strong>${data.stepTokens.step1}</strong></li>
      <li>Step 2 token: <strong>${data.stepTokens.step2}</strong></li>
      <li>Step 3 token: <strong>${data.stepTokens.step3}</strong></li>
    </ul>

    <label class="muted" for="transactionId">Transaction ID*</label>
    <input id="transactionId" name="transactionId" type="text" required />

    <label class="muted" for="step1Token">Step 1 token*</label>
    <input id="step1Token" name="step1Token" type="text" required />

    <label class="muted" for="step2PrevToken">Step 2 previous token*</label>
    <input id="step2PrevToken" name="step2PrevToken" type="text" required />

    <label class="muted" for="step2Token">Step 2 token*</label>
    <input id="step2Token" name="step2Token" type="text" required />

    <label class="muted" for="step3PrevToken">Step 3 previous token*</label>
    <input id="step3PrevToken" name="step3PrevToken" type="text" required />

    <label class="muted" for="step3Token">Step 3 token*</label>
    <input id="step3Token" name="step3Token" type="text" required />

    <label class="muted" for="reportedStepGapMs">Reported max step gap used (ms)*</label>
    <input id="reportedStepGapMs" name="reportedStepGapMs" type="text" required />

    <label class="muted" for="finalToken">Final token*</label>
    <input id="finalToken" name="finalToken" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validatePageTimeoutStepWindow = (
  data: PageTimeoutStepWindowData,
  payload: Record<string, unknown>,
) => {
  if (Date.now() > data.expiresAt) {
    return false;
  }

  const transactionId = read(payload, 'transactionId');
  const step1Token = read(payload, 'step1Token');
  const step2PrevToken = read(payload, 'step2PrevToken');
  const step2Token = read(payload, 'step2Token');
  const step3PrevToken = read(payload, 'step3PrevToken');
  const step3Token = read(payload, 'step3Token');
  const finalToken = read(payload, 'finalToken');
  const reportedStepGapRaw = read(payload, 'reportedStepGapMs');

  if (transactionId !== data.transactionId) {
    return false;
  }

  if (step1Token !== data.stepTokens.step1) {
    return false;
  }

  if (step2PrevToken !== data.stepTokens.step1 || step2Token !== data.stepTokens.step2) {
    return false;
  }

  if (step3PrevToken !== data.stepTokens.step2 || step3Token !== data.stepTokens.step3) {
    return false;
  }

  if (finalToken !== data.stepTokens.step3) {
    return false;
  }

  const reportedStepGapMs = Number.parseInt(reportedStepGapRaw, 10);
  if (!Number.isFinite(reportedStepGapMs) || reportedStepGapMs > data.maxStepGapMs) {
    return false;
  }

  return true;
};
