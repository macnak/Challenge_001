import type { ChallengeContext, ChallengeDefinition } from './types.js';
import { getChallengeState, setChallengeState } from './state.js';

export type ChallengeRuntime = ChallengeDefinition & {
  generate: (context: ChallengeContext) => Record<string, unknown>;
  validate: (
    context: ChallengeContext,
    state: Record<string, unknown>,
    payload: Record<string, unknown>,
  ) => boolean;
};

export const getOrCreateState = (context: ChallengeContext, challenge: ChallengeRuntime) => {
  const existing = getChallengeState(context.session, challenge.id);
  if (existing) {
    return existing;
  }

  const data = challenge.generate(context);
  return setChallengeState(context.session, challenge.id, data);
};
