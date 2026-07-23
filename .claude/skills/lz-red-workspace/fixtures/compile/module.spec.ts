import { describe, it, expect } from 'vitest';
import { add } from './module';

describe('add', () => {
  it('passes string arguments where numbers are required', () => {
    // Under tsc --strict this is a type error: 'string' is not assignable to 'number'.
    // (esbuild would strip the types and run it, so the classifier MUST gate on tsc first.)
    expect(add('a', 'b')).toBe('ab');
  });
});
