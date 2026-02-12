import type { ChallengeDefinition, ChallengeContext } from './types.js';

const challenges: ChallengeDefinition[] = [
  {
    id: 'whitespace-token',
    title: 'Whitespace Token',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Extract the token hidden in whitespace and submit it trimmed.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Whitespace Token</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sorting-single',
    title: 'Sorting Rule (Single Input)',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Sort the numbers as instructed and submit them using the required delimiter.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Sorting (Single Input)</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sorting-multi',
    title: 'Sorting Rule (Multi Input)',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Order the numbers correctly and enter the sequence across the multiple inputs.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Sorting (Multi Input)</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'radio-checkbox',
    title: 'Radio / Checkbox Selection',
    toolAffinity: 'either',
    difficulty: 'easy',
    explain: 'Choose the option that matches the displayed value and submit it.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Selection</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'hidden-field-metadata',
    title: 'Hidden Field Metadata',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Find the hidden field with the specified metadata marker and submit its value.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Hidden Field Metadata</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'auto-filled-js',
    title: 'Auto-filled JS Values',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Read the auto-populated value and submit it as-is.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Auto-filled Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sse-delivered',
    title: 'SSE Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Connect to the SSE stream and submit the delivered value.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: SSE Delivered Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'ws-delivered',
    title: 'WebSocket Delivered Values',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Open the WebSocket, request the challenge value, and submit the response.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: WebSocket Delivered Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'dom-shuffling',
    title: 'DOM Shuffling',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Find the element marked with the target attribute and submit its text.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: DOM Shuffling</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'shadow-canvas',
    title: 'Shadow DOM / Canvas Token',
    toolAffinity: 'browser',
    difficulty: 'grand-master',
    explain: 'Extract the token from the canvas or DOM and submit it.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Shadow DOM / Canvas Token</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'decoy-inputs',
    title: 'Decoy Inputs & Layout Traps',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Identify the valid input by its marker and submit its value.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Decoy Inputs</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'timing-window',
    title: 'Timing Window',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Submit within the required time window with the expected value.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Timing Window</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'token-assembly',
    title: 'Token Assembly',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Assemble the token in order using the data-order attribute and submit it.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Token Assembly</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'request-integrity',
    title: 'Request Integrity',
    toolAffinity: 'browser',
    difficulty: 'advanced',
    explain: 'Compute the HMAC using the SSE secret and the nonce, then submit it.',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Request Integrity</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'header-derived',
    title: 'Header-derived Value',
    toolAffinity: 'either',
    difficulty: 'medium',
    explain: 'Use the hinted response header value as the answer.',
    render: ({ index }: ChallengeContext) => `
      <h1>Challenge ${index}: Header-derived Value</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
];

export const getChallengeByIndex = (index: number) => {
  const safeIndex = Math.max(1, index);
  const challengeIndex = (safeIndex - 1) % challenges.length;
  return challenges[challengeIndex];
};

export const renderChallenge = (context: ChallengeContext) => {
  const challenge = getChallengeByIndex(context.index);
  return challenge.render(context, {});
};
