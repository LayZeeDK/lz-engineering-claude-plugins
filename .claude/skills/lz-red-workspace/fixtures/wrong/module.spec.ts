import { describe, it, expect } from 'vitest';
import { compute } from './module';

describe('compute', () => {
  it('returns 42', () => {
    // compute is undefined at runtime, so calling it throws "compute is not a function"
    // (a TypeError) rather than producing an assertion failure.
    expect(compute()).toBe(42);
  });
});
