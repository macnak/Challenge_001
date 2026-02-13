import { describe, expect, it } from 'vitest';
import { generateLargePoolSelection, validateLargePoolSelection } from '../largePoolSelection.js';

describe('large pool selection', () => {
  it('generates options in required bounds', () => {
    const data = generateLargePoolSelection({
      session: {} as never,
      index: 1,
      rng: Math.random,
    });

    expect(data.options.length).toBeGreaterThanOrEqual(5);
    expect(data.options.length).toBeLessThanOrEqual(20);

    if (data.selectionType === 'radio') {
      expect(data.targets.length).toBe(1);
    } else {
      expect(data.targets.length).toBeGreaterThanOrEqual(2);
      expect(data.targets.length).toBeLessThanOrEqual(Math.min(4, data.options.length));
    }
  });

  it('accepts exact checkbox set', () => {
    const result = validateLargePoolSelection(
      {
        selectionType: 'checkbox',
        targets: ['Amber Anchor', 'Nova Signal'],
      },
      {
        choice: ['Nova Signal', 'Amber Anchor'],
      },
    );

    expect(result).toBe(true);
  });

  it('rejects checkbox selection with extra value', () => {
    const result = validateLargePoolSelection(
      {
        selectionType: 'checkbox',
        targets: ['Amber Anchor', 'Nova Signal'],
      },
      {
        choice: ['Amber Anchor', 'Nova Signal', 'Azure Beacon'],
      },
    );

    expect(result).toBe(false);
  });

  it('accepts matching radio selection', () => {
    const result = validateLargePoolSelection(
      {
        selectionType: 'radio',
        targets: ['Golden Matrix'],
      },
      {
        choice: 'Golden Matrix',
      },
    );

    expect(result).toBe(true);
  });
});
