import type { ChallengeContext } from './types.js';
import { pick, randomInt, shuffle } from './utils.js';

type SelectionType = 'checkbox' | 'radio';

const adjectives = [
  'Amber',
  'Azure',
  'Brisk',
  'Calm',
  'Cobalt',
  'Crimson',
  'Daring',
  'Eager',
  'Echo',
  'Emerald',
  'Feral',
  'Glacial',
  'Golden',
  'Hollow',
  'Indigo',
  'Ivory',
  'Jade',
  'Lunar',
  'Mellow',
  'Nova',
];

const nouns = [
  'Anchor',
  'Beacon',
  'Bridge',
  'Cipher',
  'Drift',
  'Falcon',
  'Forest',
  'Harbor',
  'Matrix',
  'Signal',
];

const itemPool = adjectives.flatMap((adjective) => nouns.map((noun) => `${adjective} ${noun}`));

const toSelectionArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === 'string');
  }
  if (typeof value === 'string') {
    return [value];
  }
  return [];
};

export const generateLargePoolSelection = (context: ChallengeContext) => {
  const optionCount = randomInt(5, 20, context.rng);
  const options = shuffle(itemPool, context.rng).slice(0, optionCount);
  const selectionType = pick<SelectionType>(['checkbox', 'radio'], context.rng);

  const targetCount =
    selectionType === 'checkbox' ? randomInt(2, Math.min(4, options.length), context.rng) : 1;
  const targets = shuffle(options, context.rng).slice(0, targetCount);

  return {
    selectionType,
    options,
    targets,
  };
};

export const renderLargePoolSelection = (
  context: ChallengeContext,
  data: { selectionType: SelectionType; options: string[]; targets: string[] },
) => {
  const controlLabel =
    data.selectionType === 'checkbox' ? 'Select all target items' : 'Select target item';
  const instruction =
    data.selectionType === 'checkbox'
      ? `Check exactly these items: ${data.targets.join(', ')}`
      : `Select this item: ${data.targets[0]}`;

  const inputs = data.options
    .map(
      (option) => `
        <label style="display:block; margin: 6px 0;">
          <input type="${data.selectionType}" name="choice" value="${option}" />
          ${option}
        </label>
      `,
    )
    .join('');

  return `
    <h1>Challenge ${context.index}: Large-pool Selection</h1>
    <p class="muted">${instruction}</p>
    <p class="muted">${controlLabel}. Options shown this session: ${data.options.length}.</p>
    <div>${inputs}</div>
  `;
};

export const validateLargePoolSelection = (
  data: { selectionType: SelectionType; targets: string[] },
  payload: Record<string, unknown>,
) => {
  const selected = toSelectionArray(payload.choice);

  if (data.selectionType === 'radio') {
    return selected.length === 1 && selected[0] === data.targets[0];
  }

  const expectedSet = new Set(data.targets);
  const selectedSet = new Set(selected);

  if (expectedSet.size !== selectedSet.size) {
    return false;
  }

  for (const value of expectedSet) {
    if (!selectedSet.has(value)) {
      return false;
    }
  }

  return true;
};
