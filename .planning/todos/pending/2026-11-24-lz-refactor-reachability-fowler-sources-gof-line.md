---
created: 2026-11-24
title: Link the unreachable lz-refactor leaves, add Fowler Sources, fix the stale GoF line
area: planning
files:
  - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/
  - .planning/PROJECT.md:89
  - .planning/research/lz-tdd-field-triage-2026-11-24.md
---

## Problem

Three small fixes the 2026-11-24 field triage confirmed by measurement at HEAD, planned for lz-tdd@0.0.3 alongside
Phases 23 and 24 (Lars: "2: OK" to recording the plan):

- C8: seven lz-refactor catalog leaves are unreachable from the smell route.
- C9: the Fowler catalog has no Sources section; the other four catalogs have one.
- E1: `.planning/PROJECT.md:89` says GoF is not in `.oracle/` and is answered by the owner, while line 214 says the GoF
  catalog was verified through the clean-room oracle agents.

## Solution

One `/gsd-core:gsd-quick --validate` task: list the seven leaves from the triage source (lz-oop report #3), link each
from the smell that motivates it, add a Fowler Sources section matching the other catalogs' format, and correct line 89.
The leaf and SKILL-adjacent edits get a subagent review (repo rule for skill files).
