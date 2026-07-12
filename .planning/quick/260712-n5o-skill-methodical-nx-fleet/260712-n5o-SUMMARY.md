---
status: complete
quick_id: 260712-n5o
date: 2026-07-12
---

# Quick Task 260712-n5o: Methodical-skill research + nx package eval fleet

Two parts: (1) web research on making the skill's steps bind methodically; (2) run the prepared
`@nx/*` package eval fleet, `with_skill` (auto-trigger, verify invoked) vs `no_skill`.

## Part 1 -- Research: methodical / binding skill instructions (RESEARCH-only, NOT applied)

`260712-n5o-RESEARCH.md` -- 8 concrete edits (E1-E8), cited. Core insight matches the diagnosed
failure (step-3 surfaces a pattern; step-4's advisory veto lost): the fix is STRUCTURAL, not
"argue harder."

Top recommendations:
1. Fuse the veto INTO the routing step (hard-constraint-first ordering) -- never surface a pattern
   without its warrant test in the same breath.
2. Require a stated APPLY-or-DECLINE verdict + one-line reason BEFORE any code (forcing function;
   advisory acknowledgment without one gets skipped = the "compliance gap").
3. Reframe "clarity is the default" positively, spelling out the decline ACTION + the WHY.
4. Promote the buried on-spec pause-guard out of the mid-document mega-paragraph (lost-in-the-middle)
   + few-shot the exact 4-trivial-types DECLINE.
5. Per-refactoring checklist + terminal self-check re-asserting the veto (recency slot).

CAVEATS: (a) recommendations only -- any SKILL.md edit needs its own review gate + /reload-plugins
before it is live; (b) research-subagent citations (arXiv IDs) need verification before relying on
them -- the underlying techniques are established prompt-eng principles regardless.

## Part 2 -- nx package eval fleet (tight 4: @nx/eslint p9, @nx/js p10, @nx/module-federation p11, @nx/vite p12)

Pre-run gate: unbiased prompt+config review PASSED (5 prompts FAIR, wiring OK; json-converter path
fixed; p13/devkit deferred -- thin test net muddies grading). apply mode, claude-opus-4-8/high,
k=2/arm, live(with_skill)-first. 16 valid runs (no_skill arm 429'd mid-run, resumed).

### Results

- **Trigger: with_skill 8/8 auto-invoked lz-refactor** (no `/lz-refactor` prefix) across all 4
  packages -- the auto-trigger generalizes. The one robust skill-attributable positive.
- **Null value-delta generalizes:** no systematic skill advantage in behavior/quality across 4
  diverse axes (mechanical/AST, FP+OOP, FP+Primitive-Obsession, mechanical+type-code). On
  @nx/module-federation, the single best sweep in the fleet was a **no_skill** run (13 files, deduped
  plugin pairs into shared/ via re-exports PRESERVING public class names, dead-code removal after
  caller-verification) -- it outclassed both with_skill runs (3 files each).
- **Degenerate runs in BOTH arms** (p9 no_skill r2: 0 files; p10 with_skill r2: 1 turn) -- the model
  launched a background jest run and blocked/lost coherence waiting for it. Environment artifact at
  package scale, not skill-related. METHODOLOGY: firm per-package numbers need k>=3 + a guard against
  this failure mode.
- **Efficiency noisy** (n=2 + degenerates): the clean p8 +66% cost penalty does NOT robustly
  generalize -- with_skill faster on p11/p9, much slower on p12. Package-dependent.
- **No skill-induced over-engineering in the fleet** (pat markers were false positives on moved
  existing classes); kata gr4 run-5 remains the lone over-engineering case.

### Combined evidence (whole session)

Measurable skill VALUE beyond triggering is null across 6 measured scenarios: single-file (p7cmd),
package p8, kata gr4/gr3cmd, and the 4-package fleet. Base Opus 4.8 @ high is already catalog-grade at
identify->triage->multi-round-refactor->behavior-preservation->blast-radius-awareness, at every scope.
Auto-trigger (with_skill) fires reliably everywhere. The skill's untested value remains the REFERENCE
use case (on-demand catalog explanation), never exercised by any code-refactoring eval.

## Disposition input

Reinforces: revert 12-02 (no measured value); the broader coach-mode skill value is null on a strong
model; auto-trigger works; reference use case is the one untested escape hatch. Part-1 E1-E8 offer a
methodical-adherence fix IF the skill is kept -- pending their own review. User decision pending.
