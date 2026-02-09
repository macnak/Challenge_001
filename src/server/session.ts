import crypto from 'node:crypto';
import { runConfig } from './config.js';

export type AccessMethod = 'jwt' | 'basic' | 'none' | 'user-pass';

export type Session = {
  id: string;
  seed: string;
  accessMethod: AccessMethod;
  createdAt: number;
  expiresAt: number;
  tabTokens: Set<string>;
  pageCount: number;
  pageOrder: string[];
  resultsByIndex: Record<number, boolean>;
};

const ACCESS_METHODS: AccessMethod[] = ['jwt', 'basic', 'none', 'user-pass'];
const SESSION_TTL_MS = 10 * 60 * 1000;

const sessions = new Map<string, Session>();

export const createSession = () => {
  const id = crypto.randomUUID();
  const seed = crypto.randomBytes(16).toString('hex');
  const accessMethod =
    runConfig.accessMethodOverride ??
    ACCESS_METHODS[Math.floor(Math.random() * ACCESS_METHODS.length)];
  const now = Date.now();

  const session: Session = {
    id,
    seed,
    accessMethod,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    tabTokens: new Set<string>(),
    pageCount: Math.floor(Math.random() * 6) + 10,
    pageOrder: [],
    resultsByIndex: {},
  };

  sessions.set(id, session);
  return session;
};

export const getSession = (id: string | undefined) => {
  if (!id) {
    return null;
  }

  const session = sessions.get(id) ?? null;
  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(id);
    return null;
  }

  return session;
};

export const createTabToken = (session: Session) => {
  const token = crypto.randomBytes(12).toString('hex');
  session.tabTokens.add(token);
  return token;
};

export const validateTabToken = (session: Session, token: string | undefined) => {
  if (!token) {
    return false;
  }

  return session.tabTokens.has(token);
};

export const setChallengeResult = (session: Session, index: number, passed: boolean) => {
  session.resultsByIndex[index] = passed;
};

export const setPageOrder = (session: Session, order: string[]) => {
  session.pageOrder = order;
};
