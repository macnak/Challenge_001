import { describe, expect, it } from 'vitest';
import { validateHeaderDerived } from '../headerDerived.js';

describe('header derived', () => {
  it('accepts correct header value', () => {
    const result = validateHeaderDerived({ value: 'W/"etag"' }, { answer: 'W/"etag"' });
    expect(result).toBe(true);
  });

  it('rejects incorrect header value', () => {
    const result = validateHeaderDerived({ value: 'W/"etag"' }, { answer: 'bad' });
    expect(result).toBe(false);
  });
});
