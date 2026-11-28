// Fixture: genuinely_red. A compiling stub with a WRONG body (it subtracts instead of adding).
// grade-red --selfcheck expects this to classify as genuinely_red: tsc --strict clean AND an
// ASSERTION failure on current code (not a compile/setup error, not a false green). A benign
// compiling stub that keeps the test red is NOT a fault (Law 2 / RESEARCH Pitfall 9).
export function add(a: number, b: number): number {
  return a - b;
}
