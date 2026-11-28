---
phase: 17
slug: assertion-design-stance-router-ts-vitest-mechanics
extracted: 2026-07-19
---

# Phase 17 Learnings -- Assertion Design, Stance Router & TS/Vitest Mechanics

## Decisions

### Message-matrix owned source corrected to Metz's "The Magic Tricks of Testing" talk

The query/command message matrix (ASRT-03 / RTR-01) was originally attributed to Metz + Owen's *99
Bottles of OOP*. An execute-time oracle-reviewer, reading the book to EOF, proved the matrix is NOT in
99 Bottles -- it is Sandi Metz's *The Magic Tricks of Testing* talk (corroborated by her POODR
discussion; the command/query vocabulary itself is Fowler's). The leaf's attribution was re-pointed to
the Magic Tricks talk (transcribed into `.oracle/videos/`) and re-gated PASS. *99 Bottles* remains a
legitimately-owned source for test NAMING only. Corrected across message-matrix.md, principle-backing.md,
17-CONTEXT, 16-CONTEXT, PROJECT, REQUIREMENTS.

### No-oracle surfaces upgraded to owned as the source library grew

Once the maintainer provisioned Gary Bernhardt (*Boundaries*) and Kent Beck (*Test Desiderata* essay +
video series) into `.oracle/`, two surfaces authored blind (no-oracle) were upgraded to owned +
oracle-verified: `functional-core.md` (Bernhardt) and the Test Desiderata lens (Beck). The
anti-patterns listen-to-tests + keep-doubles-honest points gained owned Metz (*The Design of Tests*)
backing. Owned tiering is not fixed at authoring time -- it rises as sources are provisioned.

### Deferred lz-refactor "Metz layer"; GREEN/TPP has no Metz source

A 21-talk oracle survey mapped the library to the roadmap: a rich refactor/design/smells layer (Metz
#2/3/4/5/7/16/19/20, Bernhardt, Owen, Beck-design) is deferred as FUT-METZ-REFACTOR (lz-refactor is
shipped). None of the 21 talks is a source for the GREEN / Transformation Priority Premise step.

## Lessons

### Run the direct oracle gate before trusting a source attribution

The milestone research + discuss/plan CONTEXT confidently carried a wrong owned-source attribution (99
Bottles for the matrix) all the way through discuss -> plan -> execute; every upstream doc repeated it.
Only the execute-time oracle-reviewer -- which actually reads the `.oracle` source to EOF -- caught it.
Provenance is not verifiable from planning docs; the clean-room gate is the only check that reads the
book. A "blocked -- source does not contain this material" verdict is as valuable as a fidelity revise:
it stopped a false "owned; oracle-verified" warrant from shipping.

### Some internal IDs in shipped prose are load-bearing Nyquist tokens, not cosmetic

The skill-reviewer flagged internal planning IDs leaking into user-facing reference prose. But the
instrument (`check-red-references.mjs`) asserts some of them as content tokens: `ADV-0` is a required
"ADV forward-pointer" token (regex `/ADV-0|expectTypeOf|fast-check/`), whereas `ASRT-02` is only an
instrument comment. Always check the instrument before "cosmetic" ID cleanup -- and `DST-04` is a
cross-skill convention shared with lz-refactor, so removing it is a 3-skill decision, not a local one.

### Ad-hoc email allowlist-inversion false-positives on `plugin@semver` filenames

The coarse email regex flags `lz-tdd@0.0.2-REQUIREMENTS.md` (a version-scoped filename) and `Pass@1` as
email-shaped. The authoritative `check-hygiene.mjs` gate handles these correctly. Confirm any ad-hoc
allowlist hit against the real gate before treating it as a leak.

## Patterns

### Clean-room re-gate loop on a source correction

On correcting an attribution: re-point the leaf + docs, then re-gate the surface against the CORRECT
`.oracle` source via oracle-reviewer, converge-to-clean. The Test Desiderata surface took one round
(revise: invented tensions didn't match Beck's per-test-kind bundles -> re-authored from the reviewer's
own-words directives -> PASS). Main context never reads `.oracle` prose; only own-words verdicts/directives
cross back.

### Multi-modal oracle survey to map a source library to roadmap phases

Twenty-one talks were triaged with 6 oracle agents in thematic batches (testing / smells-refactoring /
design-messages / principles-POODR / two career-meta scans), each returning per-talk relevance tier +
skill/phase mapping. Career/keynote/meta talks were title-triaged, technical talks oracle-read. Cheap,
parallel, and it surfaced corroborating sources (POODR narrates the same matrix) and the provenance fix.

### Orchestrator drives oracle/skill/verify gates; executor authors blind + deterministic checks

The gsd-executor cannot spawn agents, so all oracle-reviewer / skill-reviewer / verifier gates are
orchestrator-run after the executor returns. Executors author owned surfaces BLIND from the RESEARCH
planning grain and run only the deterministic battery; fidelity is gated afterward.

## Surprises

### The query/command matrix is a talk (Magic Tricks / POODR), not 99 Bottles

Two distinct Metz works were conflated. The correct source is a conference talk the maintainer had to
transcribe into `.oracle/` mid-phase -- the fix depended on expanding the owned-source library, not on
editing the (already-correct) content.

### Spend limit hit mid-gate; failed oracle agents resumed with context intact

The org monthly spend limit terminated two oracle-reviewers mid-run. After reset, SendMessage resumed
each failed agent from its transcript -- they finished their verdicts without re-reading their sources.
The Metz agent had already surfaced the provenance finding before dying.

### Testing content concentrates in 2 of 21 talks

Only *The Magic Tricks of Testing* and *The Design of Tests* are RED-phase testing sources; 6 of 21 are
non-technical (career/keynote/meta); the rest are refactor/design (deferred milestone).
