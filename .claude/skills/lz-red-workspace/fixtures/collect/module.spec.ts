import { describe, it, expect } from 'vitest';

// Fixture: collection_error. A top-level access that throws at LOAD time (before any test body
// runs), so the suite fails to COLLECT and the runner reports no assertionResults. Kept tsc --strict
// clean by casting an actually-undefined value to a typed shape, so this is NOT a compile_error --
// it is a runner-side collection failure, distinct from wrong_reason (which throws INSIDE an it()).
const broken = (undefined as unknown as { value: number }).value;

describe('collect', () => {
  it('never runs because collection already threw', () => {
    expect(broken).toBe(1);
  });
});
