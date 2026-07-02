# Quick Task: Triage lz-tpp doc-quality review

Audit and triage a 5-finding code-quality review of the `lz-tpp` skill branch;
apply the clear-cut findings and surface the discretionary ones.

## Findings and disposition

1. `typescript-and-tco.md` Pattern 3 (CPS) over-delivers vs its own MENTION contract
   (`:248-255` table vs `:347-398` full teach). -> APPLY: collapse to a mention.
2. Planning IDs `(D-03)` / `(D-06)` leak into shipped `transformations.md:153,:204`.
   -> APPLY: strip parentheticals. Also fixes the unshipped `.planning/` path leaked at
   `:223-224` (same distribution-boundary class; missed by the report).
3. `transformations.md` provenance/meta volume. -> PARTIAL/DEFER: report's "60% meta" is
   overstated (FibTPP revisions = ordering rationale; secondary-drift = guard; Sources =
   faithful citation). Only the production-note blockquote + NDC-transcript reconciliation
   are true audit-trail. Section-move is discretionary -> user decision.
4. TS/JS overlay stated twice in `SKILL.md` (`:53-55` step 5 and `:73-78` section).
   -> APPLY: delete standalone section, graft "not a contradiction" clause into step 5.
5. 59 `.planning/` files in public repo. -> DEFER: deliberate hygiene question; gitignore
   would not scrub existing history and would break GSD shared state -> user decision.

## Applied

Findings 1, 2, 4 (plus the `:223-224` leak).

## Deferred (awaiting user decision)

- Finding 3: how much provenance to move out of the shipped reference.
- Finding 5: keep vs gitignore (+/- scrub) `.planning/`.
