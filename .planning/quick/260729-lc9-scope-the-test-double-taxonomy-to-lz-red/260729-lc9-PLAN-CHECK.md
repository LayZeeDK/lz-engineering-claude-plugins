# 260729-lc9 -- Plan-checker findings (iteration 1)

**Ran:** 2026-07-29, gsd-core:gsd-plan-checker
**Verdict:** ISSUES FOUND -- 2 BLOCKER, 5 IMPORTANT, 6 MINOR
**Plan checked:** `260729-lc9-PLAN.md`, 726 lines, 4 tasks, 9 new guards, 58 retirements
**Status: EXECUTION NOT STARTED.** Paused at the owner's instruction before the revision loop.

---

## Evidence the checker observed (not asserted)

All four verify blocks were run verbatim against the unmodified tree. Every one FAILS, which is
the required property.

| Block | PLAN.md | Exit on unmodified tree | Chaining |
|---|---|---|---|
| Task 1 | :260 | 1 | 8x `&&`, zero `;` |
| Task 2 | :337 | 1 | 9x `&&`, zero `;` |
| Task 3 | :519 | 1 | 12x `&&`, zero `;` |
| Task 4 | :628 | 1 | 12x `&&`, zero `;` |

Baseline: battery exit 0, 175 emitted lines, roster reports 174; selftest exit 0;
`claude plugin validate .` exit 0.

**Retirement arithmetic independently reproduced and CORRECT.** 58 labels, 0 duplicates,
0 mismatches, each matching an emitted line verbatim. Reverse direction clean -- no taxonomy-coupled
emitted label missing from the list. `174 - 58 + 9 = 125` holds. `NEW_LABELS` 34 -> 13 holds.

**Ordering hazard H1 HOLDS.** Re-measured `plugins/`: 197 files, 1014 inline links, 984 relative,
30 anchor, 0 scheme, 0 fenced, exactly 2 unresolved -- both `test-double-taxonomy.md:289 ->
principle-backing.md` in the lz-refactor and lz-tpp copies. Task 1 captures that baseline before
Task 3 deletes them.

**Proof kinds clean.** No guard is asked for both. N1 invariant-GREEN with fixtures; N2-N9
RED-at-baseline, all eight confirmed genuinely RED today.

**Escaped pipes:** `.planning/research/STACK.md` has exactly 3 rows a naive splitter calls ragged
(lines 26, 126, 127). `plugins/` has 0. This is why `scanTables` and `parseRows` must share ONE
escaped-pipe-aware splitter -- if they disagree on a row's width, the guard passes while the parser
silently skips the row, which is the exact evasion class the instrument exists to close.

---

## BLOCKER-1: Task 4's verify has no leg for C-B1

`PLAN.md:628`. The 12-leg chain checks the inert header, the D-11 clause, the four swept claims,
the email scan, the battery, the selftest, `plugin validate` and `git status`. **Nothing references
the Beck attribution.** An executor who does every other Task 4 edit and skips section B exits 0.
`<done>` asserts it in prose only, and no retired guard covers it -- all taxonomy guards are gone by
Task 3, and N1 checks only table shape.

C-B1 is step 1 of the eight and is locked by D-07 as "fix now, regardless".

Measured: the wrong-source phrase occurs exactly once today. All three dependents name the same
replacement surface -- `principle-backing.md:85`, `beck-tdd-by-example.md:26`, `:83`.

Fix -- append to the Task 4 chain:
```
&& ! rg -q 'report and essays cited in his rows above' .planning/research/test-double-taxonomy.md \
&& rg -q 'TDD is Kanban for Code' .planning/research/test-double-taxonomy.md
```

## BLOCKER-2: the H4 blast radius is measurably wrong; pins cover 3 of 9 named sites

`PLAN.md:306-311`, under a heading reading "BLAST RADIUS, MEASURED -- do not exceed it", claims
"the one warranted double" has NINE sites and EIGHT are correct. Measured live:

- `warranted double` literal: **5 lines in 4 files** -- `anti-patterns.md:38,166`;
  `test-structure-and-assertions.md:130`; `message-matrix.md:79,137`.
- `the one warranted double` exact: **4 lines**.
- Four cited lines carry no form of the phrase at all: `anti-patterns.md:128` ("the one warranted
  BOUNDARY"), `message-matrix.md:57` ("the ONE cell that WARRANTS A double"), `message-matrix.md:73`
  ("only one of them WARRANTS A double"), `vitest-typescript-mechanics.md:66` ("genuinely WARRANTS A
  double").

The two verify pins at `:337` are numerically correct but pin only 3 of the 9 named non-target
sites. `message-matrix.md:73`, `:79`, `anti-patterns.md:128` and `vitest-typescript-mechanics.md:66`
are unpinned, so a rename at any of them passes both Task 2's verify and the battery. The plan
itself calls these pins "the ONLY protection" against the D-06 over-wide-rename hazard.

Secondary wrong number, stated twice (`:310`, `:350`): `check-red-references.mjs:209` has **five**
`expect-to-send` sites, not six -- `message-matrix.md:54,79,81,92,137`.

Fix: replace the enumeration with the measured set; state that `message-matrix.md:137` is the only
literal-phrase site in scope and `:57` is edited for its label word not the phrase; correct six to
five; extend pins to the two unpinned files carrying a variant.

---

## IMPORTANT

1. **`test -f` on RED-BASELINE.md is existence-only** (`:260` last leg). That file carries the proof
   kind and evidence for all nine guards -- the entire falsifiability record. `touch` satisfies it.
   Fix: assert the nine `[lc9]` labels and both proof-kind strings are present.

2. **Task 1 D demands a `file:line` for every RED-at-baseline guard; four cannot have one**
   (`:251-256`). N4, N7, N8, N9 are presence-required guards whose baseline RED is a measured
   zero-count, not a located hit. Unsatisfiable as written -- the same self-contradiction shape that
   cost a prior round a cycle. Fix: for presence-required guards the evidence is "phrase absent from
   `<file>`, measured count 0".

3. **The public-repo hygiene leg is fail-open and narrower than its stated threat** (`:628` leg 9,
   action `:622-624`, threat T-lc9-01 `:662`). Run verbatim against the not-yet-existing archive
   path it exits 0 -- `git grep` writes its fatal to stderr and nothing to stdout, so `wc -l` is 0.
   Control against a tracked file containing an email exits 1. So it discriminates only when its
   subject is tracked. Scope is also short: the threat names 4 commit messages, the verify covers one
   file and no commit message, and AGENTS.md requires allowlist-inversion rather than
   zero-tokens-in-one-file. This repo has a recorded twice-recurring leak of exactly this class.

4. **Task 1 writes tree-dependent numbers that Task 3 falsifies, and Task 3's sweep omits them**
   (`:203-204`). N2's comment records 1014/984/30 links -- exact today, but with the three copies
   removed it becomes 194 files / 990 / 981 / **9** anchor. Task 3 step 8 sweeps `:20-23`, `:35-37`,
   `:669-679` and the SUMMARY string, not the N1/N2 comments Task 1 just added. This is the plan
   reintroducing, inside its own instrument, the exact class its step-6 sweep exists to close.

5. **N9's label overclaims relative to its needle** (`:227-228`). Label says "inline in the coach
   procedure"; the needle scans the whole of `lz-red/SKILL.md`. An appendix placement satisfies it.
   `.continue-here.md:53` lists "needle outlives its subject" as a BLOCKING anti-pattern.

## MINOR

1. `:551` says write "ARCHIVED RECORD"; `:628` requires literal uppercase `INERT RECORD`. Fails
   closed but costs a cycle.
2. D-11's substantive half is ungated -- `:628` checks the clause is restored but nothing checks the
   `:106` scoping, which the plan itself calls the entire warrant for section 2's ruling.
3. `:181-183` front-loads the `pipe-table.mjs` header rewrite into Task 1, which does not touch
   `plugins/`; for commits 1 and 2 it would describe a scope that is not yet true.
4. `:352-354` attributes shape protection to the wrong control -- a stray in-cell pipe keeps the
   pipe-line count at 37 while widening the row. The real control is N1.
5. Nothing gates D-04 mechanically; `git status` empty does not prove `.claude/agents/` was
   untouched.
6. **No task owns committing the planning artifacts**, yet Task 4's final leg requires
   `git status --porcelain` empty. CONTEXT.md, PLAN.md, RESEARCH.md and this file appear in no
   task's `<files>` and no commit message.

---

## What passed

All eight boundary steps covered. D-01 through D-12 honored, including D-12 -- lz-red ends with the
inline rule and no reference file, enforced by N3 plus a `git grep -c` leg, and the runtime artifact
is explicitly not authored. Every `file:line` citation checked resolves. The three negative-assertion
needles in Task 4 all match today, so none is vacuous. G17's 10/3/177 before-and-after claim is
exact. The proposed replacement router sentences do not trip G17's `BARE_WORD_RE`. Plan is pure
ASCII, uses `git grep`/`rg` throughout, no fail-open `2>/dev/null || echo` assignments.
