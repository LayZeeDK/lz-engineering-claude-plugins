// Fixture: false_green. The module is already correct, so the natural test passes immediately.
// grade-red --selfcheck expects false_green (all assertions pass AND the diff touches only test
// files). A false green does not count as a RED pass under D-06.
export function add(a: number, b: number): number {
  return a + b;
}
