---
phase: quick-261115-qax
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
  - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
  - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
autonomous: true
requirements:
  - QUICK-261115-qax
must_haves:
  truths:
    - "Item 1: in 'Take one small step', the sentence that small steps make the cause of a red obvious no longer sits under the Robert C. Martin owned/oracle-verified tag; it is labelled as lz-red's own reasoning (no-oracle)"
    - "Item 2: the Law 2 bullet attributed to Martin ends at stopping once the test fails; the run-and-watch step is outside the attributed law text and labelled as lz-red's own addition"
    - "Item 3: the Martin-credited rationale for one concept per test is reader comprehension (a mixed test makes the reader work out what each part is for); any failure-localization point that stays is labelled as lz-red's own reasoning"
    - "Item 4: the Clean Code Sources bullet in test-structure-and-assertions.md no longer credits the chapter with a single-reason-to-fail rule"
    - "Item 5: the Repeatable definition attributed to Martin is same result in any environment, including with no network; the clock and leftover-data examples are marked as lz-red's additions"
    - "Item 6: one-concept-per-test says several assertions on one concept are fine if kept few, and that one assertion per test is a guideline, so splitting is by concept, not by assert count"
    - "Item 7: vitest-typescript-mechanics.md Sources lists Robert C. Martin, Clean Code (Ch. 9, Unit Tests) for the build-failure-is-a-legitimate-red claim, in the owned/oracle-verified style"
    - "Guidance is unchanged apart from item 6; principle-backing.md is unchanged unless an edit above makes a row inconsistent; all wording is original (DST-04); bracketed tags are code spans"
    - "lz-red battery (npm run check) passes, claude plugin validate . --strict exits 0, changed files are ASCII-only, and the only email-shaped token in them (if any) is the approved gmail"
  artifacts:
    - path: plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
      provides: "Martin tag scoped to only-enough-to-fail; diagnosis rationale and run-and-watch step retagged as lz-red's own"
    - path: plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
      provides: "readability rationale, assert-count nuance, scoped Repeatable definition, corrected Clean Code Sources bullet"
    - path: plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
      provides: "Clean Code Ch. 9 Sources bullet"
  key_links:
    - from: plugins/lz-tdd/skills/lz-red/references/principle-backing.md
      to: plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
      via: "the 'One concept per test' and 'F.I.R.S.T. properties' rows stay Martin/Clean Code Ch. 9 owned; they name the rule, not the rationale, so they stay consistent"
---

<objective>
Correct what three shipped lz-red references attribute to Robert C. Martin's Clean Code (Ch. 9), per an
oracle-reviewer re-check after `.oracle/clean-code` was refreshed. Change only attributions and labels, plus
the assert-count nuance (item 6). Keep the guidance itself the same.

Lars's approval, verbatim (2026-11-15), answering "Apply the six fixes through a GSD quick task?" and "Also add
Clean Code to the Sources list in `vitest-typescript-mechanics.md`?": "1: Only if it fits the scope of the v0.0.3
lz-refactor milestone. Otherwise, defer it to a later milestone. 2: Same as 1." The orchestrator (Claude) judged
both in scope of the open lz-tdd@0.0.3 milestone (lz-red references from Phases 17, 17.1 and 18; PR #3 open).

Clean-room rule DST-04: write in original words, never quote or closely paraphrase the book, and NEVER read
anything under `.oracle/`. The directives below already carry everything needed from the source.

Output: one Conventional Commit on `gsd/lz-tdd-0.0.3-lz-red` (no push), plus a SUMMARY for the orchestrator.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@AGENTS.md
@plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
@plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
@plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
@plugins/lz-tdd/skills/lz-red/references/principle-backing.md

Provenance-tag conventions already in these files (reuse, do not invent new forms):
- Inline: `(Robert C. Martin, owned; oracle-verified)` on a Distilled rationale or law bullet.
- lz-red's own material: `(lz-red orchestration, no-oracle)` on Law 3; Sources style "lz-red's own measurement
  ... Not from a source; no-oracle." For the retags here use the inline label `(lz-red's own reasoning, no-oracle)`
  or `(lz-red's own addition, no-oracle)`.
- Sources bullets: `- Author, Work (Ch. N, Title) -- what it backs here. Owned; oracle-verified against the
  clean-room source.`
- Bracketed tags in shipped Markdown are code spans, never bare, never escaped, never inside link text.
- `check-red-references.mjs` guards the heading label "one concept per test" (regex `one concept`) and the
  `oracle-verified` / `no-oracle` tier tokens; keep the "One concept per test" heading.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Retag the two Martin overreaches in three-laws-and-test-selection.md</name>
  <files>plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md</files>
  <action>
Item 1. In "## Take one small step", the Distilled rationale is tagged `(Robert C. Martin, owned; oracle-verified)`.
Keep that tag on the part Martin does say: grow the test only to the first failure and stop; a not-yet-defined
symbol counts as that failure; plus the existing sentence distinguishing sizing from which red is handed forward.
Split off the last sentence (one small step keeps red-to-green distance tiny, so a red names the single change that
caused it and diagnosis is immediate) into its own sentence or sub-bullet labelled `(lz-red's own reasoning,
no-oracle)`. Keep its meaning; light rewording only.

Item 2. In the Law 2 bullet under "## The Three Laws spine and classify-first", the attributed law text currently
says to write only enough of a test to fail and then stop and also watch it fail. Cut the run-and-watch clause from
the attributed sentence so the Martin-tagged law ends at stopping once the test fails. Add right after it a short
sentence labelled `(lz-red's own addition, no-oracle)` saying the coach then runs the test and watches it fail
before trusting the red. Leave the rest of the Law 2 bullet (compile failure counts; sizing vs which red goes
forward) unchanged.

Top blockquote and Sources: they describe Martin as backing the one-small-step / only-enough-to-fail thread. That
remains true for the sizing rule; leave both as they are unless a sentence there explicitly credits Martin with the
diagnosis rationale or the run-and-watch step, in which case drop that credit only. Do not touch Laws 1 and 3, the
classify-first paragraph, or the code sample.
  </action>
  <verify>
    <automated>rg -c "lz-red's own (reasoning|addition), no-oracle" plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md (expect 2 or more); rg -n "stop and watch it fail" plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md (expect exit 1, no hit)</automated>
  </verify>
  <done>Martin's owned tags in this file cover only what Clean Code Ch. 9 states (Laws 1-2 and the only-enough-to-fail sizing); the diagnosis rationale and the run-and-watch step carry lz-red's own no-oracle labels; guidance reads the same.</done>
</task>

<task type="auto">
  <name>Task 2: Fix the test-structure attributions, add the assert-count nuance, add Clean Code to the vitest Sources</name>
  <files>plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md, plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md</files>
  <action>
test-structure-and-assertions.md, "## One concept per test":
- Item 3. Rewrite the Martin-tagged Distilled rationale around reader comprehension: a test that mixes several
  concepts makes the reader work out what each section is there for, while one concept per test lets it read as a
  single clear statement. Keep the `(Robert C. Martin, owned; oracle-verified)` tag on that. The failure-localization
  idea (a red names the one behavior that broke) may stay, but as a separate sentence labelled `(lz-red's own
  reasoning, no-oracle)`. The Rule line's "so a failure points back to exactly one broken behavior" is also the
  localization claim: reword the Rule so it states the rule without crediting a reason, or move that clause into the
  lz-red-labelled sentence.
- Item 6. In the Rule (or a short added When-to-use line), state that several assertions about the same concept are
  fine as long as they stay few, and that one assertion per test is a guideline rather than a law: split by concept,
  not by assertion count. Phrase this in original words.
- Keep the heading text "One concept per test" (checker guard).

test-structure-and-assertions.md, "## F.I.R.S.T.: the baseline the pillars sit on":
- Item 5. Narrow the Repeatable entry inside the attributed definition to: same result in any environment,
  including with no network available. Then mark the clock and leftover-data examples as lz-red's additions, e.g.
  a following clause or sentence labelled `(lz-red's own addition, no-oracle)` saying in practice that also means not
  leaning on the clock or on data a previous run left behind. Leave Fast, Independent, Self-validating, Timely
  unchanged. Leave the later "## F.I.R.S.T. as a red-step baseline" section unchanged (its clock / shared-fixture
  example is already lz-red's procedure text, not a definition credited to Martin).

test-structure-and-assertions.md, top blockquote and "## Sources":
- Item 4. In the Clean Code Sources bullet, remove the credit for a single-reason-to-fail rule; it should credit
  Ch. 9 with one concept per test (its readability rationale and the few-asserts nuance) and the F.I.R.S.T.
  properties. The blockquote says "the one-concept-per-test rationale" is oracle-verified; that stays true after the
  item-3 rewrite, so change it only if it now overclaims.

vitest-typescript-mechanics.md, "## Sources":
- Item 7. Add a bullet in the existing style, e.g. after the Fowler bullet: Robert C. Martin, Clean Code (Ch. 9,
  Unit Tests) -- a build failure counts as a legitimate red, the position cited in the instrument-divergence
  paragraph. Owned; oracle-verified against the clean-room source. Do not add bullets for Beck or Meszaros (out of
  this task's scope).

principle-backing.md: read the "One concept per test", "F.I.R.S.T. properties", "Grow the test only enough to fail"
and "Three Laws of TDD spine" rows and the retag explanation. They name rules and sources, not the rationales
changed above, so expect no edit. Edit only if a row now states something an edit above removed; if unchanged,
record "principle-backing.md checked, no change needed" in the SUMMARY.
  </action>
  <verify>
    <automated>rg -n "reason to fail" plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md (expect exit 1); rg -c "lz-red's own (reasoning|addition), no-oracle" plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md (expect 2 or more); rg -n "Clean Code \(Ch\. 9, Unit Tests\)" plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md (expect 1 hit, inside ## Sources)</automated>
  </verify>
  <done>Items 3-7 applied in original words; Martin's tags in test-structure-and-assertions.md cover only readability, the few-asserts nuance and his Repeatable definition; vitest Sources lists Clean Code Ch. 9; principle-backing.md consistent (unchanged unless forced).</done>
</task>

<task type="auto">
  <name>Task 3: Run the battery and hygiene checks, then commit</name>
  <files>plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md, plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md, plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md</files>
  <action>
Run from the repo root, each as its own command (no `cd ... &&`):
1. `npm --prefix .claude/skills/lz-red-workspace run check` -- the lz-red deterministic battery (provenance-honesty,
   row-guards and package-links selftests, check-red-references, rgr-routing checks). Must exit 0. If a guard fails
   because of a reworded label, fix the Markdown, not the checker.
2. `claude plugin validate . --strict` -- must exit 0.
3. ASCII-only on the changed files: `rg -n "[^\x00-\x7F]"` over the three files (plus principle-backing.md if
   edited) must exit 1.
4. Allowlist-inversion email check per AGENTS.md: `rg -o -N "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]+"` over the
   changed files; every token printed must be the approved gmail (none is also fine). Never type the forbidden
   address or its domain as a needle. Also confirm `git config user.email` prints the approved gmail before committing.
5. `git diff --stat` shows only the intended files.
Then stage the changed files by name and commit with `git commit -F <msg-file>` (message file written with the
Write tool in the scratchpad), Conventional Commit subject such as
`docs(lz-red): scope Clean Code attributions to what Ch. 9 states`, body listing items 1-7 briefly. No AI
attribution trailers. Confirm with `git log --oneline -1`. Do not push. Leave `.planning/config.json` (pre-existing
modification) unstaged.
  </action>
  <verify>
    <automated>npm --prefix .claude/skills/lz-red-workspace run check; claude plugin validate . --strict; git log --oneline -1</automated>
  </verify>
  <done>Battery and strict validate exit 0, ASCII and email allowlist clean, one commit on gsd/lz-tdd-0.0.3-lz-red containing only the reference edits, nothing pushed.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| repo -> public GitHub | committed Markdown and commit identity become public |
| `.oracle/` -> shipped Markdown | copyrighted source text must not cross into shipped files |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-qax-01 | Information disclosure | commit identity and changed files | high | mitigate | Task 3 step 4 allowlist-inversion scan plus `git config user.email` check before commit |
| T-qax-02 | Tampering (provenance) | Martin-tagged sentences | medium | mitigate | retag per items 1-7; orchestrator oracle-reviewer gate after execution |
| T-qax-03 | Information disclosure (copyright) | rewritten rationales | medium | mitigate | DST-04: executor never reads `.oracle/`, writes original wording; oracle-reviewer checks for close paraphrase |
</threat_model>

<verification>
Executor (Task 3): lz-red battery green, `claude plugin validate . --strict` exit 0, ASCII-only, email allowlist clean.

Orchestrator gate after execution (NOT an executor task; executors cannot spawn agents): the orchestrator spawns a
fresh oracle-reviewer pass on all three changed files against `.oracle/clean-code`, checking that every
Martin-tagged claim is one Clean Code Ch. 9 makes and that no rewritten sentence is a close paraphrase. Any finding
returns to a fix round before the task closes.
</verification>

<success_criteria>
All seven directives applied; no other guidance changed; principle-backing.md consistent; checks green; one local
commit; oracle-reviewer gate passed by the orchestrator.
</success_criteria>

<output>
Create `.planning/quick/261115-qax-fix-clean-code-misattributions-in-lz-red/261115-qax-SUMMARY.md` when done,
including the principle-backing.md check result and the commit hash.
</output>
