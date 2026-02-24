import type { ChallengeContext } from './types.js';
import { pick, randomHex, randomString } from './utils.js';

type Branch = 'alpha' | 'beta';

type RedirectTokenBranchingData = {
  expectedBranch: Branch;
  tokens: Record<Branch, string>;
  hopKeys: Record<Branch, string>;
  pickupConfirmed: boolean;
  pickedBranch: Branch | null;
};

const branchLabel = (branch: Branch) => (branch === 'alpha' ? 'Alpha' : 'Beta');

export const generateRedirectTokenBranching = (
  context: ChallengeContext,
): RedirectTokenBranchingData => {
  const expectedBranch = pick<Branch>(['alpha', 'beta'], context.rng);

  return {
    expectedBranch,
    tokens: {
      alpha: `RB-A-${randomString(8, context.rng).toUpperCase()}`,
      beta: `RB-B-${randomString(8, context.rng).toUpperCase()}`,
    },
    hopKeys: {
      alpha: randomHex(8, context.rng),
      beta: randomHex(8, context.rng),
    },
    pickupConfirmed: false,
    pickedBranch: null,
  };
};

export const renderRedirectTokenBranching = (
  context: ChallengeContext,
  data: RedirectTokenBranchingData,
) => {
  const tokenQuery = context.tabToken ? `?t=${context.tabToken}` : '';
  const alphaHref = `/m/${context.session.accessMethod}/challenge/${context.index}/redirect-branch/start${tokenQuery}${tokenQuery ? '&' : '?'}b=alpha`;
  const betaHref = `/m/${context.session.accessMethod}/challenge/${context.index}/redirect-branch/start${tokenQuery}${tokenQuery ? '&' : '?'}b=beta`;

  const status = data.pickupConfirmed
    ? `<strong style="color:#7df2a4;">Pickup confirmed via ${data.pickedBranch ? branchLabel(data.pickedBranch) : 'Unknown'} branch.</strong>`
    : '<strong style="color:#ffb347;">Branch pickup not confirmed yet.</strong>';

  return `
    <h1>Challenge ${context.index}: Redirect Token Branching</h1>
    <p class="muted">Follow the instructed branch redirect flow and submit the resulting token.</p>
    <p class="muted">Required branch: <strong>${branchLabel(data.expectedBranch)}</strong></p>
    <p class="muted">Status: ${status}</p>
    <div class="row" style="margin: 8px 0 14px;">
      <a class="button" href="${alphaHref}">Start Alpha branch</a>
      <a class="button" href="${betaHref}">Start Beta branch</a>
    </div>
    <label class="muted" for="answer">Picked token</label>
    <input id="answer" name="answer" type="text" />
  `;
};

export const validateRedirectTokenBranching = (
  data: RedirectTokenBranchingData,
  payload: Record<string, unknown>,
) => {
  if (!data.pickupConfirmed || !data.pickedBranch) {
    return false;
  }

  if (data.pickedBranch !== data.expectedBranch) {
    return false;
  }

  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.tokens[data.expectedBranch];
};
