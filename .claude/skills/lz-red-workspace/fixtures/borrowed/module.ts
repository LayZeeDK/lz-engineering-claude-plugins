// Fixture: the BORROWED-FAILURE false-PASS shape (the D-06 hole the k=1 with_skill pilot exposed).
// The module is already correct, so any honest new test of it PASSES -- the produced test in
// module.spec.ts is a false green. What makes this fixture the regression guard is the spec it is
// appended to: that file already contains a permanently failing placeholder, exactly like the kata's
// own test/vitest/gilded-rose.spec.ts.
export function add(a: number, b: number): number {
  return a + b;
}
