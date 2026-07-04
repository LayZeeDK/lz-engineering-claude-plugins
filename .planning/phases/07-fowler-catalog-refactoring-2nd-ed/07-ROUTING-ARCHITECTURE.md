# Phase 7 Routing Architecture (LOCKED 2026-07-04)

**Status:** LOCKED via interactive discuss. Supersedes CONTEXT.md D-01 (split), D-04 (smells),
D-06 (provenance) and the 66-entry scope. To be reconciled into CONTEXT.md, REQUIREMENTS.md
(FWL-01/02), ROADMAP.md (Phase 7 SC), the plans (07-02..07-08), and the Wave-1 harness during the
scope-correction replan. This file is the canonical record of the routing design; downstream
authoring plans MUST follow it.

## Scope: 62 refactorings

66 web-catalog entries minus the 4 web-only entries that are 1st-edition relics (in 1st ed, dropped
from 2nd-ed print AND e-book), keeping the 1 genuinely-new web-only entry.

- **CUT (4, 1st-ed relics):** Replace Magic Literal (<- Replace Magic Number with Symbolic
  Constant), Replace Control Flag with Break (<- Remove Control Flag), Replace Error Code with
  Exception (in 1st ed, same name), Replace Exception with Precheck (<- Replace Exception with Test).
  Owner-confirmed: Replace Error Code with Exception IS in 1st ed.
- **KEEP (1, genuinely new):** Return Modified Value -- not in 1st ed; labeled `[web-only]`, verified
  against the owner's WEB edition (not the e-book).
- Result: **61 e-book-verified + Return Modified Value (web-edition-verified) = 62.**
- Split Phase stays (a real 2nd-ed refactoring); only its extended examples are online -> small
  provenance note on its example.

Rule applied (owner's): cut refactorings that were in Refactoring 1st ed but not 2nd ed; keep truly
web-only ones.

## Structure (uniform: two index+leaves catalogs + principles)

```
plugins/lz-tdd/skills/lz-refactor/references/
  fowler-catalog/
    README.md                 INDEX (name axis): 62 entries grouped by the 7 book chapters,
                              each row = name + 1st-ed alias(es) + mirrored `Use when:` line + link
    <refactoring>.md          LEAF (x62): Use-when + motivation + mechanics + TS before/after + provenance
  smells.md                   INDEX (smell axis): navigation ONLY -- per smell: `recognize by:` + link
                              (no candidates here; forces confirm-via-leaf). All 24, scannable.
  smells/
    <smell>.md                LEAF (x24): Recognize-by + how-to-recognize (confirm) + why +
                              candidate refactorings (each: link + "pick when <discriminator>")
  principles.md               Fowler Ch.2: definition, two hats, when-to-refactor triggers,
                              performance, YAGNI. Triggers LINK to their typical refactorings (routes,
                              not only explains). Single doc (bounded, interrelated).
```

SKILL.md is NOT retouched: its existing pointers `references/fowler-catalog/README.md`,
`references/smells.md`, `references/principles.md` all still resolve (smells leaves live in a sibling
`references/smells/` dir; the index stays at `references/smells.md`).

## Content contracts

**Refactoring leaf** (`fowler-catalog/<refactoring>.md`):
- `# <Name>` + 1st-ed alias(es) if any
- `Use when:` one line -- the SITUATION/seam that calls for it (serves smell-adjacent selection AND
  preparatory matching); MIRRORED verbatim into the catalog index row
- `## Motivation` / `## Mechanics` (distilled, original words) / `## Example` (TS before->after, both
  `tsc --strict`-clean) / provenance label if `[web-only]` / `[web-example]`

**Catalog index** (`fowler-catalog/README.md`): 7 chapter headings; per entry = name + alias(es) +
mirrored `Use when:` + link. Name/alias -> leaf resolver (reference mode) and browse/preparatory
matcher (Use-when).

**Smell leaf** (`smells/<smell>.md`):
- `# <Smell>` + `Recognize by:` one line (mirrored into the smell index)
- `## How to recognize` (fuller -- CONFIRM the fuzzy index match, separate near-neighbors)
- `## Why it's a problem`
- `## Candidate refactorings` -- each: link to a `fowler-catalog` leaf + "pick when <smell-specific
  discriminator>". THIS is where the smell->refactoring map lives.

**Smell index** (`smells.md`): navigation only -- per smell: `### <Smell>  -- recognize by: <line>` +
link to the leaf. No candidates (deliberately, so it can't shortcut the confirm step).

**Principles** (`principles.md`): Ch.2 topics; when-to-refactor triggers each link to their typical
refactorings (comprehension -> Rename/Extract Function/Extract Variable/Decompose Conditional;
litter-pickup -> the small tidy set; rule of three -> Duplicated Code smell; preparatory -> "match
the seam via catalog Use-when").

## Flows (all land on the same catalog leaves)

| Entry | Router | Path | Reads |
|-------|--------|------|-------|
| Symptom (smell) -- coach | `smells.md` recognize-by (fuzzy) | index -> smell leaf (confirm + candidates) -> refactoring leaf | 3 |
| Preparatory (intended change) | catalog index `Use when` (match the seam) | index -> refactoring leaf | 2 |
| Comprehension / litter-pickup | `principles.md` trigger -> workhorse set | principles -> refactoring leaf | 2 |
| Rule of three (duplication) | `smells.md` (Duplicated Code) | index -> smell leaf -> refactoring leaf | 3 |
| Explain by name -- reference | index (name/alias, exact) | index -> leaf | 2 (1 for principles) |

Key asymmetry: coach entry is FUZZY (recognize-by) so it needs the smell-leaf CONFIRM tier before
acting; reference/preparatory entries are exact/goal-matched so they resolve index -> leaf with no
confirm tier. No router ever loads a sibling leaf; selection is always via a one-line selector
(`Use when:` on the refactoring axis, `recognize by:` on the smell axis).

## Validation (harness) implications

- `check-catalog`: assert 62 refactoring leaves present (by canonical name); each leaf has a
  `Use when:` line + Motivation/Mechanics/Example; each index row mirrors the leaf's `Use when:` and
  links resolve; Return Modified Value tagged `[web-only]`, Split Phase example `[web-example]`.
- `check-smells`: assert 24 smell leaves, each with `Recognize by:` + a Candidate-refactorings
  section whose links resolve to real catalog leaves; smell index has recognize-by + resolving leaf
  link per smell.
- `check-principles`: Ch.2 topic presence + trigger->refactoring links resolve.
- `check-hygiene`: ASCII-only, no work-email, no verbatim Fowler/GoF prose or code (DST-04).

## Downstream

- **Phase 8 (Kerievsky):** folds into this cleanly -- new `smells/<smell>.md` leaves + source-tagged
  index rows for Ch.4 smells; Kerievsky refactorings cross-map to these catalog leaves.
- **Phase 9 (coach behavior):** wires the MATCHING judgment (recognize-by -> smell, intended-change
  -> Use-when, reason -> workhorses) and mode detection (apply=coach vs explain=reference). Phase 7
  authors only the content that makes that routing possible.
