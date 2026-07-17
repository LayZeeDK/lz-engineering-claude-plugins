---
type: quick-plan
slug: humanize-lz-refactor-docs
created: 2026-07-09
status: complete
---

# Quick Task: Humanize lz-refactor reference docs

## Description

Run the humanizer skill over all 178 Markdown files under
`plugins/lz-tdd/skills/lz-refactor/` (SKILL.md + 177 reference/catalog files) using
multiple parallel editor agents, then validate (`--validate`) with a mechanical gate,
semantic review, and a copyright-fidelity spot-check against the `.oracle/` sources.

## Decisions (locked with the user)

1. Dash connectors: rewrite every em-dash / en-dash / ASCII `--` used as a clause
   connector into ASCII-only alternatives (period, comma, colon, parentheses, or
   restructure). Output stays ASCII (no Unicode dashes) to avoid mojibake, but no
   dash-as-connector survives. Hyphenated compound words and code stay untouched.
2. Aggressiveness: conservative. Remove only clear AI tells. Hard-preserve catalog
   structure (field lines, headings, numbered Mechanics, `- [Link] ...` lists),
   code blocks (byte-identical), and links. No personality/voice injection: reference
   text stays neutral and plain (the humanizer skill mandates this for reference text).
3. Copyright fidelity (DST-04): edits preserve meaning and stay the repo's own
   paraphrase; wording must not drift toward the source books. Re-verified in review.

## Steps

1. Fan out 14 editor agents (grouped by catalog) to humanize the 177 reference files
   in place. SKILL.md handled manually (triggering-critical YAML frontmatter).
2. Mechanical gate: assert no Unicode dashes/quotes/emojis, no residual `--`
   connectors, code fences byte-identical to base, internal links still resolve,
   frontmatter parses.
3. Semantic review: parallel reviewer agents (incl. unbiased from-scratch briefs)
   confirm meaning preserved, structure intact, tells removed, no copyright drift.
4. Copyright-fidelity spot-check: oracle-reviewer on highest near-verbatim-risk files
   (GoF Intent/Consequences, Kerievsky leaves) against `.oracle/`.
5. Fix flagged issues; commit humanized docs (grouped commits). Record SUMMARY.md and
   update STATE.md "Quick Tasks Completed".

## Acceptance

- All 178 files pass the mechanical gate: ASCII-only, zero dash connectors, code
  blocks and internal links unchanged, valid frontmatter.
- Semantic + fidelity review report no unresolved meaning loss or copyright drift.
- Catalog structure and skill triggering preserved; changes committed on the feature
  branch (not pushed).
