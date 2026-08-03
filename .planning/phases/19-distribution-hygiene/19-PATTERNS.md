# Phase 19: Distribution & Hygiene - Pattern Map

**Mapped:** 2026-07-20
**Files analyzed:** 6 (all MODIFIED existing files; no new source authored)
**Analogs found:** 6 / 6 (every edit target's analog is its own current state and/or a shipped Phase-10 sibling shape)

> This is a documentation + regression-gate + one-scoped-fix phase, NOT new-source
> authoring. Each "analog" below is the file's CURRENT state (the shape to mirror or
> the value to edit), plus the shipped Phase-10 (`lz-tdd@0.0.2`) edits to the same
> files. The planner copies the shape, not new abstractions.
>
> **Hygiene note (public repo):** this file contains ONLY the approved public gmail
> (`larsbrinknielsen@gmail.com`) among email-shaped tokens. The GA-7 analog
> (`06-SECURITY.md`) carries the maintainer work-domain as an escaped search needle;
> it is described STRUCTURALLY below and its needle is NOT reproduced.

## File Classification

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `README.md` (root) | documentation | transform | itself: `## What lz-refactor does` (`:66-77`) + `## Refactoring` primer (`:79-104`) | exact (self-mirror) |
| `CHANGELOG.md` (root) | documentation | transform | itself: `## [lz-tdd@0.0.2]` entry (`:8-37`) + link-ref (`:63`) | exact (self-mirror) |
| `plugins/lz-tdd/.claude-plugin/plugin.json` | config (manifest) | transform | itself: current `version`/`description`/`keywords` (`:3,4,12-25`) | exact (value-edit) |
| `.claude-plugin/marketplace.json` | config (manifest) | transform | itself: current `plugins[0].description` (`:13`) | exact (value-edit) |
| `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | test (checker/utility) | batch | itself: `wideTargets` (`:100-124`) + `verbatimTargets` (`:129-149`) already walk the `lz-red` tree | exact (near-no-op re-verify) |
| `.planning/milestones/lz-tdd@0.0.2-phases/06-.../06-SECURITY.md` | documentation (meta) | transform | allowlist-inversion shape in `check-hygiene.mjs` (`:42-43,188-201`) + AGENTS.md rule + the sibling non-encoding needle in the SAME file (`:35`) | role-match (structural) |

## Pattern Assignments

### `README.md` (documentation, transform)

**Analog:** itself. Two per-skill sections already exist; mirror their exact shape for a third (`lz-red`), and widen two shared statements from two skills to three.

**Lead paragraph to rewrite (`:3-7`)** -- currently a TWO-skill statement:
```markdown
Engineering-focused plugins for Claude Code. The first plugin, `lz-tdd`, pairs two
test-driven-development skills across the red-green-refactor loop: `lz-tpp` coaches
the green step -- Robert C. Martin's Transformation Priority Premise (TPP) -- and
`lz-refactor` coaches the refactor step with Martin Fowler's and Joshua Kerievsky's
refactorings. Each skill is both an auto-triggering coach and an on-demand reference.
```
Rewrite to THREE skills framed as the completed loop: `lz-red` (RED step) -> `lz-tpp`
(GREEN step) -> `lz-refactor` (REFACTOR step). Keep the closing "each skill is both an
auto-triggering coach and an on-demand reference" sentence -- it holds for all three.

**"What this is" listing to extend (`:9-16`)** -- add one bullet, mirroring the two present:
```markdown
- **Marketplace:** `lz-engineering-claude-plugins` (this repo)
- **Plugin:** `lz-tdd` -- a plugin for test-driven-development skills
- **Skill:** `lz-tpp` -- invoked as `/lz-tdd:lz-tpp`
- **Skill:** `lz-refactor` -- invoked as `/lz-tdd:lz-refactor`
```
Add `- **Skill:** \`lz-red\` -- invoked as \`/lz-tdd:lz-red\``. Order the three by the
loop (red -> green -> refactor) or keep existing order per D-13 (planner's call).

**Per-skill section shape to mirror (`## What lz-refactor does`, `:66-77`)** -- copy the two-mode block verbatim in shape (auto-triggering coach + on-demand `/lz-tdd:...` reference), swapping in RED-step wording:
```markdown
## What lz-refactor does

`lz-refactor` helps you pick the next named refactoring for a code smell once the
tests are green, drawing on Martin Fowler's mechanical refactorings and Joshua
Kerievsky's pattern-directed refactorings.

- **Coach (auto-triggering):** when the tests are green and the code has a smell,
  it names the smell, routes it to a candidate named refactoring, and walks you
  through the smallest behavior-preserving steps. It coaches; it does not edit your
  code or run your tests.
- **Reference (on demand):** invoke `/lz-tdd:lz-refactor` to have it explain a
  refactoring, a code smell, a design pattern, or a refactoring principle.
```

**Primer + sources + pointer shape to mirror (`## Refactoring`, `:79-104`)** -- the ORIGINAL prose block + `Authoritative sources:` (link only) + a `references/` pointer with the live inventory. This is the DST-04-relevant part of the README (the primer is original prose; run it through the no-verbatim gate):
```markdown
## Refactoring

Refactoring is changing the internal structure of code without changing its
observable behavior, applied in small steps that keep the tests green. [...original prose...]

Authoritative sources:

- Martin Fowler, *Refactoring...* -- https://martinfowler.com/books/refactoring.html
- Joshua Kerievsky, *Refactoring to Patterns*... -- https://industriallogic.com/...
- Erich Gamma et al., *Design Patterns*... -- https://en.wikipedia.org/wiki/Design_Patterns

The catalogs are bundled as reference files, not inlined here. See
`plugins/lz-tdd/skills/lz-refactor/references/` for 62 Fowler refactorings, 27
Kerievsky pattern-directed refactorings, [...counts...].
```
For the new `lz-red` primer: write an ORIGINAL RED-phase primer, list authoritative
sources by LINK only (Beck / R.C. Martin Three Laws / Metz / Feathers as appropriate),
and point into `plugins/lz-tdd/skills/lz-red/references/`.

**lz-red inventory for the pointer sentence (D-04; VERIFIED live 2026-07-20, recount at write time):**
`plugins/lz-tdd/skills/lz-red/` = `SKILL.md` + 10 reference files: 6 flat
(`three-laws-and-test-selection.md`, `test-structure-and-assertions.md`, `naming.md`,
`anti-patterns.md`, `vitest-typescript-mechanics.md`, `principle-backing.md`) + a
`testing-stance/` router (1 navigation `README.md` + 3 leaves: `functional-core.md`,
`message-matrix.md`, `seams-and-legacy.md`). Recommended phrasing (all FACTS):
"test-selection, test-structure/assertion, naming, anti-pattern, and Vitest/TypeScript
mechanics references plus an adaptive testing-stance router with three leaves (functional
core / message matrix / seams + legacy)." MUST NOT imply a complete Beck / Metz / Feathers
catalog (D-04).

**Stays VERBATIM (do NOT touch):** the install block (`:23-30`) and `## License` (`:106-108`,
approved gmail). Post-write, confirm all three invocations present:
`git grep -nF '/lz-tdd:lz-red' -- README.md` (+ `lz-tpp`, `lz-refactor`).

---

### `CHANGELOG.md` (documentation, transform)

**Analog:** the existing `## [lz-tdd@0.0.2]` entry -- mirror its Keep-a-Changelog shape exactly.

**Entry shape to mirror (`:8-37`)** -- one-paragraph lead + `### Added` bullet list:
```markdown
## [lz-tdd@0.0.2] - 2026-07-09

Adds the `lz-refactor` skill (`/lz-tdd:lz-refactor`) to the `lz-tdd` plugin: a
dual-mode refactoring coach and reference for the refactor step of red-green-refactor
TDD, [...]. The plugin manifest moves to version 0.0.2.

### Added

- **`lz-refactor` skill** (`/lz-tdd:lz-refactor`): dual-mode refactoring coach and
  reference. [...]
- **Five reference catalogs**: 62 Fowler mechanical refactorings, [...] each bundled
  as its own reference file and linked (not inlined).
- **Manifest and docs**: `lz-tdd` manifest bumped to 0.0.2 with a two-skill
  description and refactoring keywords; `README.md` documents `lz-refactor` alongside
  `lz-tpp`.
```
Add `## [lz-tdd@0.0.3] - <date>` ABOVE the 0.0.2 entry. Content (D-11): the `lz-red`
skill (dual-mode, `/lz-tdd:lz-red`), the RED decision procedure on the Three Laws of
TDD spine, the adaptive testing-stance router (Bernhardt functional-core / Metz
message-matrix / Feathers seams+legacy), the TypeScript + Vitest RED mechanics, the
`lz-tpp` seam + reverse pointer, and the anti-pattern + Test Desiderata references.
Link, don't inline; no complete-catalog implication.

**Bottom link-ref shape to mirror (`:63-64`)** -- percent-encoded `@` (`%40`), tag not yet cut:
```markdown
[lz-tdd@0.0.2]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.2
[lz-tdd@0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1
```
Add `[lz-tdd@0.0.3]: .../releases/tag/lz-tdd%400.0.3` ABOVE the 0.0.2 link-ref.

---

### `plugins/lz-tdd/.claude-plugin/plugin.json` (config, transform)

**Analog:** itself. Three one-line factual-accuracy edits (D-05); `version` is the delivery mechanism.

**`version` (`:3`):** `"version": "0.0.2"` -> `"0.0.3"`. This is what `/plugin update`
compares; an unchanged version makes auto-update SKIP the plugin, so existing installs
never see `lz-red` (Pitfall 6).

**`description` (`:4`)** -- currently names only two skills; add `lz-red` as the RED step:
```json
"description": "Test-driven development guidance for Claude Code across the red-green-refactor loop. Includes the lz-tpp skill for the green step (Robert C. Martin's Transformation Priority Premise) and the lz-refactor skill for the refactor step (Fowler and Kerievsky refactorings, code smells, and design patterns).",
```

**`keywords` (`:12-25`)** -- currently 13 entries (`tdd`, `test-driven-development`,
`transformation-priority-premise`, `tpp`, `red-green-refactor`, `clean-code`,
`typescript`, `refactoring`, `code-smells`, `design-patterns`, `gang-of-four`, `fowler`,
`kerievsky`). Add RED-phase vocabulary (D-13 candidates: `unit-testing`, `vitest`,
`failing-test`, `assertions`, `three-laws-of-tdd`; exact list is planner's call).

**`author.email` (`:7`)** already the approved gmail -- do NOT change.

---

### `.claude-plugin/marketplace.json` (config, transform)

**Analog:** itself. ONE edit; do NOT add a `version` field (D-06).

**`plugins[0].description` (`:13`)** -- currently two skills; extend to three:
```json
"description": "Test-driven development guidance for Claude Code: the lz-tpp skill for Transformation Priority Premise coaching at the green step and the lz-refactor skill for Fowler and Kerievsky refactoring coaching at the refactor step.",
```
Add `lz-red` (RED step) so the marketplace listing names all three skills.

**D-06 (Pitfall 6):** there is NO `version` key here today -- keep it that way.
`plugin.json` wins silently; a duplicate `version` is masked and the validator warns.
`owner.email` (`:6`) already the approved gmail -- do NOT change.

---

### `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (checker, batch)

**Analog:** itself. **D-07 is a near-NO-OP** (Research Finding 1): the checker ALREADY
walks the full Phase-19 edit surface on its applicable axes. Phase 19 RE-RUNS it GREEN
after each content edit; it does NOT widen it unless a brand-new root prose file is
introduced (none is planned).

**`wideTargets` -- axes (a) ASCII + (b) work-email (`:100-124`)** -- already includes the
whole `lz-red` tree (`:114-118`) + both root prose files + LICENSE + both manifests (`:120`):
```javascript
if (fs.existsSync(LZ_RED_SKILL_MD)) {
  wideTargets.push(LZ_RED_SKILL_MD);
}
wideTargets.push(...walkMd(LZ_RED_REFERENCES));

for (const f of [ROOT_README, ROOT_CHANGELOG, LICENSE, PLUGIN_MANIFEST, MARKETPLACE_MANIFEST]) {
  if (fs.existsSync(f)) {
    wideTargets.push(f);
  }
}
```

**`verbatimTargets` -- axis (c) no-verbatim / DST-04 (`:129-149`)** -- already includes the
whole `lz-red` tree (`:139-143`) + README + CHANGELOG (`:145`); `lz-tpp` stays EXCLUDED
(cited FibTPP), LICENSE + manifests excluded (short/verbatim by design).

**Allowlist-inversion shape -- the canonical NON-ENCODING form (`:42-43`, applied `:188-201`)** --
this is the model the GA-7 fix (below) mirrors in prose. It NEVER spells the forbidden value:
```javascript
const APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"]);
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// ...
for (const email of found) {
  if (!APPROVED_EMAILS.has(email.toLowerCase())) {
    offending.add(`${email} (${path.relative(repoRoot, f)})`);
  }
}
```

**Scan-floor control (`:160-172`)** -- asserts `SKILL.md` + both manifests exist before
trusting a clean scan (prevents a false-GREEN if an anchor is renamed away). Unchanged,
still valid. "Widen a gate, never weaken one" (T-09-GATE): if a truly new root file is ever
added, push it into `wideTargets` -- never remove an existing target.

---

### `.planning/milestones/lz-tdd@0.0.2-phases/06-.../06-SECURITY.md` (documentation, transform) -- GA-7 / D-12

**Analog (structural, role-match):** the allowlist-inversion shape in `check-hygiene.mjs`
(`:42-43,188-201`, above) + the AGENTS.md "detect by allowlist-inversion, never by encoding
the forbidden value" rule + the SIBLING non-encoding needle already in this same file.

**The anti-pattern to remove (described structurally -- needle NOT reproduced):** the
`T-06-01` threat-register **mitigation cell** (line 33) proves work-email absence by
embedding the maintainer work-DOMAIN as an escaped search needle inside an `rg "..."`
command string in its `VERIFIED:` evidence. Encoding the forbidden value in order to detect
it IS the leak (AGENTS.md: "the needle is itself a leak"). This cell is on `origin/main`
public history and the pushed 0.0.3 branch (D-12).

**The non-encoding fix shape (own scoped commit; NEVER spell the forbidden value):** rewrite
the `VERIFIED:` evidence to an allowlist-inversion STATEMENT -- assert that enumerating every
email-shaped token over the tree and subtracting the approved public gmail
(`larsbrinknielsen@gmail.com`) leaves an empty remainder (no other email present), WITHOUT
naming the forbidden value. Mirror the `check-hygiene.mjs` allowlist-inversion logic in prose.

**Reference: a LEGITIMATE needle already in the same file needs NO change.** The `T-06-03`
ASCII cell (line 35) uses a non-ASCII byte-class needle `[^\x00-\x7F]` inside its `rg`
command -- that is a character-class, not the forbidden value, so it is a correct
non-encoding form. Leave it as-is. This contrast (T-06-01 encodes the forbidden value; T-06-03
encodes a generic byte class) is the exact tell the sweep looks for.

**Sweep (D-12 "fix each"):** the executor/GA-7 task holds the forbidden needle ONLY
ephemerally on the in-session command line (never committed) to grep tracked planning docs
for sibling instances of the same encode-the-forbidden-value anti-pattern, rewrites each to
the allowlist-inversion form, then re-verifies with the full-tree email allowlist-inversion
(clean today -- only the approved gmail present). Docs-only diff; touches no `SKILL.md`, needs
no skill-review. Land BEFORE the 0.0.3 push/PR to `main`. **NO history rewrite of `main`** (D-12).

## Shared Patterns

### Three-skill loop framing
**Source:** README lead (`:3-7`) + `## What lz-refactor does` / `## What lz-tpp does`; CHANGELOG entry shape.
**Apply to:** `README.md`, `CHANGELOG.md`, both manifest descriptions.
Frame the trio as the completed red-green-refactor loop: `lz-red` (RED) -> `lz-tpp` (GREEN) ->
`lz-refactor` (REFACTOR). Every doc/manifest string that names skills must name all three.

### Link, don't inline
**Source:** README `## Refactoring` (`:100-104`); CHANGELOG `### Added` (`:21-24`).
**Apply to:** the new README `lz-red` primer, the CHANGELOG 0.0.3 entry.
README/CHANGELOG point at `plugins/lz-tdd/skills/lz-red/references/`; the references hold the
content. Never inline reference bodies. Counts + names are FACTS (verify live); do not imply a
complete Beck / Metz / Feathers catalog (D-04).

### Keep-a-Changelog + percent-encoded tag link-ref
**Source:** `CHANGELOG.md` (`:5-6` header; `:8-37` entry; `:63-64` link-refs).
**Apply to:** the 0.0.3 entry.
`## [lz-tdd@0.0.3] - <date>` + one-paragraph lead + `### Added` list, plus a bottom
`[lz-tdd@0.0.3]: .../releases/tag/lz-tdd%400.0.3` link-ref (`%40` = `@`; the tag does NOT
exist at write time -- correct, matches 0.0.1/0.0.2).

### Version in `plugin.json` only
**Source:** `plugin.json:3`; `marketplace.json` (no `version` key).
**Apply to:** both manifests.
Bump `plugin.json` `version` 0.0.2 -> 0.0.3 ONLY. NEVER add `version` to `marketplace.json`
(silently masked; validator warns -- D-06). The bump is the delivery mechanism (Pitfall 6).

### Allowlist-inversion for work-email (NON-ENCODING)
**Source:** `check-hygiene.mjs:42-43,188-201`; AGENTS.md maintainer-identity rule.
**Apply to:** the GA-7 `06-SECURITY.md` rewrite; any new plan/summary/review doc; every commit.
Assert the ONLY email-shaped token present is the approved gmail (`larsbrinknielsen@gmail.com`)
and flag the remainder. NEVER write the work-email or its bare domain as a search needle -- the
needle is the leak. Run the full-tree email allowlist-inversion after every doc-adding commit.

### ASCII-only committed output
**Source:** `check-hygiene.mjs:84-94,174-185` (byte-level scan, fail on any byte > 0x7f).
**Apply to:** every file this phase writes (README, CHANGELOG, manifests, the GA-7 rewrite).
No em/en dashes, curly quotes, ellipsis, or emoji (cp1252 mojibake risk). Use `--`, `-`, `...`.

## No Analog Found

None. Every Phase-19 target is a MODIFIED existing file whose analog is its own current state
and/or a shipped Phase-10 sibling shape. No new source file is authored, so there is no file
that must fall back to RESEARCH.md-only patterns.

## Metadata

**Analog search scope:** repo root (`README.md`, `CHANGELOG.md`, `LICENSE`),
`plugins/lz-tdd/.claude-plugin/`, `.claude-plugin/`,
`.claude/skills/lz-refactor-workspace/tools/`, `plugins/lz-tdd/skills/lz-red/**`,
`.planning/milestones/lz-tdd@0.0.2-phases/06-.../`.
**Files scanned:** 6 edit targets read in full + `lz-red` reference tree globbed (11 files).
**Pattern extraction date:** 2026-07-20
**Hygiene verified:** the only email-shaped token in this file is the approved public gmail;
the GA-7 needle is described structurally and NOT reproduced; ASCII-only.
