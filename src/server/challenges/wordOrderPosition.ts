import type { ChallengeContext } from './types.js';
import { pick, randomInt, shuffle } from './utils.js';

type SortDirection = 'asc' | 'desc';
type CaseMode = 'sensitive' | 'insensitive';
type PositionFrom = 'top' | 'bottom';

const prefixes = [
  'alpha',
  'bravo',
  'cinder',
  'delta',
  'ember',
  'fable',
  'glint',
  'harbor',
  'ivory',
  'juno',
  'kilo',
  'lumen',
  'mirth',
  'nova',
  'onyx',
  'prism',
  'quartz',
  'raven',
  'solace',
  'tempo',
];

const suffixes = ['arc', 'bloom', 'crest', 'drift', 'echo', 'flare', 'grove', 'haze', 'ink', 'jet'];

const wordPool = prefixes.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));

const randomCaseVariant = (word: string, context: ChallengeContext) => {
  const variant = randomInt(0, 2, context.rng);
  if (variant === 0) {
    return word.toLowerCase();
  }
  if (variant === 1) {
    return word.toUpperCase();
  }
  return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
};

const compareWords = (left: string, right: string, caseMode: CaseMode) => {
  if (caseMode === 'insensitive') {
    const primary = left.toLowerCase().localeCompare(right.toLowerCase());
    if (primary !== 0) {
      return primary;
    }
  }

  return left.localeCompare(right);
};

export const computeWordOrderExpected = (data: {
  words: string[];
  direction: SortDirection;
  caseMode: CaseMode;
  nth: number;
  from: PositionFrom;
}) => {
  const sorted = [...data.words].sort((a, b) => compareWords(a, b, data.caseMode));
  if (data.direction === 'desc') {
    sorted.reverse();
  }

  const index = data.from === 'top' ? data.nth - 1 : sorted.length - data.nth;
  return sorted[index] ?? '';
};

export const generateWordOrderPosition = (context: ChallengeContext) => {
  const count = randomInt(10, 20, context.rng);
  const words = shuffle(wordPool, context.rng)
    .slice(0, count)
    .map((word) => randomCaseVariant(word, context));

  const direction = pick<SortDirection>(['asc', 'desc'], context.rng);
  const caseMode = pick<CaseMode>(['sensitive', 'insensitive'], context.rng);
  const from = pick<PositionFrom>(['top', 'bottom'], context.rng);
  const nth = randomInt(2, Math.min(6, words.length), context.rng);

  const expected = computeWordOrderExpected({ words, direction, caseMode, nth, from });

  return {
    words,
    direction,
    caseMode,
    from,
    nth,
    expected,
  };
};

export const renderWordOrderPosition = (
  context: ChallengeContext,
  data: {
    words: string[];
    direction: SortDirection;
    caseMode: CaseMode;
    from: PositionFrom;
    nth: number;
  },
) => {
  const directionText = data.direction === 'asc' ? 'ascending' : 'descending';
  const caseText = data.caseMode === 'sensitive' ? 'case-sensitive' : 'case-insensitive';
  const wordList = data.words.map((word) => `<li>${word}</li>`).join('');

  return `
    <h1>Challenge ${context.index}: Word Order Position</h1>
    <p class="muted">Sort the words in <strong>${directionText}</strong> order using <strong>${caseText}</strong> comparison.</p>
    <p class="muted">Submit the <strong>${data.nth}${data.nth === 1 ? 'st' : data.nth === 2 ? 'nd' : data.nth === 3 ? 'rd' : 'th'}</strong> word from the <strong>${data.from}</strong>.</p>
    <ul style="columns:2; margin: 12px 0;">${wordList}</ul>
    <label class="muted" for="answer">Word</label>
    <input id="answer" name="answer" type="text" autocomplete="off" />
  `;
};

export const validateWordOrderPosition = (
  data: { expected: string },
  payload: Record<string, unknown>,
) => {
  const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
  return answer === data.expected;
};
