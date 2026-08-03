// Fixture: wrong_reason. tsc --strict clean, but the exported binding is actually undefined at
// runtime (typed as a callable via a cast). Calling it in the test throws a runtime TypeError
// ("is not a function") -- NOT an assertion failure. Proves the classifier's wrong_reason branch:
// a runtime/type error masquerading as a test failure must NOT be scored genuinely_red.
export const compute = undefined as unknown as () => number;
