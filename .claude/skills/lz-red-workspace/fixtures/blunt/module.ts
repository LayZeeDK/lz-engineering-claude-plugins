// Fixture: blunt_red. A DELIBERATE production-side placeholder -- correct signature, declared
// return type, nothing behind it -- that throws a not-implemented Error. tsc --strict clean, which
// matters: a placeholder that does not compile is compile_error at classify() branch 1, never a
// blunt red.
//
// The skill under test ranks an AssertionError as the SHARPEST form of RED and a not-implemented
// throw as "a valid but blunter red". Before D-05 the gate scored this shape wrong_reason -- it
// matched neither ASSERTION_RE nor RUNTIME_RE, so rightReason was false by fail-closed default and
// the arm was penalised for obeying the skill being measured. This fixture is the EMPIRICAL pin
// that vitest 4.1.10 really does emit the message-plus-stack shape the blunt-red predicate reads.
export function correlationId(header: string): string {
  throw new Error('correlationId is not implemented');
}
