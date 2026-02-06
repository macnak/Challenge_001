import type { ChallengeDefinition, ChallengeContext } from './types.js';

const challenges: ChallengeDefinition[] = [
  {
    id: 'whitespace-token',
    title: 'Whitespace Token',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Whitespace Token</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sorting-single',
    title: 'Sorting Rule (Single Input)',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Sorting (Single Input)</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sorting-multi',
    title: 'Sorting Rule (Multi Input)',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Sorting (Multi Input)</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'radio-checkbox',
    title: 'Radio / Checkbox Selection',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Selection</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'hidden-field-metadata',
    title: 'Hidden Field Metadata',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Hidden Field Metadata</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'auto-filled-js',
    title: 'Auto-filled JS Values',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Auto-filled Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'sse-delivered',
    title: 'SSE Delivered Values',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: SSE Delivered Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'ws-delivered',
    title: 'WebSocket Delivered Values',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: WebSocket Delivered Values</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'dom-shuffling',
    title: 'DOM Shuffling',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: DOM Shuffling</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'shadow-canvas',
    title: 'Shadow DOM / Canvas Token',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Shadow DOM / Canvas Token</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'decoy-inputs',
    title: 'Decoy Inputs & Layout Traps',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Decoy Inputs</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'timing-window',
    title: 'Timing Window',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Timing Window</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'token-assembly',
    title: 'Token Assembly',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Token Assembly</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'request-integrity',
    title: 'Request Integrity',
    render: ({ index }: ChallengeContext, _state) => `
      <h1>Challenge ${index}: Request Integrity</h1>
      <p class="muted">Placeholder page. Challenge logic to be implemented.</p>
    `,
  },
  {
    id: 'header-derived',
    title: 'Header-derived Value',
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
