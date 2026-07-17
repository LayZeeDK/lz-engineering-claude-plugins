# Phase 14 -- Head-to-head: lz-refactor vs mattpocock-skills code-review

**Date:** 2026-07-15
**Skills compared:** `/lz-tdd:lz-refactor` (this repo, recommend / smell-scan coach mode) vs
`/mattpocock-skills:code-review` (third-party, v1.2.0)
**Model / config:** `claude-opus-4-8 @ high`, `--setting-sources project`, recommend mode (read-only),
k=3 serial, synthetic whole-file-diff baseline. PONYTAIL off; MCP + user-plugins stripped except the
plugin under test.
**Arms:** `lz-refactor` = run-e2e arm `invoke_skill` (`/lz-tdd:lz-refactor`, Edit/Write/Bash blocked);
`code_review` = run-e2e arm `code_review` (`/mattpocock-skills:code-review <synthetic-root-sha>`, its
own Bash + sub-agent tool profile).
**Corpus (3 cells x 2 arms x k=3 = 18 runs, all exit 0):**

| Cell | Suite | Target | File | Character |
|------|-------|--------|------|-----------|
| cr-emb | e2e-nx | T1 | packages/eslint-plugin/src/rules/enforce-module-boundaries.ts | mechanical (Long Function, dup, conditional complexity) |
| cr-rlu | e2e-nx | T3/T4 | packages/eslint-plugin/src/utils/runtime-lint-utils.ts | functional / FP (loop->pipeline, reduce->Map) |
| cr-gr | e2e-gilded-rose | G1 | app/gilded-rose.ts | pattern-directed (conditional complexity, primitive obsession) |

**Borrowed repos:** nx `D:/projects/github/nrwl/nx @ origin/23.0.x`; kata
`D:/projects/github/emilybache/GildedRose-Refactoring-Kata @ main`. Both left pristine (no `review-*`
branch/worktree; `git status` clean).
**Run artifacts:** `.claude/skills/lz-refactor-workspace/e2e-{nx,gilded-rose}/results/recommend/<arm>/<cell>/run-<k>/`
(`answer.md` + `meta.json`; raw `outputs/` gitignored).
**Grading channel (DST-04):** book-authenticity + idiom/pattern fidelity graded by the `oracle` agent
against the git-ignored `.oracle/` books (Fowler / Kerievsky / GoF); main context never read book prose;
verdicts are the agent's own words. Mechanical dimensions come from `tabulate-mechanical.mjs` over the run
`meta.json`. Grading records: `grading/head-to-head/{mechanical,claims,fidelity,summary}.json`.

---

## 1. Lift (distinct actionable named refactorings/smells per invocation)

MECHANICAL heuristic = distinct named Fowler/Kerievsky refactorings matched in `answer.md` (word-bounded).

| Cell | lz-refactor (mean / union / Pass@1) | code_review (mean / union / Pass@1) |
|------|--------------------------------------|--------------------------------------|
| cr-emb | 4.67 / 11 / 1.00 | 0 / 0 / 0.00 |
| cr-rlu | 7.33 / 12 / 1.00 | 0 / 0 / 0.00 |
| cr-gr | 8.00 / 12 / 1.00 | 0 / 0 / 0.00 |

**Finding:** lz-refactor surfaces 11-12 distinct NAMED refactorings per cell; code_review scores 0 on the
named-refactoring heuristic -- NOT because it found nothing, but because it names *smells* + prose fixes,
not canonical named refactorings (see the idiom/pattern axis). Read this as vocabulary shape, not "found
nothing".

## 2. Token usage / cost (headline = total_cost_usd + model_usage; rolls up sub-agents, A1)

| Cell | lz-refactor $/run | code_review $/run | delta |
|------|-------------------|-------------------|-------|
| cr-emb | 0.660 | 0.949 | code_review +44% |
| cr-rlu | 0.488 | 0.854 | code_review +75% |
| cr-gr | 0.569 | 1.043 | code_review +83% |

**Finding:** lz-refactor is cheaper on every cell (~30-45% of the delta from code_review's extra Bash +
sub-agent turns). Main-context `input/output_tokens` would understate code_review because its sub-agent
tokens live only in `model_usage`/`total_cost_usd` -- so cost is the fair cross-arm headline.

## 3. Tool usage + sub-agent spawn count

| Cell | lz-refactor (tools / spawns) | code_review (tools / spawns) |
|------|------------------------------|------------------------------|
| cr-emb | Glob 4, Read 18 / 0 | Bash 14, Read 5, Agent 3 / 1 per run |
| cr-rlu | Read 8, Glob 3 / 0 | Bash 14, Glob 2, Agent 3, Read 4 / 1 per run |
| cr-gr | Glob 11, Read 13, PowerShell 3 / 0 | Bash 16, Agent 6, ToolSearch 1, Read 2, Glob 2 / 2 per run |

**Finding:** code_review drives git via Bash and spawns 1-2 sub-agents per run (its Standards / Spec
parallel agents); lz-refactor recommend is a single read-only context with 0 spawns. The 1-2-vs-0 spawn
asymmetry is a structural property of code-review's two-axis design (D-04) -- reported, not equalized.

## 4. Output quality (usefulness / accuracy / actionability, judged vs targets.json)

| Cell | lz-refactor | code_review |
|------|-------------|-------------|
| cr-emb | high | high (uneven) -- caught a real regex bug lz-refactor missed |
| cr-rlu | high | medium |
| cr-gr | high | medium-high -- Spec axis verified kata faithfulness |

**Finding:** lz-refactor gives the deeper, sequenced refactoring plan; code_review is thinner on structure
but has distinct off-axis value -- it caught a genuine correctness bug (an unescaped-dot regex
`/.tsx?$/` at line 500 of enforce-module-boundaries.ts, which strips any char) that lz-refactor's
smell lens skipped -- though only in 1 of its 3 cr-emb runs -- and (on the kata) verified behavioral
faithfulness to the canonical spec.

## 5. Book authenticity (oracle vs .oracle/ Fowler/Kerievsky/GoF; DST-04)

| Cell | lz-refactor | code_review |
|------|-------------|-------------|
| cr-emb | pass | pass (Fowler ch.3 smells) |
| cr-rlu | pass | pass (Fowler ch.3 smells) |
| cr-gr | pass | pass (Fowler ch.3 smells) |

**Finding:** Both arms are book-authentic on what they named -- no fabricated smells/refactorings on either
side. lz-refactor's only blemishes are a few legacy 1st-edition names (Replace Method with Method Object;
Consolidate Duplicate Conditional Fragments) and TS-flavored labels (Extract Type; Extract Constant) --
graded PARTIAL (concept faithful, name off-catalog), never FAIL. Its smell -> named-refactoring routing
(mechanical -> Fowler; repeated/complex -> Kerievsky) matches the books.

## 6. Over-/under-engineering (proportionality vs targets.json.judgment)

| Cell | lz-refactor | code_review |
|------|-------------|-------------|
| cr-emb | proportionate (ran the net-cost count, DECLINED polymorphism/Strategy) | proportionate |
| cr-rlu | proportionate (declined Strategy) | proportionate but narrow |
| cr-gr | proportionate runs 1&3 (decline until growth); run-2 mildly over-eager (APPLY early) | unguarded on the pattern (floated polymorphism with NO net-cost APPLY/DECLINE) |

**Finding:** lz-refactor consistently ran an explicit net-cost APPLY/DECLINE judgment and resisted the
over-engineering traps (the intended proportionate call), with one mild wobble (cr-gr run-2 recommending
APPLY before decomposing). code_review's concrete fixes were proportionate, but on the kata it floated
"polymorphism / per-item strategy map" with no proportionality weighing -- the unguarded prompt that can
push a dev to over-build a 4-type kata.

## 7. TypeScript / FP / OOP idioms + patterns (owner-added axis, D-04)

| | lz-refactor | code_review |
|--|-------------|-------------|
| Named vocabulary shipped | ~139 (Fowler 62 + Kerievsky 30 + GoF 23 + extra 5 + functional 19) + 28 smells | 12 Fowler code smells; no refactoring/pattern/idiom vocabulary |
| FP axis (cr-rlu T3) | reached it: Replace Loop with Pipeline (filter/flatMap) | structurally could not: 12-smell baseline has no loop/pipeline concept -- dismissed T3 as out-of-scope |
| OO pattern decisions | named + gated GoF/Kerievsky patterns on net-cost (Strategy, State, Polymorphism, Chain of Responsibility -- mostly declined) | one unguarded pattern mention (cr-gr) |

**Finding (headline):** The ~139-vs-12 vocabulary-breadth asymmetry is real and EXPECTED -- it is the
defining difference on this axis, not a defect of either skill. lz-refactor's catalog lets it name the
FP idiom and make a book-grounded pattern decision where code_review's fixed 12-smell baseline
structurally cannot reach (it dismissed the functional target).

---

## Caveats

- **D-02 (whole-file-diff, off-grain):** code-review is designed to review an INCREMENTAL diff since a
  fixed point. To give both arms byte-identical input, it was fed the whole target file as a diff against
  an empty-root synthetic baseline -- slightly off its natural grain. This is the price of an equal-input
  comparison; code-review's incremental-review strength is not exercised here.
- **D-03 (Spec-axis asymmetry):** code-review runs two axes (Standards + Spec). The nx cells have no
  originating issue/PRD, so its Spec sub-agent reported "no spec available" and skipped -- an EXPECTED
  structural asymmetry, not a defect. On the kata cell the Spec axis DID engage, treating the canonical
  Gilded Rose kata as an implicit spec and verifying behavioral faithfulness (a genuine code_review
  strength this comparison surfaced).
- **A1 (token boundary):** the fair cross-arm token headline is `total_cost_usd` / `model_usage` (they
  roll up code_review's sub-agent); raw main-context `output_tokens` under-count code_review.
- **A4 (plugin context inflation):** the code_review arm loads the third-party mattpocock plugin
  (~22 skill descriptions) into context -- minor inherent inflation, noted not corrected.
- **Grading scope:** book-fidelity was graded on a deduplicated vocabulary list; smell-to-construct
  attachment is corroborated by the claim-normalizer's read of the actual outputs + code, not re-verified
  by the oracle. k=3 per cell; Pass@k reported where the measure is binary (lift>0).

## Verdict (empirical finding -- not a pre-assumed win)

The two skills do **differently-shaped work**, and the comparison is not a single-winner ranking.

**lz-refactor is the book-grounded refactoring specialist.** It routes each detected smell to a
named, book-authentic Fowler/Kerievsky refactoring, sequences them smallest-safest-first, reaches the
functional axis (Replace Loop with Pipeline), makes an explicit net-cost APPLY/DECLINE proportionality
judgment on tempting patterns (correctly declining the over-engineering traps), and does so at **lower
cost with zero sub-agents**. Where its book-grounded catalog **measurably differs** from a general
code-review skill: named-refactoring lift (11-12 vs 0), functional-axis coverage (structurally
unreachable for a 12-smell baseline), pattern proportionality (net-cost decline vs unguarded floating),
and cost (~30-45% cheaper).

**code_review is a broader general reviewer** whose distinct, off-axis value lz-refactor does not
attempt: it names the same underlying smells authentically (Fowler ch.3), and beyond the refactoring lens
it caught a genuine correctness bug (the unescaped-dot regex, in 1 of 3 cr-emb runs) and verified
spec/behavioral faithfulness.
It lacks named-refactoring / pattern / idiom vocabulary, sequencing, and proportionality weighing.

The ~139-vs-12 idiom/pattern vocabulary breadth is the headline on that axis -- expected, and a defect of
neither. Both arms read all three files as structurally-smelly-but-behaviorally-sound, neither
over-engineered its concrete recommendations, and both shared one blind spot: they missed T4
(`groupImports` reduce -> Map group-by) in every cr-rlu run.

**Bottom line:** against a real external code-review skill (not just base Opus), lz-refactor's
book-grounded catalog delivers measurably richer, cheaper, proportionality-guarded, FP-capable
refactoring analysis; the general code-review skill contributes complementary bug-finding and
spec-verification that sit outside lz-refactor's refactoring lens. Use them for different jobs.
