import type { Session } from '../session.js';

export type ChallengeContext = {
  session: Session;
  index: number;
};

export type ChallengeDefinition = {
  id: string;
  title: string;
  render: (context: ChallengeContext, state: Record<string, unknown>) => string;
};
