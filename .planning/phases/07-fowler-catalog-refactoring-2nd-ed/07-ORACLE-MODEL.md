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
  as per-chapter Markdown under `.oracle/refactoring-2e/`, navigated via `index.md` (see
  Provisioning). NEVER committed. The main context NEVER reads it (only `ls` for names).
- **`.claude/agents/oracle-reviewer.md`** -- read-only (`tools: Read, Grep, Glob`), `model: opus`,
  deliberate (non-proactive) invocation. Reads the draft + the `.oracle` source in its OWN isolated
  context and returns ONLY a structured verdict. It never quotes, paraphrases, transcribes, or echoes
  the source or its path. Facts / procedure / intent may return in the reviewer's own neutral words
  (not copyrightable); the source's specific EXPRESSION never crosses back.
- **Verdict schema (per entry):** `fidelity` (correct | partial | wrong | unable-to-verify),
  `intent_ok`, `spirit_ok`, `too_close_to_source` (bool + structural reason, no span), `directives`
  (short original imperatives, <= 20 words), `ambiguities`, `confidence`.

## Provisioning: full book present, navigated via index.md

As of 2026-07-05 the FULL book is present under `.oracle/refactoring-2e/` (per-chapter Markdown +
front/back matter) with `index.md` as the navigation entry. **Point `oracle-reviewer` at
`.oracle/refactoring-2e/index.md`** and pass the target by chapter/topic (e.g. "Ch.2 Principles",
"Ch.6 the basic catalog"); the reviewer resolves it to the source file via `index.md` itself. Do NOT
hardcode the book's chapter filenames in `.planning/` artifacts -- reference only `index.md` and the
chapter number/topic. The main context only ever `ls`-es names; the reviewer reads content.

**Provisioning status (updated 2026-07-05):** the sole web-only entry, Return Modified Value, has
been added to the `.oracle/refactoring-2e/` Chapter 11 (Refactoring APIs) Markdown, so the oracle
agents gate it there like any other leaf. It keeps its `[web-only]` provenance label (verified
against the web edition) but is no longer un-gateable.

The web-edition Markdown marks print-absent entries with a not-in-print flag, and Chapters 9, 10,
and 11 each carry such flagged entries. Mapping them to the 62-scope: Replace Magic Literal (Ch.9),
Replace Control Flag with Break (Ch.10), Replace Exception with Precheck (Ch.11), and Replace Error
Code with Exception (Ch.11) are the 4 cut 1st-ed relics -- OUTSIDE the 62-scope, so they are never
authored or gated, whether or not they appear in the Markdown (Replace Error Code with Exception is
additionally absent from the Markdown entirely, per the owner). Of every print-absent entry, only
Return Modified Value is in-scope (kept, `[web-only]`). Consequently, among all 62 in-scope leaves
only Return Modified Value carries a provenance label; every other Ch.9/10/11 leaf is print-present.

**Gating safeguard:** when gating a Ch.9/10/11 leaf, pass a tight per-leaf SCOPE (the single
refactoring the leaf covers), so the reviewer does not treat an out-of-scope flagged entry in the
chapter as a dropped (`source-only`) item.

With Return Modified Value added, all 62 in-scope refactorings are provisioned for the oracle agents.
If any future leaf's oracle review returns `error` because the source lacks that entry, the driver
flags it to the owner, who adds that entry's Markdown to the relevant chapter (do NOT fabricate or
self-gate an unprovisioned entry).

Content map by chapter (facts, no filenames): Ch.2 = principles; Ch.3 = the 24 bad smells; Ch.6-12 =
the seven catalog chapters (basic, encapsulation, moving-features, organizing-data,
simplify-conditional-logic, refactoring-apis, dealing-with-inheritance). The book also ships a
refactorings list (names/aliases) and its code listings (useful for near-verbatim checks) -- the
reviewer finds these via `index.md`.

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

## Reuse and oracle availability (which books the agents can read)

The oracle agents (`oracle`, `oracle-reviewer`) work ONLY for books present as Markdown in
`.oracle/`. For any book NOT there, the agents cannot be used (no source to read) -- use
AskUserQuestion (the owner answers) as the oracle path instead.

| Book | In `.oracle/`? | Oracle path |
|------|----------------|-------------|
| Fowler, *Refactoring* 2nd ed | yes (`.oracle/refactoring-2e/`) | `oracle` + `oracle-reviewer` -- Phase 7 |
| Kerievsky, *Refactoring to Patterns* | yes (to be added) | `oracle` + `oracle-reviewer` -- Phase 8 |
| GoF, *Design Patterns* | no | AskUserQuestion -- Phase 8 GoF vocabulary (KRV-04) |
| Kent Beck, *TDD by Example* / *Tidy First?* | no | AskUserQuestion -- Phase 9 backing (PRIN-01/02); or keep no-oracle/high-confidence-core per existing scoping |
| Robert C. Martin | no | AskUserQuestion |

**AskUserQuestion is retired as the oracle path ONLY for the `.oracle/`-present books (Fowler,
Kerievsky).** For unowned-as-Markdown books it remains the oracle path. The original milestone
standing instruction ("use AskUserQuestion for authoritative oracle book access") therefore still
holds for GoF / Beck / RCM; it is superseded by the clean-room agent loop only where the book is in
`.oracle/`.

## Driver responsibilities + canonical anchors (oracle-agent round-10, 2026-07-05)

The agents' firewall covers per-CALL leaks; three things are the DRIVER's job (the executor running
the loop), surfaced by the blind agent reviews and NOT enforceable inside the agent files:

- **Fan-out aggregation (firewall).** A per-call guard cannot see across calls. When you fan `oracle`
  out one call per chapter, the merged result can reconstruct the book's complete curated SELECTION
  (names + chapter numbers -- allowed facts, but still the source's compilation). The driver
  dedupes/caps the aggregate and does not persist a full ordered name+chapter map.
- **Loop bound + oscillation guard.** `oracle-reviewer` is adversarial (assumes drift until proven
  otherwise), so it can false-`revise` a faithful draft and a too-close<->drift rewrite can
  oscillate. The driver caps rounds (e.g. 3) and, on non-convergence, escalates the entry to the
  owner (AskUserQuestion) instead of looping -- a correct draft must not churn indefinitely.
- **Rubric anchors.** The agent carries a generic default rubric; for precision the driver passes the
  canonical per-axis anchors below (or "holistic, no anchors"). At least one axis must be in play.

**Canonical per-axis anchors** (moved out of the agent to keep its system prompt lean):
- **mechanics** (refactoring) -- correct: all steps, safe order, faithful branches + safety
  checkpoints, AND any named compose/follow-up/inverse-of refactoring is the sibling the source
  pairs it with (cross-ref aptness). partial: a branch drifted, a checkpoint folded (still safe), or
  a cited refactoring is a plausible-but-wrong sibling. wrong: a step/branch/checkpoint dropped,
  unsafe order, a misstated step, or a cited refactoring that contradicts the source's pairing.
- **candidates** (smell) -- correct: complete set + faithful selectors. partial: complete but a
  selector drifted/thin. wrong: a candidate dropped or one that doesn't belong.
- **recognition** (smell) -- correct: faithful cues + near-neighbors separated. partial: a
  distinction blurred. wrong: inaccurate / would mis-identify.
- **motivation** -- correct: key reasons + emphasis, none invented. partial: emphasis off or a
  secondary reason missing. wrong: a primary reason missing/misstated/invented.
- **example** (refactoring) -- correct: compiles, behavior-preserving, representative, honors
  preconditions, independent of the source. partial: compiles + behavior-preserving but atypical.
  wrong: changes behavior / wrong refactoring / violates preconditions / mirrors the source.
- **applicability** -- correct: source caveats represented, none invented. partial: a caveat
  missing/off. wrong: a load-bearing caveat missing or an invented limit. NOTE: a leaf's own
  cross-cutting routing aid -- a `Watch for` cross-link to a named ../principles.md gate (e.g. the
  atomic-boundary tripwire) or an inverse-of/see-also sibling link -- is OUR addition, scored as a
  benign `draft-only` addition, NEVER as an invented limit (unless it contradicts the source); a
  cited sibling's aptness is still a mechanics concern (see the mechanics anchor).
- **spirit/judgment** -- correct: framing/emphasis match AND a judgment-call refactoring is presented
  as judgment (its when-to / when-not-to character), not as a rote recipe. partial: substance right
  but framing off, or the judgment character thinned. wrong: misframes character/intent, or sells a
  judgment call as mechanical (or a mechanical one as a judgment call).

**Anchor sharpenings (2026-07-05, owner-approved after Ch.6-10).** Three refinements applied to the
anchors above and mirrored into `.claude/agents/oracle-reviewer.md`: (1) mechanics now scores
cross-ref aptness (a resolvable-but-wrong sibling link is a defect) -- Ch.10 caught Replace
Conditional with Polymorphism citing Decompose Conditional where the source extracts via Extract
Function; (2) applicability treats our own principles/sibling back-edges as benign additions, not
invented limits -- the atomic-boundary back-edges recurred as benign across Ch.8/9; (3) spirit
rescoped to spirit/judgment for the judgment-heavy chapters ahead -- spirit scored `correct` on all
29 gated leaves through Ch.10 without ever firing, so it was retargeted rather than dropped. The
`oracle` (open-ended lookup) agent is unaffected.

NOTE (reconcile in the scope-correction replan): the "Firewall" and "Verdict schema" blocks earlier
in THIS file still describe the pre-round-2 agent (tools `Read, Grep, Glob`; a
`fidelity/intent_ok/spirit_ok` schema). The shipped agents are `tools: Read, Glob` with a
`pass|revise|blocked` verdict -- treat this section + the live `.claude/agents/oracle*.md` as
authoritative.
