import type { Session } from '../session.js';

export type ToolProfile = 'protocol' | 'browser' | 'mixed';
export type ToolAffinity = 'protocol' | 'browser' | 'either';
export type DifficultyTier = 'easy' | 'medium' | 'advanced' | 'grand-master';

export type ChallengeContext = {
  session: Session;
  index: number;
  rng: () => number;
  tabToken?: string;
};

export type ChallengeDefinition = {
  id: string;
  title: string;
  toolAffinity: ToolAffinity;
  difficulty: DifficultyTier;
  explain?: string;
  render: (context: ChallengeContext, state: Record<string, unknown>) => string;
};
