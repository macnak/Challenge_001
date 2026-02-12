import {
  challengeRuntimes,
  getChallengeRuntimeById,
  getChallengeRuntimeByIndex,
} from './runtime.js';
import { buildChallengeContext, getOrCreateState } from './engine.js';
import type { DifficultyTier, ToolProfile, ToolAffinity } from './types.js';

export { challengeRuntimes, getChallengeRuntimeByIndex, getChallengeRuntimeById };
export { buildChallengeContext, getOrCreateState };
export type { DifficultyTier, ToolProfile, ToolAffinity };

export const DIFFICULTY_ORDER: DifficultyTier[] = ['easy', 'medium', 'advanced', 'grand-master'];

const difficultyRank = (tier: DifficultyTier) => {
  const index = DIFFICULTY_ORDER.indexOf(tier);
  return index === -1 ? DIFFICULTY_ORDER.length : index;
};

const matchesProfile = (affinity: ToolAffinity, profile: ToolProfile) => {
  if (profile === 'mixed') {
    return true;
  }
  if (affinity === 'either') {
    return true;
  }
  return affinity === profile;
};

export const filterChallengeRuntimes = (
  runtimes: typeof challengeRuntimes,
  profile: ToolProfile | null,
  tier: DifficultyTier | null,
) => {
  return runtimes.filter((runtime) => {
    const profileOk = profile ? matchesProfile(runtime.toolAffinity, profile) : true;
    const tierOk = tier ? difficultyRank(runtime.difficulty) <= difficultyRank(tier) : true;
    return profileOk && tierOk;
  });
};

export const sortChallengeRuntimes = (runtimes: typeof challengeRuntimes) => {
  return [...runtimes].sort((a, b) => {
    const tierDiff = difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
    if (tierDiff !== 0) {
      return tierDiff;
    }
    return a.id.localeCompare(b.id);
  });
};
