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
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Extract the token hidden in whitespace and submit it trimmed.',
    render: (context: ChallengeContext, state) =>
      renderWhitespaceToken(context, state as { display: string }),
    generate: (context) => generateWhitespaceToken(context),
    validate: (_context, state, payload) =>
      validateWhitespaceToken(state as { token: string }, payload),
  },
  {
    id: 'sorting-single',
    title: 'Sorting Rule (Single Input)',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Sort the numbers as instructed and submit them using the required delimiter.',
    render: (context: ChallengeContext, state) =>
      renderSortingSingle(
        context,
        state as { display: number[]; order: string; delimiter: string },
      ),
    generate: (context) => generateSortingSingle(context),
    validate: (_context, state, payload) =>
      validateSortingSingle(
        state as { numbers: number[]; order: string; delimiter: string },
        payload,
      ),
  },
  {
    id: 'sorting-multi',
    title: 'Sorting Rule (Multi Input)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Order the numbers correctly and enter the sequence across the multiple inputs.',
    render: (context: ChallengeContext, state) =>
      renderSortingMulti(context, state as { display: number[]; order: string }),
    generate: (context) => generateSortingMulti(context),
    validate: (_context, state, payload) =>
      validateSortingMulti(state as { numbers: number[]; order: string }, payload),
  },
  {
    id: 'radio-checkbox',
    title: 'Radio / Checkbox Selection',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Choose the option that matches the displayed value and submit it.',
    render: (context: ChallengeContext, state) =>
      renderRadioCheckbox(context, state as { options: string[]; correct: string; type: string }),
    generate: (context) => generateRadioCheckbox(context),
    validate: (_context, state, payload) =>
      validateRadioCheckbox(state as { correct: string }, payload),
  },
  {
    id: 'hidden-field-metadata',
    title: 'Hidden Field Metadata',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Find the hidden field with the specified metadata marker and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadata(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: (context) => generateHiddenFieldMetadata(context),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadata(state as { token: string }, payload),
  },
  {
    id: 'hidden-field-metadata-auto',
    title: 'Hidden Field Metadata (Auto)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit the form; the hidden field with the marker contains the target value.',
    render: (context: ChallengeContext, state) =>
      renderHiddenFieldMetadataAuto(
        context,
        state as {
          token: string;
          marker: { type: string; label: string };
          fields: { name: string; isTarget: boolean }[];
        },
      ),
    generate: (context) => generateHiddenFieldMetadataAuto(context),
    validate: (_context, state, payload) =>
      validateHiddenFieldMetadataAuto(state as { token: string }, payload),
  },
  {
    id: 'auto-filled-js',
    title: 'Auto-filled JS Values',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Read the auto-populated value and submit it as-is.',
    render: (context: ChallengeContext, state) =>
      renderAutoFilledJs(context, state as { value: string }),
    generate: (context) => generateAutoFilledJs(context),
    validate: (_context, state, payload) =>
      validateAutoFilledJs(state as { value: string }, payload),
  },
  {
    id: 'sse-delivered',
    title: 'SSE Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Connect to the SSE stream and submit the delivered value.',
    render: (context: ChallengeContext) => renderSseDelivered(context),
    generate: (context) => generateSseDelivered(context),
    validate: (_context, state, payload) =>
      validateSseDelivered(state as { value: string }, payload),
  },
  {
    id: 'ws-delivered',
    title: 'WebSocket Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Open the WebSocket, request the challenge value, and submit the response.',
    render: (context: ChallengeContext) => renderWsDelivered(context),
    generate: (context) => generateWsDelivered(context),
    validate: (_context, state, payload) =>
      validateWsDelivered(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-a',
    title: 'Selector Variant A',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Locate the element by the provided selector type and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
          decoys: string[];
        },
      ),
    generate: (context) => generateSelectorVariant(context, 'a'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'selector-variant-b',
    title: 'Selector Variant B',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Locate the element by the provided selector type and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderSelectorVariant(
        context,
        state as {
          value: string;
          selectorType: 'data-key' | 'aria-label' | 'data-testid';
          stableKey: string;
          decoys: string[];
        },
      ),
    generate: (context) => generateSelectorVariant(context, 'b'),
    validate: (_context, state, payload) =>
      validateSelectorVariant(state as { value: string }, payload),
  },
  {
    id: 'dom-shuffling',
    title: 'DOM Shuffling',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Find the element marked with the target attribute and submit its text.',
    render: (context: ChallengeContext, state) =>
      renderDomShuffling(context, state as { items: { value: string; isTarget: boolean }[] }),
    generate: (context) => generateDomShuffling(context),
    validate: (_context, state, payload) =>
      validateDomShuffling(state as { correct: string }, payload),
  },
  {
    id: 'shadow-canvas',
    title: 'Shadow DOM / Canvas Token',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Extract the token from the canvas or DOM and submit it.',
    render: (context: ChallengeContext, state) =>
      renderShadowCanvas(context, state as { token: string }),
    generate: (context) => generateShadowCanvas(context),
    validate: (_context, state, payload) =>
      validateShadowCanvas(state as { token: string }, payload),
  },
  {
    id: 'decoy-inputs',
    title: 'Decoy Inputs & Layout Traps',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Identify the valid input by its marker and submit its value.',
    render: (context: ChallengeContext, state) =>
      renderDecoyInputs(
        context,
        state as { inputs: { name: string; value: string; valid: boolean }[] },
      ),
    generate: (context) => generateDecoyInputs(context),
    validate: (_context, state, payload) =>
      validateDecoyInputs(state as { correct: string }, payload),
  },
  {
    id: 'timing-window',
    title: 'Timing Window',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit within the required time window with the expected value.',
    render: (context: ChallengeContext, state) =>
      renderTimingWindow(context, state as { minDelayMs: number; maxDelayMs: number }),
    generate: (context) => generateTimingWindow(context),
    validate: (_context, state, payload) =>
      validateTimingWindow(
        state as { createdAt: number; minDelayMs: number; maxDelayMs: number },
        payload,
      ),
  },
  {
    id: 'token-assembly',
    title: 'Token Assembly',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Assemble the token in order using the data-order attribute and submit it.',
    render: (context: ChallengeContext, state) =>
      renderTokenAssembly(context, state as { parts: { value: string; index: number }[] }),
    generate: (context) => generateTokenAssembly(context),
    validate: (_context, state, payload) =>
      validateTokenAssembly(state as { token: string }, payload),
  },
  {
    id: 'request-integrity',
    title: 'Request Integrity',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Compute the HMAC using the SSE secret and the nonce, then submit it.',
    render: (context: ChallengeContext, state) =>
      renderRequestIntegrity(context, state as { nonce: string }),
    generate: (context) => generateRequestIntegrity(context),
    validate: (_context, state, payload) =>
      validateRequestIntegrity(state as { secret: string; nonce: string }, payload),
  },
  {
    id: 'header-derived',
    title: 'Header-derived Value',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Use the hinted response header value as the answer.',
    render: (context: ChallengeContext, state) =>
      renderHeaderDerived(context, state as { hint: string }),
    generate: (context) => generateHeaderDerived(context),
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
