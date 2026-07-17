# Phase 10: Distribution & Hygiene - Pattern Map

**Mapped:** 2026-07-09
**Files analyzed:** 5 (all MODIFIED; 0 created)
**Analogs found:** 5 / 5 (every target is an intra-file mirror -- a sibling section, a
predecessor entry, or an existing in-file code path)

> This is an EDIT phase, not a CREATE phase. There are no new files. The "analog" for
> each target is a pattern that ALREADY lives in the same file (the `lz-tpp` README
> section, the `0.0.1` CHANGELOG entry, the existing manifest fields, the existing
> ASCII/email checker axes). The planner should specify each change as a diff-in-words
> against the excerpts below, not as new construction.
>
> CLEAN-ROOM NOTE: nothing under `.oracle/` was read. This map covers code/prose
> STRUCTURE only. The DST-04 layer-2 book-prose comparison is handled entirely by the
> `oracle-reviewer` subagent (D-01 L2) and is out of this map's scope by design.

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `README.md` | documentation prose | static doc | `## What lz-tpp does` + `## Transformation Priority Premise` sections in the SAME file (README:29-61) | exact (intra-file sibling) |
| `CHANGELOG.md` | documentation prose (Keep a Changelog) | static doc | `## [lz-tdd@0.0.1]` entry in the SAME file (CHANGELOG:8-32) | exact (intra-file predecessor) |
| `plugins/lz-tdd/.claude-plugin/plugin.json` | JSON manifest | config | its own current `version`/`description`/`keywords` fields | exact (in-place field edit) |
| `.claude-plugin/marketplace.json` | JSON manifest | config | `plugin.json` `description` (the two listing strings must agree) | exact (sibling field) |
| `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | Node.js ESM checker | file-I/O batch scan | existing axis (a)/(b) HARD checks + `report()`/`walkMd()`/explicit-`targets.push` in the SAME file | exact (intra-file code path) + one novel split (see No Analog) |

## Pattern Assignments

### `README.md` (documentation prose) -- D-05, D-06, D-07

**Analog:** the two existing `lz-tpp` blocks in the same file.

**Change 1 -- lead paragraph reword (README:3-5).** Currently claims a one-skill plugin:

```markdown
Engineering-focused plugins for Claude Code. The first plugin, `lz-tdd`, ships
`lz-tpp` -- a test-driven-development coach and reference for Robert C. Martin's
Transformation Priority Premise (TPP).
```

D-05 requires this to stop claiming the plugin ships only `lz-tpp` -- reword to a
two-skill lead. The red-green-refactor seam (`lz-tpp` at the green step, `lz-refactor`
at the refactor step) is the best one-sentence pitch for the pair (CONTEXT `<specifics>`).

**Change 2 -- "What this is" bullets become a two-skill listing (README:11-13).** Today:

```markdown
- **Marketplace:** `lz-engineering-claude-plugins` (this repo)
- **Plugin:** `lz-tdd` -- a plugin for test-driven-development skills
- **Skill:** `lz-tpp` -- invoked as `/lz-tdd:lz-tpp`
```

Add an `lz-refactor` skill bullet mirroring the `lz-tpp` bullet's `/lz-tdd:<skill>`
invocation shape. (D-05: "the bullet list must become a two-skill listing".)

**Change 3 -- Installation block is UNCHANGED (README:21-27).** Lift verbatim; do not
touch. The two `/plugin` commands stay exactly:

```markdown
/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
/plugin install lz-tdd@lz-engineering-claude-plugins
```

**Change 4 -- ADD a `## What lz-refactor does` section mirroring `## What lz-tpp does`
(README:29-40).** This is the exact two-mode shape to copy:

```markdown
## What lz-tpp does

`lz-tpp` helps you keep an implementation at the simplest transformation that
passes the current failing test during red-green-refactor TDD.

- **Coach (auto-triggering):** when a failing test and the current code are
  present, it recommends the next named code transformation by TPP priority --
  the simplest change that makes the test pass -- with impasse and backtracking
  guidance. It coaches; it does not edit your code or run your tests.
- **Reference (on demand):** invoke `/lz-tdd:lz-tpp` to have it explain the
  transformations and their priority ordering.
```

For `lz-refactor`: same two-bullet Coach/Reference structure -- coach mode
auto-triggers at the REFACTOR step; reference mode is invoked via
`/lz-tdd:lz-refactor` (CONTEXT `<specifics>`; D-05).

**Change 5 -- ADD a refactoring primer + sources + references pointer, mirroring the
`## Transformation Priority Premise` block (README:41-61).** The shape to copy
(original primer -> "Authoritative sources:" LINK-ONLY list -> a `references/` pointer):

```markdown
## Transformation Priority Premise

The Transformation Priority Premise (TPP), described by Robert C. Martin, is an
ordered list of small "transformations" ... [brief ORIGINAL primer]

Authoritative sources:

- The Transformation Priority Premise --
  https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
- ...

For the canonical transformation list and ordering rationale, see
`plugins/lz-tdd/skills/lz-tpp/references/transformations.md`.
```

For `lz-refactor` (D-06): brief ORIGINAL refactoring primer (DST-04 applies -- original
prose), then cite Fowler *Refactoring* 2nd ed + Kerievsky *Refactoring to Patterns* by
title/author/publisher-or-ISBN LINK ONLY (never inline), then a pointer into
`plugins/lz-tdd/skills/lz-refactor/references/`.

**D-07 inventory line (optional, all FACTS).** RESEARCH verified 2026-07-09: 62 Fowler
refactorings, 27 Kerievsky pattern-directed refactorings, 23 GoF + 5 extra patterns, 19
functional de-patterning idioms, 28 code smells. MUST recount against the live tree at
write time (do NOT transcribe from CONTEXT or RESEARCH). MUST NOT imply a complete Beck
or Feathers catalog.

**Change 6 -- License block UNCHANGED (README:63-65).** Public gmail contact + MIT stay.

---

### `CHANGELOG.md` (Keep a Changelog) -- D-15, D-16

**Analog:** the `## [lz-tdd@0.0.1]` entry in the same file (CHANGELOG:8-32). Copy its
four structural parts exactly, new entry ABOVE the 0.0.1 entry:

```markdown
## [lz-tdd@0.0.1] - 2026-07-04

First public release of the `lz-engineering-claude-plugins` marketplace: the `lz-tdd`
plugin and its dual-mode `lz-tpp` skill (`/lz-tdd:lz-tpp`).

### Added

- **Marketplace**: public Claude Code marketplace ...
- **`lz-tdd` plugin**: manifest at version 0.0.1, ...
- **`lz-tpp` skill** (`/lz-tdd:lz-tpp`): dual-mode ...
- **Canonical TPP reference** (`references/transformations.md`): ...
- **TypeScript guidance**: ...
- **Distribution**: root `README.md` (install and usage) and an MIT `LICENSE`.

[lz-tdd@0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1
```

Structural parts to mirror for the new `## [lz-tdd@0.0.2] - <date>` entry:
1. Heading `## [lz-tdd@0.0.2] - <date>`.
2. One-paragraph lead.
3. `### Added` list of bold-led bullets (0.0.1 used 6; RESEARCH open-question 2 suggests
   one bullet per deliverable: the skill, five catalogs, smell taxonomy, coach
   procedure, three principle-backing refs -- D-17 granularity).
4. Bottom link-ref: `[lz-tdd@0.0.2]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.2`
   -- note the URL-encoded `%40` for `@` (mirrors the 0.0.1 ref verbatim). D-16: the tag
   does NOT exist yet; that is correct and matches the 0.0.1 precedent.

Content rules: "link, don't inline" (same as D-06); tag the three no-oracle
principle-backing refs as core-only; do NOT claim a complete Beck/Feathers catalog
(D-15, FUT-01 bound).

---

### `plugins/lz-tdd/.claude-plugin/plugin.json` (JSON manifest) -- D-08

**Analog:** the file's own current fields (in-place edits). Three fields change:

```json
  "version": "0.0.1",
  "description": "Test-driven development guidance for Claude Code. Includes the lz-tpp skill operationalizing Robert C. Martin's Transformation Priority Premise (TPP).",
  ...
  "keywords": [
    "tdd",
    "test-driven-development",
    "transformation-priority-premise",
    "tpp",
    "red-green-refactor",
    "clean-code",
    "typescript"
  ]
```

- `version` (line 3): `0.0.1` -> `0.0.2`.
- `description` (line 4): rewrite to two-skill wording (add `lz-refactor`). Today names
  only `lz-tpp`/TPP.
- `keywords` (lines 12-20): keep the existing 7, ADD refactoring vocabulary. RESEARCH
  open-question 2 recommends `refactoring`, `code-smells`, `design-patterns`,
  `gang-of-four` (optionally `fowler`, `kerievsky`). Exact list = D-17.
- LEAVE UNCHANGED: `author.email` (already the public gmail, line 7), `homepage`,
  `repository`, `license`.

---

### `.claude-plugin/marketplace.json` (JSON manifest) -- D-08, D-09

**Analog:** `plugin.json` `description` (the two listing strings must agree on
"two skills"). One field changes:

```json
      "description": "Test-driven development guidance for Claude Code, including Transformation Priority Premise (TPP) coaching.",
```

- `plugins[0].description` (line 13): rewrite to two-skill marketplace-listing wording.
- D-09: do NOT add a `version` field. VERIFIED absent today (no `version` key in the
  file). Adding it is a documented trap (`plugin.json` wins silently, validator warns).
- LEAVE UNCHANGED: `$schema`, top-level `name`/`description`/`owner`, `source`,
  `category`.

---

### `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (Node.js ESM checker) -- D-01 L1, D-10

**Analog:** existing in-file code paths. Four hooks to build against.

**Hook 1 -- `report()` (HARD) vs `warn()` (soft) split (lines 30-41).** D-01 L1 = move
the `(c)` no-verbatim check from `warn()` onto `report()`:

```javascript
const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

const warn = (label, detail) => {
  warnings++;
  console.log(`  [WARN] ${label}${detail ? " -- " + detail : ""}`);
};
```

`report(ok, ...)` increments `failures` and drives the non-zero exit; `warn(...)` never
fails. The (a)/(b) axes already call `report()` (lines 107, 123) -- copy that call shape
for the hardened (c).

**Hook 2 -- the `(c)` no-verbatim block to harden (lines 125-137).** Today a WARN:

```javascript
// (c) no-verbatim heuristic (WARN only).
const quoteRe = /"([^"\n]{1,})"/g;

for (const f of targets) {
  const text = fs.readFileSync(f, "utf8");
  let qm;

  while ((qm = quoteRe.exec(text)) !== null) {
    if (qm[1].length >= QUOTE_THRESHOLD) {
      warn("long quoted run (review for verbatim prose, DST-04)", `${path.relative(repoRoot, f)}: ${qm[1].length} chars`);
    }
  }
}
```

Promote the `>= QUOTE_THRESHOLD` hit from `warn(...)` to a `report(false, ...)` HARD
fail (D-01 L1). `QUOTE_THRESHOLD = 120` is defined at line 25. PITFALL (RESEARCH #2 /
A3): run the hardened gate on today's tree FIRST -- expected GREEN; if a legitimate
120+-char quote trips it, refine the heuristic (tune threshold, or exclude code fences),
never weaken below detection value (T-09-GATE). Also update the header comment (lines
6-9) which currently says "(c) is WARN-level only".

**Hook 3 -- explicit-file `targets.push` vs directory walk (lines 83-89).** THIS is the
analog for adding the non-`.md` D-10 targets (LICENSE has no extension; both manifests
are `.json`):

```javascript
const targets = [];

if (fs.existsSync(SKILL_MD)) {
  targets.push(SKILL_MD);
}

targets.push(...walkMd(REFERENCES));
```

`SKILL_MD` is pushed as an explicit single file (line 85-87); `walkMd(REFERENCES)` adds
the recursive `.md` set. D-10 non-`.md` targets (LICENSE, `plugin.json`,
`marketplace.json`) must be added as explicit `targets.push(...)` entries in THIS style,
NOT via the walk.

**Hook 4 -- `walkMd()` is `.md`-ONLY (lines 51-69).** This is the trap RESEARCH Pitfall
1 flags:

```javascript
} else if (entry.isFile() && entry.name.endsWith(".md")) {
  out.push(full);
}
```

The `.endsWith(".md")` filter (line 63) silently skips LICENSE + JSON manifests -- hence
Hook 3's explicit pushes. `repoRoot` already resolves the repo root (line 17), so
reaching root-level files is a target-set change, not a path-model change. New path
constants needed (mirroring `SKILL_DIR`/`SKILL_MD` at lines 18-20): the `lz-tpp` skill
dir, root `README.md`/`CHANGELOG.md`/`LICENSE`, and both manifest paths.

**Package battery note (D-17).** If the hardened (c) lands as a SIBLING checker instead
of extending this file, it must be added to the `check` script chain in
`.claude/skills/lz-refactor-workspace/package.json` (line 8) -- currently 10 checkers,
`check-hygiene.mjs` is 8th. RESEARCH open-question 1 recommends EXTENDING this file
(lower surface, reuses `repoRoot`) with the per-axis split as two internal arrays.

---

## Shared Patterns

### HARD-fail vs WARN reporting (checker)
**Source:** `check-hygiene.mjs:30-41` (`report()` / `warn()`).
**Apply to:** the D-01 L1 (c) promotion. Copy the `report(false, label, detail)` call
shape already used by axes (a) (line 107) and (b) (line 123).

### Explicit-file-entry target push (checker)
**Source:** `check-hygiene.mjs:85-89` (`targets.push(SKILL_MD)` + `walkMd`).
**Apply to:** every D-10 non-`.md` target (LICENSE, `plugin.json`, `marketplace.json`).
`walkMd` cannot reach them (`.md`-only filter, line 63).

### Email allowlist-subtraction (checker) -- KEEP AS-IS (D-11)
**Source:** `check-hygiene.mjs:22-24, 109-123`.
```javascript
const APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"]);
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
```
Enumerate every email-shaped token, subtract the approved public gmail, assert the
remainder is empty. D-11: NEVER write the work-email literal into any committed file
(not the checker, not a plan, not a report). Reference it only in the escaped
`@consensus\.dk` form when a doc must quote the guard, so the doc does not self-trip.
This axis just needs its target set widened (D-10); the shape is unchanged.

### "Authoritative sources: link, never inline" (prose)
**Source:** `README.md:51-61` (TPP sources block) and `CHANGELOG.md:30` ("Distribution"
bullet).
**Apply to:** README refactoring-sources block (D-06) and the CHANGELOG 0.0.2 entry
(D-15). Cite books by title/author/link; point at `references/`; never inline catalog
entries, mechanics, smell tables, or examples.

### Keep a Changelog entry structure (prose)
**Source:** `CHANGELOG.md:8-32` (heading + lead + `### Added` + bottom link-ref with
`%40`-encoded `@`).
**Apply to:** the new `## [lz-tdd@0.0.2]` entry (D-15/D-16).

## No Analog Found

One structural element in the checker has no direct in-file precedent:

| Element | Role | Data Flow | Reason |
|---------|------|-----------|--------|
| Per-axis target-set SPLIT in `check-hygiene.mjs` | checker | file-I/O batch scan | Today there is ONE `targets` array shared by all three axes (line 83). D-04 + D-10 + RESEARCH "Layer 1 per-axis split" require TWO sets: axes (a) ASCII + (b) work-email scan the WIDE set (both skill trees + root README/CHANGELOG/LICENSE + both manifests); axis (c) no-verbatim scans a NARROWER set (`lz-refactor` tree + NEW README primer + NEW CHANGELOG entry ONLY) -- it must EXCLUDE `lz-tpp` (D-04: `transformations.md` is cited FibTPP by design), LICENSE (verbatim OSI MIT), and the manifests (short quoted JSON). The single-array build (Hook 3) is the closest pattern; the planner specifies a second array. |

RESEARCH open-question 1 recommends implementing the split as two internal target arrays
inside the extended `check-hygiene.mjs` (rather than a sibling checker). Either satisfies
"widen a gate, never weaken one" (T-09-GATE) so long as no existing HARD check is relaxed.

## Metadata

**Analog search scope:** all five edit targets are intra-file mirrors -- no cross-file
codebase search was required (every analog lives in the target file itself). The
workspace `package.json` `check` battery was read for the sibling-checker contingency
(D-17). `.oracle/` was NOT read (clean-room constraint).
**Files scanned:** 6 (5 edit targets + workspace `package.json`).
**Pattern extraction date:** 2026-07-09
