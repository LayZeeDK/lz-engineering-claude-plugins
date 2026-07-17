# Phase 4: Distribution & Hygiene - Pattern Map

**Mapped:** 2026-07-02
**Files analyzed:** 3 (2 required + 1 optional)
**Analogs found:** 3 / 3 (all sibling-repo or in-repo manifest analogs; NO in-repo README/LICENSE precedent exists -- that is what this phase creates)

## Honest scope note (read first)

This is a documentation + licensing + review phase. There is NO existing `README.md` or
`LICENSE` in THIS repo -- creating them is the phase. So there are no in-repo analogs of the
same kind to copy. The real analogs are:

1. Sibling-repo precedents already read verbatim in `04-RESEARCH.md`:
   - README structure/tone: `D:\projects\github\LayZeeDK\lz-advisor-claude-plugins\README.md`
   - Verbatim MIT LICENSE (with the EXACT required copyright line):
     `D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\LICENSE`
2. In-repo source-of-truth for every identity string (email, license, repo URL, plugin/skill
   names, invocation) -- the two manifests:
   - `.claude-plugin/marketplace.json`
   - `plugins/lz-tdd/.claude-plugin/plugin.json`
3. In-repo tone/format precedent for terse ASCII Markdown:
   - `plugins/lz-tdd/skills/lz-tpp/SKILL.md`

The planner should COPY structure from (1), LIFT identity values from (2), and MATCH tone
from (3). Do not invent new identity values -- every string the README/LICENSE assert already
lives in the manifests. This map is deliberately short; padding it with invented analogs
would be worse than naming the real cross-repo sources.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `README.md` (repo root) | documentation | transform (manifest identity -> human doc) | `lz-advisor-claude-plugins/README.md` (sibling) | structure-match (external) |
| `LICENSE` (repo root) | config / legal text | static-text (verbatim copy) | `lz-cybernetics-ai-plugins/LICENSE` (sibling) | exact (copy-ready, exact copyright line) |
| `plugins/lz-tdd/README.md` (OPTIONAL, D-01) | documentation | static pointer | `lz-advisor-claude-plugins/README.md` "See ... for full documentation" line (inverted: points UP to root) | role-match (external) |

## Pattern Assignments

### `README.md` (documentation, transform)

**Structure analog:** `D:\projects\github\LayZeeDK\lz-advisor-claude-plugins\README.md` (27 lines, terse, CLI-focused, no screenshots).

**Structure pattern to mirror** (lz-advisor README, lines 1-26):
- Line 1: `# <repo-name>` H1 title.
- Line 3: one-line purpose sentence with a Markdown link.
- Lines 5-13: a small structure/orientation section (lz-advisor uses a Directory Structure table; here D-01 wants a "What this is" marketplace -> plugin -> skill orientation).
- Lines 15-20: `## Installation` with a fenced code block containing the two `/plugin` commands verbatim.
- Line 22: a "see full docs" pointer (progressive disclosure).
- Lines 24-26: a one-word `## License` section (`MIT`).

Follow lz-advisor's TONE (terse, no fluff) but the RICHER D-01 section order, because here the
root README is the primary shippable doc (lz-advisor delegates depth to a per-plugin README;
this repo keeps depth at root per D-01). Recommended section order is spelled out verbatim in
`04-RESEARCH.md` "Architecture Patterns" (lines 176-198).

**Identity values to LIFT (do NOT retype from memory) -- source: in-repo manifests:**

From `.claude-plugin/marketplace.json` (verified this session):
- Marketplace name (H1 / install target): `lz-engineering-claude-plugins` (line 3)
- Marketplace description: `Engineering-focused plugins for Claude Code.` (line 4)
- Owner / contact: `larsbrinknielsen@gmail.com` (line 7)
- Plugin entry name + source: `lz-tdd`, `./plugins/lz-tdd` (lines 11-12)

From `plugins/lz-tdd/.claude-plugin/plugin.json` (verified this session):
- Plugin name / version: `lz-tdd` / `0.0.1` (lines 2-3)
- Author + public email: `Lars Gyrup Brink Nielsen` / `larsbrinknielsen@gmail.com` (lines 5-7)
- Repo + homepage URL: `https://github.com/LayZeeDK/lz-engineering-claude-plugins` (lines 9-10)
- License field: `MIT` (line 11)

**Install block to embed verbatim** (from CONTEXT `<specifics>`, lines 159-161; DIST-01):
```
/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
/plugin install lz-tdd@lz-engineering-claude-plugins
```

**Invocation + coach note to document** (DIST-01):
- Explicit reference invocation: `/lz-tdd:lz-tpp`
- Note that the skill auto-triggers as a coach during red-green-refactor TDD.

**Skill purpose wording -- MATCH tone from in-repo `SKILL.md`** (lines 15-19, verified):
The skill "operationalizes Robert C. Martin's Transformation Priority Premise (TPP): during
red-green-refactor TDD, prefer the simplest (highest-priority) code transformation that makes
the current failing test pass." Two modes: coach (recommend the next NAMED transformation) and
reference (explain the transformations + ordering). The README summary should paraphrase this
briefly, not restate the transformation list (D-02).

**Progressive-disclosure pointer (D-02) -- point, do NOT inline:**
- Bundled canonical list pointer path (verified to exist this session):
  `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`
- (Also present, do not inline: `references/fibonacci-worked-example.md`,
  `references/typescript-and-tco.md`.)
- Link the three authoritative TPP sources from `PROJECT.md` Context (2 Clean Code posts +
  NDC 2011 talk `B93QezwTQpI`). Do NOT inline the 14-item list or worked examples -- that keeps
  `references/*` the single source of truth (mirrors how `SKILL.md` line 27-28 points at
  `references/transformations.md` instead of restating it).

**Anti-drift rule:** every asserted value (email, license, URL, install strings, invocation)
must be byte-consistent with the manifests + LICENSE. See Shared Patterns > Drift guard.

---

### `LICENSE` (config / legal text, static-text)

**Analog:** `D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\LICENSE` -- EXACT match, copy-ready. Verified this session to already carry the exact required copyright line.

**Copy this verbatim** (byte-identical to the OSI MIT template; source read this session):
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

**Load-bearing constraints (D-03/D-04):**
- Copyright line MUST be exactly `Copyright (c) 2026 Lars Gyrup Brink Nielsen` (matches
  `plugin.json` `author.name`; year 2026). Do NOT introduce a new holder/year/email.
- Do NOT paraphrase the terms (any paraphrase risks an invalid grant). Copy verbatim.
- This same text is also mirrored in `04-RESEARCH.md` Code Examples (lines 404-425) if the
  planner prefers a same-file source.

---

### `plugins/lz-tdd/README.md` (OPTIONAL pointer, static pointer) -- D-01 / Pitfall 5

**Analog:** `lz-advisor-claude-plugins/README.md` line 22 -- the "See [...] for full documentation." pointer pattern, but INVERTED (lz-advisor's ROOT README points DOWN to the per-plugin README; here the per-plugin README would point UP to the ROOT README).

**When to add:** Only if chosen to preempt `plugin-validator`'s likely "plugin-root README
missing" warning (RESEARCH Pitfall 5, lines 321-335). If added, it MUST be a one-line pointer
to the root `README.md`, NEVER a duplicate (D-01 anti-drift). If omitted, triage the validator
warning as minor/by-design (a single-plugin marketplace documents at the repo root).

**Match quality caveat:** role-match only. This is an optional mitigation, not a required
file; the planner may skip it and instead record the validator warning as by-design per D-06.

## Shared Patterns

### ASCII-only committed output (applies to README, LICENSE, optional pointer)
**Source of rule:** project `CLAUDE.md` + `AGENTS.md`; formalized by DIST-03.
**Apply to:** every file this phase writes.
Use `->` (not an arrow glyph), straight quotes, `--` for dashes, no emojis/box-drawing/
em-dashes. Verification gate (scoped to the shippable surface, verified clean this session in
RESEARCH):
```bash
git grep -qP '[^\x00-\x7F]' -- 'plugins/' '.claude-plugin/' 'README.md' 'LICENSE'
# rc=1 => PASS (clean); rc=0 => FAIL (non-ASCII found)
```
Scope note (RESEARCH Pitfall 2, lines 274-287): do NOT run this full-tree -- pre-existing
`.planning/` files contain GSD-emitted non-ASCII the phase never authored. Scope to the
publishable surface only.

### Work-email leak guard (applies to the whole shippable surface; DIST-02 / D-04)
**Source of rule:** memory `public-repo-work-email-allowlist`; D-04.
**Apply to:** README + LICENSE must NOT contain the work email; only `larsbrinknielsen@gmail.com`.
The exact escaped-dot needle command (written so the command itself does not self-trip) is
documented verbatim in `04-RESEARCH.md` "Code Examples > Work-email guard" (lines 376-390) --
the planner should lift the guard command from there rather than have it re-spelled here, so
this map never carries the domain literal. RESEARCH Pitfall 1 (lines 248-272) is load-bearing:
the literal ALREADY exists in two tracked `.planning/` files, so the plan must redact those OR
make an explicit guard-scope decision before the full-tree guard can pass truthfully.

### Identity drift guard (applies to README)
**Source of truth:** `.claude-plugin/marketplace.json` + `plugins/lz-tdd/.claude-plugin/plugin.json`.
**Apply to:** every identity value the README asserts.
Positive-presence checks after authoring (from RESEARCH lines 393-400):
```bash
git grep -nE 'larsbrinknielsen@gmail\.com' -- '.claude-plugin/' 'plugins/' 'README.md'
git grep -nF '/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins' -- 'README.md'
git grep -nF '/plugin install lz-tdd@lz-engineering-claude-plugins' -- 'README.md'
git grep -nF '/lz-tdd:lz-tpp' -- 'README.md'
```

### Review-gate discipline (applies to phase gate, not to a file)
**Source:** D-05 + RESEARCH "Ordering" (lines 223-231).
Write README + LICENSE FIRST (the `plugin-validator` agent checks both exist -- running agents
first guarantees noise findings, RESEARCH anti-pattern line 220-222). Then run, in order:
scriptable guards (ASCII + work-email) -> `claude plugin validate . --strict` -> `plugin-validator`
agent -> `skill-reviewer` agent. Triage every agent finding through D-06 (fix
structural/hygiene/security/install-breaking/ASCII/factual now; record-and-defer every
`description`/triggering/word-count/coaching finding to Phase 5). Predictable defer-items:
RESEARCH Pitfall 4 (750-char description, 578-word body) and Pitfall 5 (plugin-root
README/LICENSE warning).

## No Analog Found (in-repo)

No IN-REPO file of the same kind exists for the two required files -- expected, since creating
them IS the phase. The planner should use the sibling-repo analogs named above (already read
verbatim in RESEARCH), not RESEARCH's generic "Code Examples" as a substitute for structure.

| File | Role | Data Flow | Reason no in-repo analog |
|------|------|-----------|--------------------------|
| `README.md` | documentation | transform | No README exists in this repo yet; nearest kin is the sibling `lz-advisor-claude-plugins/README.md` |
| `LICENSE` | config / legal | static-text | No LICENSE exists in this repo yet; verbatim copy-source is the sibling `lz-cybernetics-ai-plugins/LICENSE` |

## Metadata

**Analog search scope:** this repo root, `.claude-plugin/`, `plugins/lz-tdd/` (manifests +
skill), and the two maintainer sibling repos named in RESEARCH (`lz-advisor-claude-plugins`,
`lz-cybernetics-ai-plugins`).
**Files scanned this session:** 6 (04-CONTEXT.md, 04-RESEARCH.md, marketplace.json,
plugin.json, sibling LICENSE, sibling README) + SKILL.md head + skill references glob.
**Pattern extraction date:** 2026-07-02
