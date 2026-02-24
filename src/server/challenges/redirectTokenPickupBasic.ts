import type { ChallengeContext } from './types.js';
import { randomHex, randomString } from './utils.js';

type RedirectTokenPickupBasicData = {
  token: string;
  hopToken: string;
  pickupConfirmed: boolean;
};

export const generateRedirectTokenPickupBasic = (
  context: ChallengeContext,
): RedirectTokenPickupBasicData => {
  return {
    token: `RT-${randomString(8, context.rng).toUpperCase()}`,
    hopToken: randomHex(8, context.rng),
    pickupConfirmed: false,
  };
};

export const renderRedirectTokenPickupBasic = (
  context: ChallengeContext,
  data: RedirectTokenPickupBasicData,
) => {
  const startHref = `/m/${context.session.accessMethod}/challenge/${context.index}/redirect-token/start${context.tabToken ? `?t=${context.tabToken}` : ''}`;
  const status = data.pickupConfirmed
    ? '<strong style="color:#7df2a4;">Redirect token picked up.</strong>'
    : '<strong style="color:#ffb347;">Redirect token not picked up yet.</strong>';

  return `
    <h1>Challenge ${context.index}: Redirect Token Pickup (Basic)</h1>
    <p class="muted">Open the redirect flow, capture the token from the redirected URL, and submit it.</p>
    <p class="muted">Progression is blocked until token pickup is performed through the redirect chain.</p>
    <p class="muted">Status: ${status}</p>
    <div class="row" style="margin: 8px 0 14px;">
      <a class="button" href="${startHref}">Start redirect token pickup</a>
    </div>
    <label class="muted" for="answer">Picked token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateRedirectTokenPickupBasic = (
  data: RedirectTokenPickupBasicData,
  payload: Record<string, unknown>,
) => {
  if (!data.pickupConfirmed) {
    return false;
  }

  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.token;
};
