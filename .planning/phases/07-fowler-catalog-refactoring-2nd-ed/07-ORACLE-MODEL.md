# Phase 7 Oracle Model (LOCKED 2026-07-05)

**Status:** LOCKED. Governs how ALL Phase 7 catalog/smell/principle content is sourced and verified;
reusable for Phase 8. To be reconciled into CONTEXT.md D-07 at the scope-correction replan. Preserves
and STRENGTHENS D-07's intent (no fabrication, owner is authoritative) by replacing the "batch
AskUserQuestion paste" framing with a clean-room reviewer loop that also blocks verbatim leakage.

## Decision: Model C -- clean-room reviewer

Content is authored BLIND (from public knowledge + the `.planning/research/refactoring-com-overview.md`
scaffold: names/aliases/tags/inverse-of), then verified for fidelity against the owner's authoritative
source by an ISOLATED reviewer subagent whose returned verdict never carries the source's prose. The
main authoring context never reads the source, so copyrighted expression cannot enter committed code,
references, or `.planning/` artifacts (DST-04).

## Firewall

- **`.oracle/`** -- git-ignored (committed `.gitignore` entry); holds the owner's authoritative book
  as per-chapter Markdown files under `.oracle/refactoring-2e/` (see the mapping in Provisioning).
  NEVER committed. The main context NEVER reads it (only `ls` for names).
- **`.claude/agents/oracle-reviewer.md`** -- read-only (`tools: Read, Grep, Glob`), `model: opus`,
  deliberate (non-proactive) invocation. Reads the draft + the `.oracle` source in its OWN isolated
  context and returns ONLY a structured verdict. It never quotes, paraphrases, transcribes, or echoes
  the source or its path. Facts / procedure / intent may return in the reviewer's own neutral words
  (not copyrightable); the source's specific EXPRESSION never crosses back.
- **Verdict schema (per entry):** `fidelity` (correct | partial | wrong | unable-to-verify),
  `intent_ok`, `spirit_ok`, `too_close_to_source` (bool + structural reason, no span), `directives`
  (short original imperatives, <= 20 words), `ambiguities`, `confidence`.

## Provisioning: full book present, navigated via index.md

As of 2026-07-05 the FULL book is present as per-chapter Markdown files under
`.oracle/refactoring-2e/` with `index.md` as the navigation entry. **Point `oracle-reviewer` at
`.oracle/refactoring-2e/index.md`** and it navigates to the relevant chapter file(s) itself -- the
driver does not hardcode chapter paths. (Reference mapping: Ch.2 principles ->
`06-chapter-2-...md`; Ch.3 smells -> `07-chapter-3-...md`; Ch.6-12 catalog ->
`10-chapter-6-...md` .. `16-chapter-12-...md`; supplementary: `02-list-of-refactorings.md`,
`20-code-snippets.md`, `images/`.) The main context only ever `ls`-es names; the reviewer reads
content.

**What the source contains:** the owner drops the **FULL-TEXT** authoritative excerpts (prose,
mechanics, examples, and the smell -> refactoring / refactoring -> refactoring cross-references).
`oracle-reviewer` is the contracted, isolated, no-leak agent that is *allowed* to hold the full text
precisely because its verdict never carries it out -- so give it full text, not a distillation. Full
text is what lets it (a) verify motivation/example fidelity, and (b) run the **full-strength DST-04
near-verbatim gate** (the automated copyright catch genuinely needs the real prose to compare
against). Completeness of the candidate set (e.g. catching a dropped Extract Function under Divergent
Change) is verified via the alignment against that full source -- Fowler's catalog is hypertext, so
every smell's named candidate refactorings are present to check.

**Do NOT route oracle review through an ad-hoc general-purpose agent.** Prose-minimization is only a
precaution for agents that lack this firewall contract; the dedicated `oracle-reviewer` supersedes
that need and must receive the full source.

## The loop (per chapter / batch)

1. I draft the leaves / smells / principles BLIND (public knowledge + scaffold), in the locked leaf
   format (see 07-ROUTING-ARCHITECTURE.md).
2. Owner drops the matching `.oracle/` sources for that chapter.
3. I spawn `oracle-reviewer` over drafts + sources -> structured verdicts.
4. I revise BLIND from the directives (never seeing the source).
5. Run `check-catalog` / `check-smells` / `check-principles` / `check-hygiene` + the tsc harness.
6. Commit.

Fallback (owner's Option 1): for entries the reviewer flags with `ambiguities` (a judgment the source
alone cannot settle), I ask the owner a targeted question directly.

## Coverage

All 62 refactorings (61 e-book-verified + Return Modified Value web-edition-verified), the 24 smells,
and the Ch.2 principles pass this loop before they are considered done. This IS the D-07 oracle gate,
mechanized.

## Content-fidelity discipline (validated on Extract Function)

Distill WORDING, never SUBSTANCE. Mechanics must keep:
- every decision branch (Extract Function: read-only -> parameter; single assigned-and-used-after ->
  return; multiple -> Split Variable / Replace Temp with Query first),
- safety checkpoints as their own steps (isolation compile before wiring in; test after replace),
- follow-up / compose steps with cross-links to other catalog leaves (dedup -> Replace Inline Code
  with Function Call).
The reviewer polices dropped steps AND near-verbatim closeness.

Validated 2026-07-05: a manual clean-room A-vs-B comparison on Extract Function confirmed the loop
(substance returned with no verbatim) and caught two dropped steps (isolation compile, dedup), now
restored. This is the proof the loop catches real omissions while holding the firewall.

## Comprehensive review dimensions (structural review is only half)

The manual pilot runs were STRUCTURAL only (step/candidate presence, order, drops, discriminator
drift, rough near-verbatim). A full-text `oracle-reviewer` pass must also cover the SEMANTIC and
graph dimensions structural review is blind to. Division of labor:

**`oracle-reviewer` (semantic; needs full text):**
- **example** -- behavior-preservation (the core refactoring invariant; a `tsc`-clean example can
  still change behavior -- this upgrades FWL-04's behavior-preserving clause from manual-only to
  reviewer-gated) + representativeness (demonstrates THIS refactoring, canonical case, honors
  preconditions).
- **motivation + spirit** -- captures the source's reasons with correct EMPHASIS; no invented
  reasons; correct conceptual distinctions, terminology, aliases, attributions.
- **applicability** -- source caveats / limits / when-not-to-use represented, none invented.
- **order-safety** -- mechanics in a safe order (flagged as an alignment `drifted`).
- **near-verbatim (full-strength DST-04)** -- prose, mechanics phrasing, AND example code
  (domain/identifiers/structure).
- plus the structural alignment (drops/drifts) + additions/hallucination detection.

**Harness (deterministic):**
- set completeness (all 62 refactorings + 24 smells present), correct chapter assignment, no dupes;
- bidirectional cross-ref consistency (smell <-> refactoring, inverse-of pairs mutually declared),
  all cross-links resolve, no self-referential links;
- no draft-scaffolding phrases (TODO / "once it exists"); ASCII-only; no work-email;
- `tsc --strict` compile of every extracted example (before AND after).

**Leaf contract additions (fold into the replan):** every refactoring leaf carries a
behavior-preserving, representative example; an applicability/`Watch for` note faithful to the
source; the correct canonical name + 1st-ed aliases; and correct cross-refs (inverse-of / see-also /
addressed-smells).

**Process:** the pilot's oracle review is COMPREHENSIVE (all applicable axes), not the structural
dry-run the manual comparisons were.

**Rubric fits the content type.** The `oracle-reviewer`'s inline rubric is the DEFAULT for
refactoring & smell leaves; the driver supplies a fitting rubric (or "no rubric, holistic") per
invocation for other docs. For `principles.md` the axes are: **concepts** (definitions + the
noun/verb + behavior-preservation + the two-hats distinction correct), **reasons** (the why-refactor
set, none invented), **triggers** (the when-to-refactor set complete -- rule of three / preparatory /
comprehension / litter-pickup, opportunistic-vs-planned -- with correct routing links),
**boundaries** (when-NOT-to / problems, performance stance, YAGNI-architecture stance faithful, none
invented), **attribution** (credits correct: Cunningham / Beck / Opdyke -> Fowler; two hats = Beck),
**spirit** (opportunistic-continuous framing + the lz-tpp two-hats seam). mechanics / candidates /
recognition / example are `n/a`. Indexes (README / smells.md) are mostly deterministic -> harness,
not the reviewer.

## Reuse

Book-agnostic: the same `.oracle/` + `oracle-reviewer` loop serves Phase 8 (Kerievsky under
`.oracle/refactoring-to-patterns/`, GoF vocabulary under `.oracle/gof/`).
