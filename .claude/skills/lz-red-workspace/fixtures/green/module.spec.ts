import { describe, it, expect } from 'vitest';
import { add } from './module';

describe('add', () => {
  it('returns the sum of its two arguments', () => {
    expect(add(2, 3)).toBe(5);
  });
});
