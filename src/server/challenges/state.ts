import crypto from 'node:crypto';
import type { Session } from '../session.js';

export type ChallengeState = {
  id: string;
  generatedAt: number;
  data: Record<string, unknown>;
};

const stateMap = new Map<string, ChallengeState>();

const buildKey = (sessionId: string, challengeId: string) => `${sessionId}:${challengeId}`;

export const getChallengeState = (session: Session, challengeId: string) => {
  return stateMap.get(buildKey(session.id, challengeId)) ?? null;
};

export const setChallengeState = (
  session: Session,
  challengeId: string,
  data: Record<string, unknown>,
) => {
  const state: ChallengeState = {
    id: crypto.randomUUID(),
    generatedAt: Date.now(),
    data,
  };
  stateMap.set(buildKey(session.id, challengeId), state);
  return state;
};

export const clearChallengeState = (session: Session, challengeId: string) => {
  stateMap.delete(buildKey(session.id, challengeId));
};
