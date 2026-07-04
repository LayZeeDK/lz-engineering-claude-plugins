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
  excerpts in Markdown, e.g. `.oracle/refactoring-2e/<slug>.md`. NEVER committed. The main context
  NEVER reads it.
- **`.claude/agents/oracle-reviewer.md`** -- read-only (`tools: Read, Grep, Glob`), `model: opus`,
  deliberate (non-proactive) invocation. Reads the draft + the `.oracle` source in its OWN isolated
  context and returns ONLY a structured verdict. It never quotes, paraphrases, transcribes, or echoes
  the source or its path. Facts / procedure / intent may return in the reviewer's own neutral words
  (not copyrightable); the source's specific EXPRESSION never crosses back.
- **Verdict schema (per entry):** `fidelity` (correct | partial | wrong | unable-to-verify),
  `intent_ok`, `spirit_ok`, `too_close_to_source` (bool + structural reason, no span), `directives`
  (short original imperatives, <= 20 words), `ambiguities`, `confidence`.

## Provisioning: per-chapter just-in-time

The owner drops a chapter's source files into `.oracle/refactoring-2e/` only when we reach that
chapter -- not all 62 up front.

**What the source must retain:** the checkable FACTS -- refactoring/smell names, candidate
cross-reference targets (smell -> refactorings, refactoring -> composed refactorings, smell ->
near-neighbor smells), and the mechanics step structure. Those are what `oracle-reviewer` verifies
the draft's completeness against (this is how a dropped candidate -- e.g. Extract Function under
Divergent Change -- gets caught). Names and cross-references are FACTS, not protected expression, so
they are safe to keep and SHOULD be kept; the owner may trim the surrounding prose. Fowler's catalog
is hypertext -- each smell already links its named candidate refactorings -- so preserving those
links/names in the source is what lets the fidelity gate confirm the candidate set is complete.

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

## Reuse

Book-agnostic: the same `.oracle/` + `oracle-reviewer` loop serves Phase 8 (Kerievsky under
`.oracle/refactoring-to-patterns/`, GoF vocabulary under `.oracle/gof/`).
