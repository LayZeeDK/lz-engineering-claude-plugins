// Fixture: compile_error. The module itself is fine; the SPEC introduces a --strict type error
// (passing strings where numbers are required). grade-red --selfcheck expects compile_error because
// the differential tsc reports NEW errors > 0 -- correctness fails before the runner is consulted.
export function add(a: number, b: number): number {
  return a + b;
}
