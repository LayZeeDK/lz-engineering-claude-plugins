# Phase 4: Distribution & Hygiene - Research

**Researched:** 2026-07-02
**Domain:** Open-source distribution hygiene for a Claude Code plugin marketplace repo (README authoring, MIT licensing, first-party authoring review, ASCII + secret-leak gating)
**Confidence:** HIGH

## Summary

This is a documentation + licensing + first-party-review phase over an already-built,
already-validating marketplace. There is no new code and no external dependency. The
whole phase is: write a root `README.md` (DIST-01), add a root MIT `LICENSE` (DIST-02),
then satisfy three review gates and two hygiene guards (DIST-03). All of the raw material
already exists in the repo and in the maintainer's sibling repos, so this phase is mostly
"lift, align, and verify," not "discover."

Two things were verified live against the actual repo during research and materially
shape the plan. First, `claude plugin validate .` (the hard DIST-03 gate) already passes
today, exit 0, even with `--strict` -- so that gate is green before Phase 4 starts and the
risk is only in NOT regressing it. Second, and more important, the work-email literal is
ALREADY present in two tracked `.planning/` files (this phase's own `04-CONTEXT.md` and
`04-DISCUSSION-LOG.md`), and the `.planning/` tree already contains non-ASCII characters
(em-dashes, block-drawing progress bars in `STATE.md`). Because the GitHub repo is public,
a naive full-tree work-email guard or a full-tree ASCII gate will FAIL on pre-existing
GSD-generated content that this phase did not author. The plan must define gate scope
precisely (publishable surface vs. `.planning/` meta-docs) or explicitly redact those two
files. This is the load-bearing planning decision alongside D-06's findings triage.

**Primary recommendation:** Author `README.md` and `LICENSE` FIRST (the `plugin-validator`
agent explicitly checks that both exist), lift the MIT text verbatim from the maintainer's
own `lz-cybernetics-ai-plugins/LICENSE` (it already carries the exact required copyright
line), mirror the `lz-advisor-claude-plugins/README.md` structure, then run the gates in
this order: scriptable guards (ASCII + work-email) -> `claude plugin validate . --strict`
-> `plugin-validator` agent -> `skill-reviewer` agent. Triage every agent finding through
D-06: fix structural/hygiene/security/install-breaking/ASCII issues now; record-and-defer
every `description`/triggering/word-count/coaching finding to Phase 5.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**README documentation (DIST-01)**
- **D-01:** A single root `README.md` is the primary shippable doc (GitHub landing page +
  install-command target). Section order (Claude's discretion on exact wording):
  title + one-line value prop; "What this is" (marketplace -> `lz-tdd` plugin -> `lz-tpp`
  skill); Install (the two documented commands verbatim); "What `lz-tpp` does" + invocation
  (`/lz-tdd:lz-tpp`) noting it auto-triggers as a coach during red-green-refactor TDD and
  serves an on-demand reference; brief TPP primer (see D-02); License + contact. A per-plugin
  `plugins/lz-tdd/README.md` is OPTIONAL and low value for a single-plugin marketplace; if
  added at all, keep it a short pointer to the root README (never a duplicate) to avoid drift.
- **D-02:** README TPP content is a BRIEF summary plus links to the authoritative sources
  (the two Clean Code posts + the NDC 2011 talk, listed in PROJECT.md Context) and a pointer
  to the bundled `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`. Do NOT
  duplicate or inline the canonical 14-item list, worked examples, or TCO guidance -- the
  skill's `references/` remain the single source of truth (progressive disclosure; drift
  avoidance).

**Licensing & contact (DIST-02)**
- **D-03:** Add a standard MIT `LICENSE` file at repo root using the verbatim OSI MIT text,
  with copyright line `Copyright (c) 2026 Lars Gyrup Brink Nielsen` (matches the `plugin.json`
  `author.name`; current year 2026). This is the LICENSE FILE deferred from Phase 1 (Phase-1
  D-12 kept only the machine-readable `license: "MIT"` field in `plugin.json`).
- **D-04:** The public contact is `larsbrinknielsen@gmail.com` in every place it appears
  (README contact line + the existing `plugin.json` `author.email`). The work email
  MUST appear nowhere in the repo. Before the phase-completion commit,
  verify absence with an allowlist check (grep for the work-email literal across tracked
  files -> expect zero hits). Confirmed absent at discuss time. [NOTE: research found this
  is NOT currently true across the full tree -- see Pitfall 1.]

**First-party authoring review & findings triage (DIST-03)**
- **D-05:** Run three review gates: (1) `claude plugin validate .` -- the first-party CLI,
  a HARD gate that MUST report no errors; (2) `plugin-dev`'s `plugin-validator` agent
  (structure / manifest / security / path traversal); (3) `plugin-dev`'s `skill-reviewer`
  agent (skill quality). Independently verify all committed output is ASCII-only per repo
  convention (arrows `->`, straight quotes, no emojis/box-drawing/em-dashes).
- **D-06:** Findings triage (this is the load-bearing decision of the phase). FIX in Phase 4:
  structural/manifest errors, security/path-traversal issues, anything that breaks install or
  `/lz-tdd:lz-tpp` invocation, ASCII violations, factual inaccuracies in README/LICENSE, and
  clear skill-authoring defects (e.g. malformed frontmatter, broken reference links). DEFER to
  Phase 5 (EVAL-01/02): any finding about `description` triggering effectiveness, over/under-
  triggering, or coaching-accuracy -- these are empirical-tuning concerns explicitly deferred
  by Phase-3 D-10 and the roadmap. "Significant findings" that block the public ship =
  errors + security + broken install/invocation + ASCII violations; subjective/style
  suggestions are recorded and optionally applied, never allowed to pull Phase-5 empirical
  work forward.

### Claude's Discretion
- Exact README section ordering, tagline/value-prop wording, and whether to include a short
  copy-paste usage snippet (no screenshots needed -- backend/CLI-focused).
- Whether to add an optional one-line `plugins/lz-tdd/README.md` pointer (D-01).
- Any README badges/keywords (optional; keep ASCII, keep minimal).
- Exact MIT text whitespace/formatting (use the standard OSI template verbatim).
- Order in which the three review gates run, and whether validator/reviewer run as agents
  or the CLI-only gate suffices for a given check (all three must ultimately be satisfied).

### Deferred Ideas (OUT OF SCOPE)
- **Empty `AGENTS.md` (0 bytes) imported by `CLAUDE.md` via `@AGENTS.md`** -- a hygiene defect
  discovered during codebase scout. NOT in DIST-01/02/03 scope; flagged as a separate trivial
  fix if the user wants it, not this phase's requirements. [Research confirms `AGENTS.md` is
  0 bytes -- see Open Questions.]
- **Skill-creator trigger + behavior evals and empirical `description` tuning** -> Phase 5
  (EVAL-01/02). Any triggering-effectiveness / coaching-accuracy finding surfaced by
  `skill-reviewer` in Phase 4 is recorded and deferred, per D-06.
- **npm packaging / additional plugins / additional skills / non-TS example sets**
  -> post-0.0.1 (NEXT-01..04), out of scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DIST-01 | `README.md` documents install (`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd@lz-engineering-claude-plugins`), what the skill does, and how to invoke it (`/lz-tdd:lz-tpp`) | Exact command strings confirmed in CONTEXT `<specifics>`; README section order given by D-01; direct structural precedent = `lz-advisor-claude-plugins/README.md` (read during research); TPP source links + `references/` pointer from PROJECT.md (D-02). See Architecture Patterns + Code Examples. |
| DIST-02 | MIT `LICENSE` at repo root, public contact `larsbrinknielsen@gmail.com`, work email nowhere | Verbatim MIT text with the exact required copyright line already exists at `lz-cybernetics-ai-plugins/LICENSE` (copy-ready). Public email already correct in both manifests. Work-email guard command verified; CRITICAL scope caveat in Pitfall 1. |
| DIST-03 | Skill + manifests pass `plugin-validator` + `skill-reviewer` without significant findings, plus `claude plugin validate .`, all committed output ASCII-only | `claude plugin validate .` verified passing today (exit 0, `--strict` exit 0). Agent definitions read and their exact checks + likely findings enumerated (Common Pitfalls 4-5). ASCII gate command verified; scope caveat in Pitfall 2. |
</phase_requirements>

## Architectural Responsibility Map

This phase has no runtime tiers; "responsibility" here means which artifact owns each
requirement's surface. Included for planner sanity-checking of task assignment.

| Capability | Primary Artifact | Secondary Artifact | Rationale |
|------------|------------------|--------------------|-----------|
| Install/usage documentation | root `README.md` | `plugins/lz-tdd/README.md` (optional pointer) | Root README is the GitHub landing page and the `/plugin marketplace add` target; per-plugin README is an optional non-duplicating pointer (D-01) |
| License grant | root `LICENSE` (file) | `plugin.json` `license: "MIT"` (machine field, already present) | Human-readable grant lives at repo root; the SPDX field in the manifest stays consistent with it (D-03) |
| Public identity / contact | `plugin.json` + `marketplace.json` `email` (already `larsbrinknielsen@gmail.com`) | README contact line | Manifests are the source of truth for identity; README mirrors, never diverges (D-04) |
| Structural correctness | `claude plugin validate .` (CLI) | `plugin-validator` agent | CLI is the hard programmatic gate; agent adds structure/security review depth |
| Skill quality | `skill-reviewer` agent | manual read | Agent audits description/progressive-disclosure/references; findings triaged via D-06 |
| Committed-output hygiene | `git grep` ASCII gate + work-email guard | manual review | Scriptable pre-commit tripwires enforce ASCII-only and no work-email leak |

## Standard Stack

No package installs. The "stack" is the file formats, the first-party CLI, and the two
installed review agents. All verified present during research.

### Core
| Tool / Format | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| `claude plugin validate <path>` | Claude Code 2.1.198 (verified installed) | Hard structural gate for marketplace/plugin/skill manifests | First-party validator; the authoritative DIST-03 gate. Has a `--strict` flag (treats warnings as errors) [VERIFIED: ran `claude plugin validate --help` and against this repo] |
| Markdown (`README.md`) | CommonMark / GitHub-flavored | Install + usage landing doc | GitHub renders it as the repo landing page; it is the `/plugin marketplace add` target doc [VERIFIED: repo conventions + precedent] |
| MIT License text (`LICENSE`) | OSI canonical template | License grant at repo root | Standard OSI text; GitHub license detection + `plugin-validator` "LICENSE present" check [CITED: opensource.org/license/mit; VERIFIED: identical text present at `lz-cybernetics-ai-plugins/LICENSE`] |
| `plugin-dev` `plugin-validator` agent | claude-plugins-official (installed) | Structure/manifest/security/path-traversal review | First-party agent required by D-05; definition read during research [VERIFIED: read `agents/plugin-validator.md`] |
| `plugin-dev` `skill-reviewer` agent | claude-plugins-official (installed) | Skill quality review (description, disclosure, references) | First-party agent required by D-05; definition read during research [VERIFIED: read `agents/skill-reviewer.md`] |

### Supporting (verification tooling, already present)
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `git grep -P` | git w/ PCRE (verified `-P` works on this box) | ASCII gate + work-email tripwire | Pre-commit hygiene gates; ARM64-native, CLAUDE.md-preferred [VERIFIED: probed `git grep -qP`] |
| `rg` | Chocolatey build (available) | Fallback for gitignored/untracked scans | If a scan must include untracked files not yet added |
| `node` | present (used to measure SKILL.md) | Ad-hoc measurement/scripting | Char/word counts, JSON checks |

**Installation:** None. No `npm install`. This phase adds two text files and runs
already-installed tools.

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages (npm/PyPI/crates). All tools
used (`claude` CLI, `git`, `rg`, `node`, the two `plugin-dev` agents) are already installed
and first-party or system-standard. No slopcheck / registry verification required.

## Architecture Patterns

### README structure (D-01 order), grounded in the maintainer's own precedent

The direct precedent is `lz-advisor-claude-plugins/README.md` (read during research) -- the
maintainer's sibling single-plugin marketplace. It is deliberately minimal: title + one-line
purpose, a structure table, an `Installation` fenced block with the two `/plugin` commands,
a "see full docs" pointer, and a one-word `## License` section. Mirror its tone (terse,
CLI-focused, no screenshots) but follow the richer D-01 section order, because this repo's
README is the primary shippable doc (lz-advisor delegates depth to a per-plugin README; here
D-01 keeps depth at the root and makes the per-plugin README an optional pointer only).

Recommended section order (wording is Claude's discretion):

```
# lz-engineering-claude-plugins
> one-line value prop (TPP TDD coach + reference for Claude Code)

## What this is
marketplace -> lz-tdd plugin -> lz-tpp skill (/lz-tdd:lz-tpp)

## Installation
    /plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
    /plugin install lz-tdd@lz-engineering-claude-plugins

## What lz-tpp does
- auto-triggers as a coach during red-green-refactor TDD (recommends the next
  transformation by TPP priority)
- explicit reference: invoke /lz-tdd:lz-tpp to explain the transformations + ordering

## Transformation Priority Premise (brief)
2-4 sentence primer + links to the 3 authoritative sources + pointer to
plugins/lz-tdd/skills/lz-tpp/references/transformations.md

## License
MIT -- see LICENSE. Contact: larsbrinknielsen@gmail.com
```

### Pattern: progressive disclosure carries into the README

The README follows the same discipline the skill already uses: it POINTS at
`references/transformations.md` and the three upstream sources instead of inlining the
14-item list or worked examples (D-02). This keeps `references/*` the single source of truth
and prevents README/reference drift.

### Pattern: identity flows from manifests, never re-invented

`larsbrinknielsen@gmail.com`, `MIT`, and the GitHub URL already live in `plugin.json` and
`marketplace.json` [VERIFIED: read both files]. README + LICENSE mirror these exact values;
no new identity string is introduced. This is the anti-drift rule from D-04.

### Anti-Patterns to Avoid
- **Inlining the TPP transformation list or worked examples into the README.** Violates D-02
  and creates a second source of truth that will drift from `references/`.
- **A per-plugin `plugins/lz-tdd/README.md` that duplicates the root README.** If added at
  all, it must be a one-line pointer (D-01).
- **Introducing a new copyright holder / year / email in the LICENSE.** Must be exactly
  `Copyright (c) 2026 Lars Gyrup Brink Nielsen` and the public gmail (D-03/D-04).
- **Running the review agents BEFORE writing README/LICENSE.** `plugin-validator` step 9
  checks that README and LICENSE exist; running it first guarantees noise findings.

### Ordering (recommended plan sequence)
1. Write `README.md` (root).
2. Write `LICENSE` (root, verbatim MIT + exact copyright line).
3. Resolve the pre-existing work-email occurrences in `.planning/` (Pitfall 1) so the guard
   can pass truthfully.
4. Run the ASCII gate + work-email guard (scriptable).
5. Run `claude plugin validate . --strict` (hard gate).
6. Run `plugin-validator` agent, then `skill-reviewer` agent.
7. Triage findings per D-06 (fix now vs. record-and-defer to Phase 5), then commit.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| MIT license text | Retype/paraphrase the MIT terms | Copy `lz-cybernetics-ai-plugins/LICENSE` verbatim (already has `Copyright (c) 2026 Lars Gyrup Brink Nielsen`) | Any paraphrase risks an invalid/ambiguous grant; the maintainer's file is already the canonical OSI text with the exact required copyright line |
| Manifest/structure validation | Hand-check JSON + directory layout | `claude plugin validate . --strict` + `plugin-validator` agent | First-party validator knows the real schema; already passing today |
| Skill quality review | Manual heuristic review | `skill-reviewer` agent | First-party agent applies the same standards used in plugin-dev's own skills |
| Non-ASCII detection | Eyeball files / custom parser | `git grep -nP '[^\x00-\x7F]' -- <paths>` | PCRE byte-class is exact, ARM64-native, scriptable; verified working |
| Secret/work-email leak scan | Manual review | `git grep -nE '@consensus\.dk' -- <scoped paths>` | Deterministic tripwire; the domain alone is a sufficient, low-false-positive needle |

**Key insight:** Every capability this phase needs already exists as a first-party tool or a
sibling-repo artifact. The work is alignment + verification, not construction.

## Common Pitfalls

### Pitfall 1: The work-email literal is ALREADY in tracked `.planning/` files (public repo leak)
**What goes wrong:** D-04 says "verify absence with an allowlist check (grep ... across
tracked files -> expect zero hits)" and claims "Confirmed absent at discuss time." Research
found this is FALSE across the full tree. The work-email literal (the `consensus\.dk`
domain) appears in two tracked files:
- `.planning/phases/04-distribution-hygiene/04-CONTEXT.md`
- `.planning/phases/04-distribution-hygiene/04-DISCUSSION-LOG.md`

Both were written by GSD tooling while documenting the "work email must appear nowhere"
rule. Because the GitHub repo is public, `.planning/` is public too, so the work email is
currently exposed. A full-tree guard (`git grep -qE '@consensus\.dk'`) returns exit 0 (FOUND)
today [VERIFIED during research].
**Why it happens:** GSD discuss-phase artifacts quote the rule verbatim, embedding the very
literal the rule forbids. The "confirmed absent" note referred to the shippable surface, not
the whole tree.
**How to avoid:** The plan MUST make an explicit scope decision (see Open Questions Q1).
Recommended: REDACT the literal in those two `.planning/` files (replace with a clearly
non-matching form such as `<work-email-redacted>` or `lgbn[at]consensus[dot]dk`) so the
FULL-TREE guard truthfully returns zero hits -- this is the only reading that satisfies
DIST-02's "appears nowhere in the repo" for a public repo. Editing GSD planning records to
redact a secret is safe (GSD does not re-parse the email from them). Do NOT introduce any
NEW occurrence: the plan/RESEARCH/SUMMARY docs must reference the work email only in a
redacted/escaped form.
**Warning signs:** `git grep -lE '@consensus\.dk'` returns any path; the guard "passes" only
because it was silently scoped to exclude `.planning/`.

### Pitfall 2: `.planning/` already contains non-ASCII; a full-tree ASCII gate fails on out-of-scope content
**What goes wrong:** DIST-03 says "all committed output ASCII-only." A full-tree scan trips
on pre-existing GSD-generated non-ASCII the phase never authored: `.planning/STATE.md` has an
em-dash and block-drawing progress bars (`[##########]` rendered with U+2588), and
`01-SECURITY.md` has an em-dash [VERIFIED: `git grep -nP '[^\x00-\x7F]'` hit these].
**Why it happens:** GSD tooling emits Unicode in its own status/progress docs, independent of
this repo's ASCII convention.
**How to avoid:** Scope the ASCII gate to the SHIPPABLE/publishable surface -- the files that
constitute the plugin plus the two new root docs -- NOT `.planning/`. Verified-clean scope:
`plugins/`, `.claude-plugin/`, `README.md`, `LICENSE`. This scope returns exit 1 (clean)
today [VERIFIED]. Treat pre-existing `.planning/` non-ASCII like the empty-`AGENTS.md` item:
out of DIST scope, flag-only.
**Warning signs:** ASCII gate fails citing `.planning/STATE.md` progress bars -- that is scope
leakage, not a real DIST-03 violation.

### Pitfall 3: Guard/gate commands that trip their own checks (self-reference trap)
**What goes wrong:** A doc (PLAN.md, SUMMARY.md, or a committed script) that embeds the plain
work-email literal or the plain domain inside the guard command example becomes a match for
that very guard, failing DIST-02. Likewise a doc that pastes an em-dash while describing the
ASCII rule trips the ASCII gate.
**Why it happens:** Documenting a "search for X" command naturally embeds X.
**How to avoid:** Write the needle with an escaped dot (`@consensus\.dk`) -- the escaped form
does NOT match the plain-dot regex, so a doc containing the command does not self-trip
[VERIFIED: this file uses the escaped form and the full-tree guard does not match this file].
Refer to the work email in prose only in a redacted form. When documenting the ASCII rule,
use ASCII replacements (`->`, straight quotes) exclusively.
**Warning signs:** The guard reports a hit whose only source is the guard's own documentation.

### Pitfall 4: `skill-reviewer` WILL flag the 750-char description and the 578-word body -- these are Phase-5 defer items, not Phase-4 fixes
**What goes wrong:** `skill-reviewer` uses heuristics "description not too long >500 chars"
and "SKILL.md body should be 1,000-3,000 words" [VERIFIED: read the agent]. The current skill
has a 750-char `description` and a 578-word body [VERIFIED: measured]. So the agent will very
likely emit: (a) "description too long" and (b) "body too short / add content." Both are
predictable, NOT defects.
**Why it happens:** The skill was deliberately authored lean (SKILL-06 progressive
disclosure: heavy material in `references/`) with a scoped 750-char description (<= the 1024
hard limit per SKILL-05), and empirical description tuning was explicitly deferred to Phase 5
(Phase-3 D-10).
**How to avoid:** Apply D-06 triage. The description-length finding is a `description`/
triggering-effectiveness concern -> RECORD and DEFER to Phase 5 (EVAL-01/02). The body
word-count finding is a subjective content-organization suggestion that conflicts with the
intentional lean design -> RECORD, dismiss-with-rationale (references total ~40 KB of depth:
`transformations.md`, `fibonacci-worked-example.md`, `typescript-and-tco.md`), do NOT inflate
the body to chase the heuristic. Neither blocks the ship.
**Warning signs:** A plan task that says "shorten the description" or "expand SKILL.md to
1000+ words" -- that is pulling Phase-5 empirical work forward, forbidden by D-06.

### Pitfall 5: `plugin-validator` may warn that README/LICENSE are missing at the PLUGIN root
**What goes wrong:** `plugin-validator` locates the plugin root via `.claude-plugin/plugin.json`
(so `plugins/lz-tdd/`) and its "File Organization" step checks that a README and a LICENSE
exist [VERIFIED: read the agent, step 9]. Our README + LICENSE live at the REPO/marketplace
root per D-01/D-03, so the agent may emit "README missing" / "LICENSE missing" warnings when
pointed at the plugin.
**Why it happens:** The agent is designed for a standalone plugin; a single-plugin marketplace
documents at the repo root instead.
**How to avoid:** Triage as minor/by-design (a root LICENSE covers the plugin; the root README
is the documented landing page). OPTIONAL low-cost mitigation permitted by D-01: add a
one-line `plugins/lz-tdd/README.md` pointer to the root README, which preempts the per-plugin
README warning without duplicating content. A per-plugin LICENSE is not needed (root LICENSE +
`license: "MIT"` field is standard for a monorepo marketplace).
**Warning signs:** Treating a "plugin-root README/LICENSE missing" warning as a blocker and
duplicating docs into `plugins/lz-tdd/` (drift risk).

### Pitfall 6: README / manifest / LICENSE drift
**What goes wrong:** The README states an install command, plugin name, invocation, contact,
or license that disagrees with `marketplace.json` / `plugin.json` / `LICENSE`.
**Why it happens:** Re-typing values instead of lifting them.
**How to avoid:** Lift verbatim: install strings from CONTEXT `<specifics>`; email/license/URL
from the manifests; MIT text + copyright line from the sibling LICENSE. Post-write, grep the
README for the exact install strings, `/lz-tdd:lz-tpp`, and `larsbrinknielsen@gmail.com` to
confirm presence.

### Pitfall 7: `claude plugin validate` output itself is non-ASCII -- do not confuse tool stdout with committed content
**What goes wrong:** The validator prints a Unicode check glyph (U+2714) on success
[VERIFIED: observed in output]. If a task pipes that stdout into a committed log/summary, it
imports non-ASCII into the repo.
**How to avoid:** The ASCII gate scans COMMITTED FILES, never tool stdout. Do not paste raw
validator output into committed docs; summarize in ASCII (e.g., "validate: PASS, exit 0").

## Code Examples

Verified commands (run during research on this repo, Windows arm64, Git Bash).

### Hard gate: first-party CLI validation (DIST-03)
```bash
# Run from repo root. Exit 0 = pass. --strict treats warnings as errors.
claude plugin validate . --strict
# VERIFIED 2026-07-02: exit 0 today, both with and without --strict.
```

### ASCII-only gate, scoped to the shippable surface (DIST-03)
```bash
# rc=1 => clean (no non-ASCII). rc=0 => FOUND (fail). Use -q for a clean exit code
# (do NOT read $? after a pipe -- that returns head's exit, not git grep's).
git grep -qP '[^\x00-\x7F]' -- 'plugins/' '.claude-plugin/' 'README.md' 'LICENSE'
echo "ascii rc=$?   # 1 = PASS (clean), 0 = FAIL (non-ASCII found)"

# To LIST offenders when it fails:
git grep -nP '[^\x00-\x7F]' -- 'plugins/' '.claude-plugin/' 'README.md' 'LICENSE'
# VERIFIED 2026-07-02: rc=1 (clean) on this scope. Full-tree scope FAILS on .planning/ (Pitfall 2).
```

### Work-email guard (DIST-02)
```bash
# Escaped-dot needle so this command, when committed in a doc, does not match itself.
# Publishable-surface scope (excludes GSD planning meta-docs):
git grep -qE '@consensus\.dk' -- ':(exclude).planning/'
echo "email(publishable) rc=$?   # 1 = absent (PASS), 0 = FOUND (FAIL)"

# Full-tree truth check (recommended after redacting .planning/ per Pitfall 1):
git grep -qE '@consensus\.dk'
echo "email(full-tree) rc=$?      # target: 1 = absent"

# List any offenders:
git grep -lE '@consensus\.dk'
# VERIFIED 2026-07-02: full-tree rc=0 (FOUND in 2 .planning/ files); publishable-scope rc=1 (absent).
```

### Confirm required strings ARE present (positive checks)
```bash
# Public email present in manifests (VERIFIED present in both):
git grep -nE 'larsbrinknielsen@gmail\.com' -- '.claude-plugin/' 'plugins/' 'README.md'
# After authoring, confirm README carries install + invocation strings:
git grep -nF '/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins' -- 'README.md'
git grep -nF '/plugin install lz-tdd@lz-engineering-claude-plugins' -- 'README.md'
git grep -nF '/lz-tdd:lz-tpp' -- 'README.md'
```

### Verbatim MIT LICENSE (copy-ready, exact required text)
```
MIT License

Copyright (c) 2026 Lars Gyrup Brink Nielsen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
Source: verbatim from `D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\LICENSE`
[VERIFIED: read during research]; identical to the OSI MIT template
[CITED: opensource.org/license/mit].

### Running the two review agents (NOT CLI commands)
`plugin-validator` and `skill-reviewer` are `plugin-dev` SUBAGENTS, not scriptable CLIs. In
a Claude Code session with `plugin-dev` installed, invoke them via natural language / the Task
tool, e.g. "use the plugin-validator agent to validate the plugin" and "use the skill-reviewer
agent to review the lz-tpp skill." Each emits a Markdown report with findings categorized
critical/major/minor and an overall PASS / NEEDS-IMPROVEMENT verdict. Only `claude plugin
validate` gives a programmatic exit code. [VERIFIED: read both agent definitions; both declare
read-only tools (Read/Grep/Glob[/Bash]).]

## Runtime State Inventory

Not a rename/refactor/migration phase in the code sense. However, one repo-state fact is
load-bearing and is surfaced explicitly here (full detail in Pitfall 1):

| Category | Items Found | Action Required |
|----------|-------------|-----------------|
| Secrets/PII in tracked files | Work-email literal (`consensus\.dk` domain) present in `.planning/phases/04-distribution-hygiene/04-CONTEXT.md` and `04-DISCUSSION-LOG.md` | Redact in both files (or make an explicit guard-scope decision) so DIST-02 "appears nowhere" holds for the public repo -- see Open Questions Q1 |
| Non-ASCII in tracked files | `.planning/STATE.md` (em-dash + U+2588 progress bars), `.planning/phases/01-.../01-SECURITY.md` (em-dash) | None for DIST-03 (out of shippable scope); scope the ASCII gate to publishable surface -- Pitfall 2 |
| Build artifacts | None -- pure JSON + Markdown, no build step | None |
| OS-registered state | None | None |
| Live service config | None | None |

## State of the Art

| Old Approach | Current Approach | When | Impact |
|--------------|------------------|------|--------|
| `commands/` dir for slash commands | Skills produce the `/{plugin}:{skill}` command; `commands/` is legacy | 2026 Claude Code line | `lz-tpp` is skill-only; README documents `/lz-tdd:lz-tpp` (no `commands/`) |
| Validate by eyeballing manifests | `claude plugin validate` with `--strict` CI flag | Current (2.1.x) | Use `--strict` as the hard gate to also catch unrecognized-field/metadata warnings |

**Deprecated/outdated:**
- `when_to_use` skill frontmatter field -- `skill-reviewer` notes it is deprecated; use
  `description` only. (Our skill already omits it -- no action.) [CITED: skill-reviewer.md]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The MIT text at `lz-cybernetics-ai-plugins/LICENSE` is byte-identical to the OSI canonical MIT template | Code Examples / Don't Hand-Roll | Low -- text was read and matches the well-known OSI template; a stray whitespace diff is cosmetic and license-neutral |
| A2 | `skill-reviewer` will flag the 750-char description and 578-word body per its stated >500-char / 1000-3000-word heuristics | Pitfall 4 | Low -- heuristics are explicit in the agent def; even if it does not flag, the triage guidance is unaffected |
| A3 | `plugin-validator`'s README/LICENSE "File Organization" check evaluates the PLUGIN root (`plugins/lz-tdd/`), not the marketplace root | Pitfall 5 | Medium -- if it evaluates repo root instead, the warning does not occur and the optional pointer-README is unnecessary; either way non-blocking |
| A4 | `.planning/` is published to the public GitHub repo (so its contents count for DIST-02 "nowhere in the repo") | Pitfall 1 / Open Q1 | Medium -- if `.planning/` is stripped before/at ship, the public leak concern narrows to a git-history concern only; the redaction recommendation still holds as the safe default |

**Note on this file:** written ASCII-only and deliberately avoids the plain work-email
literal and plain work-domain (uses the escaped `@consensus\.dk` form) so it does not itself
trip the DIST-02/DIST-03 gates when committed under `.planning/`.

## Open Questions

1. **What is the correct scope for the DIST-02 work-email guard, given the literal already
   exists in two tracked `.planning/` files of a PUBLIC repo?**
   - What we know: Full-tree `git grep -qE '@consensus\.dk'` returns FOUND today (2 hits in
     `04-CONTEXT.md`, `04-DISCUSSION-LOG.md`); publishable-scope (excluding `.planning/`)
     returns absent. D-04 wants "zero hits across tracked files"; DIST-02 wants "appears
     nowhere in the repo."
   - What's unclear: Whether the phase should (a) redact the literal in those two GSD docs so
     the full-tree guard truly passes, or (b) scope the guard to the publishable surface and
     accept `.planning/` exposure, or (c) also address git history.
   - Recommendation: (a) REDACT in both files (safe; GSD does not re-parse the email) AND run
     the FULL-TREE guard as the DIST-02 gate. This is the only option that literally satisfies
     "appears nowhere." Flag git-history scrubbing as out of scope (a separate, heavier
     operation) unless the user requests it.

2. **`AGENTS.md` is 0 bytes but imported by `CLAUDE.md` via `@AGENTS.md` -- fix in Phase 4?**
   - What we know: Confirmed 0 bytes [VERIFIED: `ls` + read]. CONTEXT explicitly defers it as
     a separate hygiene task, NOT DIST-01/02/03 scope.
   - Recommendation: Leave out of Phase 4 scope (respect roadmap traceability). Surface to the
     user as a one-line optional fix (populate with agent-agnostic rules, or remove the empty
     import). Not a ship blocker.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`plugin validate`) | DIST-03 hard gate | Yes | 2.1.198 | none needed |
| `plugin-dev` `plugin-validator` agent | DIST-03 | Yes (installed) | claude-plugins-official | none needed |
| `plugin-dev` `skill-reviewer` agent | DIST-03 | Yes (installed) | claude-plugins-official | none needed |
| `git grep -P` (PCRE) | ASCII + email gates | Yes | git w/ PCRE (probed OK) | `rg -n '[^\x00-\x7F]'` |
| `node` | measurement/scripting | Yes | present | none needed |
| Git remote `origin` -> public GitHub | install command resolution | Yes (pushed, per STATE.md) | -- | none needed |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none material.

## Validation Architecture

`nyquist_validation` is enabled. This phase has no unit-test framework (pure docs + config);
"validation" is the review-gate + hygiene-guard suite. The gates ARE the tests.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none (no runtime code) -- verification via CLI gate + agents + `git grep` guards |
| Config file | none |
| Quick run command | `claude plugin validate . --strict` |
| Full suite command | ASCII gate + work-email guard + `claude plugin validate . --strict` + `plugin-validator` + `skill-reviewer` |

### Phase Requirements -> Verification Map
| Req ID | Behavior | Type | Command / Action | Exists? |
|--------|----------|------|------------------|---------|
| DIST-01 | README documents install + usage + invocation | doc-presence | `git grep -nF '/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins' -- README.md` (and the install + `/lz-tdd:lz-tpp` strings) | Wave 0 (README not yet written) |
| DIST-02 | MIT LICENSE present, public contact, work email nowhere | file + guard | LICENSE exists + `git grep -nE 'larsbrinknielsen@gmail\.com' -- LICENSE README.md` present + `git grep -qE '@consensus\.dk'` absent | Wave 0 (LICENSE not yet written; guard command verified) |
| DIST-03 | Passes CLI validate + agents; ASCII-only | gate + agents | `claude plugin validate . --strict` (verified PASS) + ASCII gate (verified clean on scope) + `plugin-validator` + `skill-reviewer` reports triaged per D-06 | Partial (CLI gate green now; agents run at execute time) |

### Sampling Rate
- **Per task commit:** ASCII gate + work-email guard (fast, scriptable).
- **Per wave / phase gate:** `claude plugin validate . --strict` green + both agent reports
  triaged (no un-triaged critical/major structural/security/ASCII findings).
- **Phase gate:** all of the above clean before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `README.md` (root) -- covers DIST-01 (does not exist yet)
- [ ] `LICENSE` (root) -- covers DIST-02 (does not exist yet)
- [ ] Redact work-email literal in the two `.planning/` files -- enables the DIST-02 full-tree
      guard to pass truthfully (Pitfall 1 / Open Q1)
- No test-framework install needed (no runtime code).

## Security Domain

`security_enforcement` is not set in config (absent = enabled). This is a docs/licensing
phase; the only live security surface is information disclosure (the work email) and manifest
path safety (which `plugin-validator` already checks).

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | no (no runtime input) | -- |
| V6 Cryptography | no | -- |
| V7/V8 Data protection & privacy | yes | Work-email (PII) leak prevention: redact + full-tree guard (Pitfall 1) |
| V14 Config | yes | No hardcoded credentials/secrets in manifests/docs; relative `./` source paths only (no path traversal) -- both checked by `plugin-validator` |

### Known Threat Patterns for a public plugin marketplace
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Work/PII email exposed in public repo (incl. `.planning/`) | Information Disclosure | Redact literal in tracked files; DIST-02 full-tree `git grep` guard returns zero (Pitfall 1) |
| `../` / absolute paths in manifest `source` (path traversal) | Tampering | Relative `./plugins/lz-tdd` only (already compliant, MKT-01); `plugin-validator` verifies |
| Hardcoded credentials/secrets in committed files | Information Disclosure | `plugin-validator` security step + no secrets introduced by README/LICENSE |

No secrets, auth, or network surface is introduced by this phase.

## Sources

### Primary (HIGH confidence)
- `claude plugin validate --help` and live runs against this repo (Claude Code 2.1.198) --
  confirmed the `--strict` flag, marketplace-manifest validation, and current PASS (exit 0).
- `plugin-dev` agent definitions on disk:
  `.../claude-plugins-official/plugins/plugin-dev/agents/plugin-validator.md` and
  `skill-reviewer.md` -- exact validation steps, severity model, README/LICENSE + description
  + word-count heuristics.
- Repo files read directly: `SKILL.md`, `plugin.json`, `marketplace.json`, `references/*`,
  all Phase 1/3/4 CONTEXT, REQUIREMENTS, ROADMAP, PROJECT, config.json.
- Sibling-repo precedents read directly: `lz-advisor-claude-plugins/README.md` (structure/tone
  precedent) and `lz-cybernetics-ai-plugins/LICENSE` (verbatim MIT + exact copyright line).
- Live `git grep` gate/guard runs on this repo (ASCII scope clean; work-email full-tree FOUND
  in 2 `.planning/` files; SKILL.md description 750 chars, body 578 words).

### Secondary (MEDIUM confidence)
- OSI MIT License canonical text [CITED: opensource.org/license/mit] -- cross-reference for
  the LICENSE template (matched against the sibling repo's file).

### Tertiary (LOW confidence)
- None. All claims verified against tools or on-disk sources.

## Metadata

**Confidence breakdown:**
- Standard stack / tools: HIGH -- every tool verified present and exercised.
- Review-gate behavior: HIGH -- CLI run live; both agent definitions read in full.
- README/LICENSE content: HIGH -- exact strings + verbatim MIT text lifted from on-disk sources.
- Hygiene guards (ASCII + work-email): HIGH -- commands executed against the repo; exact
  pass/fail exit codes and scope caveats verified.
- Findings triage: HIGH -- the two predictable `skill-reviewer` findings were measured and map
  cleanly onto D-06's defer/dismiss rules.

**Research date:** 2026-07-02
**Valid until:** ~2026-08-02 (stable; only risk is a Claude Code CLI/agent update changing
`claude plugin validate` or the agent heuristics -- re-verify if CLI version advances materially)
</content>
</invoke>
