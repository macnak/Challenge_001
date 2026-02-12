import type { AccessMethod } from './session.js';
import type { DifficultyTier, ToolProfile } from './challenges/types.js';

const parseBoolean = (value: string | undefined) => {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const accessMethodEnv = process.env.ACCESS_METHOD?.toLowerCase();
const accessMethodOverride = ['jwt', 'basic', 'none', 'user-pass'].includes(accessMethodEnv ?? '')
  ? (accessMethodEnv as AccessMethod)
  : null;

const toolProfileEnv = process.env.TOOL_PROFILE?.toLowerCase();
const toolProfileOverride = ['protocol', 'browser', 'mixed'].includes(toolProfileEnv ?? '')
  ? (toolProfileEnv as ToolProfile)
  : null;

const normalizeDifficulty = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace(/_/g, '-');
  const mapped = normalized === 'grandmaster' ? 'grand-master' : normalized;
  return ['easy', 'medium', 'advanced', 'grand-master'].includes(mapped)
    ? (mapped as DifficultyTier)
    : null;
};

const difficultyTierOverride = normalizeDifficulty(process.env.DIFFICULTY_TIER);

const parseInterviewPreset = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace(/_/g, '-');
  const match = normalized.match(/^(protocol|browser|mixed)-(easy|medium|advanced|grand-master)$/);
  if (!match) {
    return null;
  }

  return {
    profile: match[1] as ToolProfile,
    tier: match[2] as DifficultyTier,
  };
};

const interviewPreset = parseInterviewPreset(process.env.INTERVIEW_PRESET);
const fixedSeed = interviewPreset
  ? `preset:${interviewPreset.profile}-${interviewPreset.tier}`
  : process.env.FIXED_SEED?.trim() || null;

export const runConfig = {
  accessMethodOverride,
  toolProfileOverride: interviewPreset?.profile ?? toolProfileOverride,
  difficultyTierOverride: interviewPreset?.tier ?? difficultyTierOverride,
  interviewPreset,
  fixedSeed,
  fixedOrder: interviewPreset ? true : parseBoolean(process.env.FIXED_ORDER),
  showPerPageResults: parseBoolean(process.env.SHOW_PER_PAGE_RESULTS),
  showPerPageExplanation: parseBoolean(process.env.SHOW_PER_PAGE_EXPLANATION),
  blockContinueOnFailure: parseBoolean(process.env.BLOCK_CONTINUE_ON_FAILURE),
};
