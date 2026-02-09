import type { AccessMethod } from './session.js';

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

export const runConfig = {
  accessMethodOverride,
  fixedOrder: parseBoolean(process.env.FIXED_ORDER),
  showPerPageResults: parseBoolean(process.env.SHOW_PER_PAGE_RESULTS),
  blockContinueOnFailure: parseBoolean(process.env.BLOCK_CONTINUE_ON_FAILURE),
};
