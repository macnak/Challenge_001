import type { ChallengeContext } from './types.js';
import type { ChallengeRuntime } from './engine.js';
import {
  generateWhitespaceToken,
  renderWhitespaceToken,
  validateWhitespaceToken,
} from './whitespaceToken.js';
import {
  generateSortingSingle,
  renderSortingSingle,
  validateSortingSingle,
} from './sortingSingle.js';
import {
  generateRadioCheckbox,
  renderRadioCheckbox,
  validateRadioCheckbox,
} from './radioCheckbox.js';
import {
  generateHeaderDerived,
  renderHeaderDerived,
  validateHeaderDerived,
} from './headerDerived.js';
import { generateSortingMulti, renderSortingMulti, validateSortingMulti } from './sortingMulti.js';
import {
  generateHiddenFieldMetadata,
  renderHiddenFieldMetadata,
  validateHiddenFieldMetadata,
} from './hiddenFieldMetadata.js';
import {
  generateHiddenFieldMetadataAuto,
  renderHiddenFieldMetadataAuto,
  validateHiddenFieldMetadataAuto,
} from './hiddenFieldMetadataAuto.js';
import {
  generateTokenAssembly,
  renderTokenAssembly,
  validateTokenAssembly,
} from './tokenAssembly.js';
import { generateTimingWindow, renderTimingWindow, validateTimingWindow } from './timingWindow.js';
import {
  generateRequestIntegrity,
  renderRequestIntegrity,
  validateRequestIntegrity,
} from './requestIntegrity.js';
import { generateAutoFilledJs, renderAutoFilledJs, validateAutoFilledJs } from './autoFilledJs.js';
import { generateSseDelivered, renderSseDelivered, validateSseDelivered } from './sseDelivered.js';
import { generateWsDelivered, renderWsDelivered, validateWsDelivered } from './wsDelivered.js';
import { generateDomShuffling, renderDomShuffling, validateDomShuffling } from './domShuffling.js';
import { generateShadowCanvas, renderShadowCanvas, validateShadowCanvas } from './shadowCanvas.js';
import { generateDecoyInputs, renderDecoyInputs, validateDecoyInputs } from './decoyInputs.js';
import {
  generateSelectorVariant,
  renderSelectorVariant,
  validateSelectorVariant,
} from './selectorVariant.js';

const placeholderValidate = () => false;

export const challengeRuntimes: ChallengeRuntime[] = [
  {
    id: 'whitespace-token',
    title: 'Whitespace Token',
    render: (context: ChallengeContext, state) =>
      renderWhitespaceToken(context, state as { display: string }),
    generate: () => generateWhitespaceToken(),
    validate: (_context, state, payload) =>
      validateWhitespaceToken(state as { token: string }, payload),
  },
  {
    id: 'sorting-single',
    title: 'Sorting Rule (Single Input)',
    render: (context: ChallengeContext, state) =>
      renderSortingSingle(
        context,
        state as { display: number[]; order: string; delimiter: string },
      ),
    generate: () => generateSortingSingle(),
    validate: (_context, state, payload) =>
      validateSortingSingle(
        state as { numbers: number[]; order: string; delimiter: string },
        payload,
      ),
  },
  {
    id: 'sorting-multi',
    title: 'Sorting Rule (Multi Input)',
    render: (context: ChallengeContext, state) =>
      renderSortingMulti(context, state as { display: number[]; order: string }),
    generate: () => generateSortingMulti(),
    validate: (_context, state, payload) =>
      validateSortingMulti(state as { numbers: number[]; order: string }, payload),
  },
  {
    id: 'radio-checkbox',
    title: 'Radio / Checkbox Selection',
    render: (context: ChallengeContext, state) =>
      renderRadioCheckbox(context, state as { options: string[]; correct: string; type: string }),
    generate: () => generateRadioCheckbox(),
    validate: (_context, state, payload) =>
      validateRadioCheckbox(state as { correct: string }, payload),
  },
  {
    id: 'hidden-field-metadata',
    title: 'Hidden Field Metadata',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadata(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: () => generateHiddenFieldMetadata(),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadata(state as { token: string }, payload),
  },
  {
    id: 'hidden-field-metadata-auto',
    title: 'Hidden Field Metadata (Auto)',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadataAuto(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: () => generateHiddenFieldMetadataAuto(),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadataAuto(state as { token: string }, payload),
  },
  {
    id: 'auto-filled-js',
    title: 'Auto-filled JS Values',
    render: (context: ChallengeContext, state) =>
      renderAutoFilledJs(context, state as { value: string }),
    generate: () => generateAutoFilledJs(),
    validate: (_context, state, payload) =>
      validateAutoFilledJs(state as { value: string }, payload),
  },
  {
    id: 'sse-delivered',
    title: 'SSE Delivered Values',
    render: (context: ChallengeContext) => renderSseDelivered(context),
    generate: () => generateSseDelivered(),
    validate: (_context, state, payload) =>
      validateSseDelivered(state as { value: string }, payload),
  },
  {
    id: 'ws-delivered',
    title: 'WebSocket Delivered Values',
    render: (context: ChallengeContext) => renderWsDelivered(context),
    generate: () => generateWsDelivered(),
    validate: (_context, state, payload) =>
      validateWsDelivered(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-a',
    title: 'Selector Variant A',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
        },
      ),
    generate: () => generateSelectorVariant('a'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-b',
    title: 'Selector Variant B',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
        },
      ),
    generate: () => generateSelectorVariant('b'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'dom-shuffling',
    title: 'DOM Shuffling',
    render: (context: ChallengeContext, state) =>
      renderDomShuffling(context, state as { items: { value: string; isTarget: boolean }[] }),
    generate: () => generateDomShuffling(),
    validate: (_context, state, payload) =>
      validateDomShuffling(state as { correct: string }, payload),
  },
  {
    id: 'shadow-canvas',
    title: 'Shadow DOM / Canvas Token',
    render: (context: ChallengeContext, state) =>
      renderShadowCanvas(context, state as { token: string }),
    generate: () => generateShadowCanvas(),
    validate: (_context, state, payload) =>
      validateShadowCanvas(state as { token: string }, payload),
  },
  {
    id: 'decoy-inputs',
    title: 'Decoy Inputs & Layout Traps',
    render: (context: ChallengeContext, state) =>
      renderDecoyInputs(
        context,
        state as { inputs: { name: string; value: string; valid: boolean }[] },
      ),
    generate: () => generateDecoyInputs(),
    validate: (_context, state, payload) =>
      validateDecoyInputs(state as { correct: string }, payload),
  },
  {
    id: 'timing-window',
    title: 'Timing Window',
    render: (context: ChallengeContext, state) =>
      renderTimingWindow(context, state as { minDelayMs: number; maxDelayMs: number }),
    generate: () => generateTimingWindow(),
    validate: (_context, state, payload) =>
      validateTimingWindow(
        state as { createdAt: number; minDelayMs: number; maxDelayMs: number },
        payload,
      ),
  },
  {
    id: 'token-assembly',
    title: 'Token Assembly',
    render: (context: ChallengeContext, state) =>
      renderTokenAssembly(context, state as { parts: { value: string; index: number }[] }),
    generate: () => generateTokenAssembly(),
    validate: (_context, state, payload) =>
      validateTokenAssembly(state as { token: string }, payload),
  },
  {
    id: 'request-integrity',
    title: 'Request Integrity',
    render: (context: ChallengeContext, state) =>
      renderRequestIntegrity(context, state as { nonce: string }),
    generate: () => generateRequestIntegrity(),
    validate: (_context, state, payload) =>
      validateRequestIntegrity(state as { secret: string; nonce: string }, payload),
  },
  {
    id: 'header-derived',
    title: 'Header-derived Value',
    render: (context: ChallengeContext, state) =>
      renderHeaderDerived(context, state as { hint: string }),
    generate: () => generateHeaderDerived(),
    validate: (_context, state, payload) =>
      validateHeaderDerived(state as { value: string }, payload),
  },
];

export const getChallengeRuntimeByIndex = (index: number) => {
  const safeIndex = Math.max(1, index);
  const runtimeIndex = (safeIndex - 1) % challengeRuntimes.length;
  return challengeRuntimes[runtimeIndex];
};

export const getChallengeRuntimeById = (id: string) => {
  return challengeRuntimes.find((runtime) => runtime.id === id) ?? challengeRuntimes[0];
};
