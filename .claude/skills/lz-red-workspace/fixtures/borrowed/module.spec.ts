import { describe, it, expect } from 'vitest';
import { add } from './module';

describe('add', () => {
  // PRE-EXISTING, and permanently failing -- the stand-in for the kata's `should foo` placeholder,
  // which asserts 'fixme' and has never passed. It is NOT in this fixture's diff.patch, so the gate
  // must never let its failure count as the produced test's RED.
  it('should foo', () => {
    expect('foo').toBe('fixme');
  });

  // The PRODUCED test -- the only one diff.patch adds. It PASSES on current code, so this run is a
  // false green. Pre-attribution the gate saw ">= 1 assertion failed, every failure is an assertion
  // error" and scored it genuinely_red / pass:true on the placeholder's failure above.
  it('returns the sum of its two arguments', () => {
    expect(add(2, 3)).toBe(5);
  });
});
