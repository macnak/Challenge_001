import type { ChallengeContext } from './types.js';
import { randomHex, randomString } from './utils.js';

type RedirectStateHopData = {
  required: {
    initialPath: string;
    intermediatePath: string;
    finalPath: string;
    state: string;
    hopTrail: string;
    redirectSignature: string;
  };
};

const read = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value.trim() : '';
};

export const generateRedirectStateHop = (context: ChallengeContext): RedirectStateHopData => {
  const state = `ST-${randomString(8, context.rng).toUpperCase()}`;
  const initialPath = '/auth/start';
  const intermediatePath = '/auth/hop';
  const finalPath = '/auth/final';
  const hopTrail = `${initialPath}>${intermediatePath}>${finalPath}`;
  const redirectSignature = `SIG-${randomHex(5, context.rng).toUpperCase()}`;

  return {
    required: {
      initialPath,
      intermediatePath,
      finalPath,
      state,
      hopTrail,
      redirectSignature,
    },
  };
};

export const renderRedirectStateHop = (context: ChallengeContext, data: RedirectStateHopData) => {
  return `
    <h1>Challenge ${context.index}: Redirect State Hop</h1>
    <p class="muted">Follow redirect semantics and submit the captured state and hop correlation values.</p>
    <ul class="muted">
      <li>Initial path*: <strong>${data.required.initialPath}</strong></li>
      <li>Intermediate path*: <strong>${data.required.intermediatePath}</strong></li>
      <li>Final path*: <strong>${data.required.finalPath}</strong></li>
      <li>Captured state*: <strong>${data.required.state}</strong></li>
      <li>Expected hop trail*: <strong>${data.required.hopTrail}</strong></li>
      <li>Redirect signature*: <strong>${data.required.redirectSignature}</strong></li>
    </ul>

    <label class="muted" for="state">State*</label>
    <input id="state" name="state" type="text" required />

    <label class="muted" for="hopTrail">Hop trail*</label>
    <input id="hopTrail" name="hopTrail" type="text" required />

    <label class="muted" for="redirectSignature">Redirect signature*</label>
    <input id="redirectSignature" name="redirectSignature" type="text" required />
  `;
};

export const validateRedirectStateHop = (
  data: RedirectStateHopData,
  payload: Record<string, unknown>,
) => {
  const state = read(payload, 'state');
  const hopTrail = read(payload, 'hopTrail');
  const redirectSignature = read(payload, 'redirectSignature');

  if (state !== data.required.state) {
    return false;
  }

  if (hopTrail !== data.required.hopTrail) {
    return false;
  }

  if (redirectSignature !== data.required.redirectSignature) {
    return false;
  }

  return true;
};
