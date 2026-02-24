import type { ChallengeContext } from './types.js';
import { randomHex, randomInt } from './utils.js';

export type OnePageAuthWizardData = {
  transactionId: string;
  username: string;
  secretAnswer: string;
  mfaCode: string;
  finalSessionToken: string;
  stepTokens: {
    step1: string;
    step2: string;
    step3: string;
  };
  expectedWizardState: string;
  expiresAt: number;
};

const makeCode = (digits: number) =>
  String(randomInt(10 ** (digits - 1), 10 ** digits - 1)).slice(0, digits);

export const generateOnePageAuthWizard = (_context: ChallengeContext): OnePageAuthWizardData => {
  return {
    transactionId: `WIZ-${randomHex(5).toUpperCase()}`,
    username: `wizard_${randomHex(3).toLowerCase()}`,
    secretAnswer: `ans-${randomHex(2).toLowerCase()}`,
    mfaCode: makeCode(6),
    finalSessionToken: `WSESS-${randomHex(6).toUpperCase()}`,
    stepTokens: {
      step1: `W1-${randomHex(4).toUpperCase()}`,
      step2: `W2-${randomHex(4).toUpperCase()}`,
      step3: `W3-${randomHex(4).toUpperCase()}`,
    },
    expectedWizardState: 'step1>step2>step3>complete',
    expiresAt: Date.now() + 6 * 60 * 1000,
  };
};

export const renderOnePageAuthWizard = (context: ChallengeContext, data: OnePageAuthWizardData) => {
  return `
    <h1>Challenge ${context.index}: One-page Auth Wizard</h1>
    <p class="muted">Complete the one-page 3-step auth state machine with strict step token chaining.</p>
    <ul class="muted">
      <li>Transaction ID*: <strong>${data.transactionId}</strong></li>
      <li>Username*: <strong>${data.username}</strong></li>
      <li>Secret answer*: <strong>${data.secretAnswer}</strong></li>
      <li>MFA code*: <strong>${data.mfaCode}</strong></li>
      <li>Step1 token*: <strong>${data.stepTokens.step1}</strong></li>
      <li>Step2 token*: <strong>${data.stepTokens.step2}</strong></li>
      <li>Step3 token*: <strong>${data.stepTokens.step3}</strong></li>
      <li>Wizard state*: <strong>${data.expectedWizardState}</strong></li>
      <li>Final session token*: <strong>${data.finalSessionToken}</strong></li>
    </ul>

    <label class="muted" for="transactionId">Transaction ID*</label>
    <input id="transactionId" name="transactionId" type="text" required />

    <label class="muted" for="username">Username*</label>
    <input id="username" name="username" type="text" required />

    <label class="muted" for="secretAnswer">Secret answer*</label>
    <input id="secretAnswer" name="secretAnswer" type="text" required />

    <label class="muted" for="step1Token">Step1 token*</label>
    <input id="step1Token" name="step1Token" type="text" required />

    <label class="muted" for="step2PrevToken">Step2 previous token*</label>
    <input id="step2PrevToken" name="step2PrevToken" type="text" required />

    <label class="muted" for="step2Token">Step2 token*</label>
    <input id="step2Token" name="step2Token" type="text" required />

    <label class="muted" for="step3PrevToken">Step3 previous token*</label>
    <input id="step3PrevToken" name="step3PrevToken" type="text" required />

    <label class="muted" for="step3Token">Step3 token*</label>
    <input id="step3Token" name="step3Token" type="text" required />

    <label class="muted" for="mfaCode">MFA code*</label>
    <input id="mfaCode" name="mfaCode" type="text" required />

    <label class="muted" for="wizardState">Wizard state*</label>
    <input id="wizardState" name="wizardState" type="text" required />

    <label class="muted" for="finalSessionToken">Final session token*</label>
    <input id="finalSessionToken" name="finalSessionToken" type="text" required />
  `;
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const validateOnePageAuthWizard = (
  data: OnePageAuthWizardData,
  payload: Record<string, unknown>,
) => {
  if (Date.now() > data.expiresAt) {
    return false;
  }

  const transactionId = read(payload, 'transactionId');
  const username = read(payload, 'username');
  const secretAnswer = read(payload, 'secretAnswer');
  const step1Token = read(payload, 'step1Token');
  const step2PrevToken = read(payload, 'step2PrevToken');
  const step2Token = read(payload, 'step2Token');
  const step3PrevToken = read(payload, 'step3PrevToken');
  const step3Token = read(payload, 'step3Token');
  const mfaCode = read(payload, 'mfaCode');
  const wizardState = read(payload, 'wizardState');
  const finalSessionToken = read(payload, 'finalSessionToken');

  if (transactionId !== data.transactionId) {
    return false;
  }

  if (username !== data.username || secretAnswer !== data.secretAnswer) {
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

  if (mfaCode !== data.mfaCode) {
    return false;
  }

  if (wizardState !== data.expectedWizardState) {
    return false;
  }

  if (finalSessionToken !== data.finalSessionToken) {
    return false;
  }

  return true;
};
