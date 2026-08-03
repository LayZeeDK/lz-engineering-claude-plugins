import { describe } from 'vitest';

// Fixture: no_tests. The suite loads cleanly but declares NO it()/test() bodies, so zero
// assertions are collected. grade-red --selfcheck expects no_tests (a produced "test" file that
// asserts nothing is not a genuinely-red test).
describe('notest', () => {
  // intentionally empty: no it()/test() calls
});
