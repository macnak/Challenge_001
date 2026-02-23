import type { AccessMethod } from './session.js';
import type { DifficultyTier, ToolProfile } from './challenges/types.js';

type ApiTableRuleMode = 'sku' | 'compound' | 'rating-under-cap';
type BrandLogoMode = 'tenant' | 'theme' | 'none';

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

  if (['1', '2', '3'].includes(normalized)) {
    return 'easy' as DifficultyTier;
  }

  if (['4', '5', '6'].includes(normalized)) {
    return 'medium' as DifficultyTier;
  }

  if (['7', '8'].includes(normalized)) {
    return 'advanced' as DifficultyTier;
  }

  if (normalized === '9') {
    return 'grand-master' as DifficultyTier;
  }

  const mapped = normalized === 'grandmaster' ? 'grand-master' : normalized;
  return ['easy', 'medium', 'advanced', 'grand-master'].includes(mapped)
    ? (mapped as DifficultyTier)
    : null;
};

const difficultyTierOverride =
  normalizeDifficulty(process.env.DIFFICULTY_LEVEL) ??
  normalizeDifficulty(process.env.DIFFICULTY_TIER);

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

const parseApiTableRuleMode = (value: string | undefined): ApiTableRuleMode | null => {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase().replace(/_/g, '-').trim();
  return ['sku', 'compound', 'rating-under-cap'].includes(normalized)
    ? (normalized as ApiTableRuleMode)
    : null;
};

const parseApiTableRuleSequence = (value: string | undefined): ApiTableRuleMode[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((part) => parseApiTableRuleMode(part))
    .filter((mode): mode is ApiTableRuleMode => mode !== null);
};

const apiTableRuleMode = parseApiTableRuleMode(process.env.API_TABLE_RULE_MODE);
const apiTableRuleSequence = parseApiTableRuleSequence(process.env.API_TABLE_RULE_SEQUENCE);

const normalizeThemePack = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return 'inferno';
  }

  return normalized;
};

const normalizeTenantId = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized ? normalized : null;
};

const parseBrandLogoMode = (value: string | undefined): BrandLogoMode => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'tenant' || normalized === 'theme' || normalized === 'none') {
    return normalized;
  }

  return 'theme';
};

const parseWatermark = (value: string | undefined) => {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (normalized === 'off' || normalized === '0' || normalized === 'false' || normalized === 'no') {
    return false;
  }

  return ['on', '1', 'true', 'yes'].includes(normalized);
};

const themePack = normalizeThemePack(process.env.THEME_PACK);
const tenantId = normalizeTenantId(process.env.TENANT_ID);
const brandLogoMode = parseBrandLogoMode(process.env.BRAND_LOGO_MODE);
const themeWatermark = parseWatermark(process.env.THEME_WATERMARK);

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
  apiTableRuleMode,
  apiTableRuleSequence,
  themePack,
  tenantId,
  brandLogoMode,
  themeWatermark,
};
