# Phase 22: Three-way classifier correctness (lz-refactor + lz-red) - Pattern Map

**Mapped:** 2026-08-03
**Files analyzed:** 27 (7 shipped Markdown, 13 new harness, 6 modified harness/config, 1 planning doc)
**Analogs found:** 26 / 27 (1 file -- `rgr-routing.md` -- has a FILE-SHAPE analog only; its nearest
content analog is an ANTI-pattern, see "Misleading Analogs")

This repo has TWO authored surfaces with sharply different conventions (CONVENTIONS.md L5-12). The
sections below are kept apart on purpose: a shipped-Markdown pattern must never be sourced from a
harness file and vice versa.

---

## File Classification

### Surface 1 -- Shipped Markdown (`plugins/lz-tdd/**`, all EDITED except one NEW)

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (MOD) | skill router / classifier surface | request-response (classify -> route) | the OTHER two `SKILL.md` step-1 blocks (`lz-red` L57-61, `lz-tpp` L54-57) | exact (sibling) |
| `plugins/lz-tdd/skills/lz-red/SKILL.md` (MOD) | skill router / classifier surface | request-response | `lz-refactor/SKILL.md` step 1 (L49-53) -- the ONLY positive-condition step 1 of the three | exact (sibling) |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (MOD) | skill router / classifier surface | request-response | `lz-red/SKILL.md` L36-42 + `lz-refactor/SKILL.md` L37-45 | exact (sibling) |
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (MOD) | reference leaf carrying a REPLICATED classifier | request-response | `lz-red/SKILL.md` L36-42, the section this leaf's L127-129 says it mirrors | exact (self-declared mirror) |
| `plugins/lz-tdd/references/beck-tdd-by-example.md` (MOD) | plugin-wide shared reference | request-response (its seam section) | ITSELF -- **FLAWED analog for the seam section**; use the three narrative sections instead | flawed (see Misleading Analogs) |
| `plugins/lz-tdd/references/rgr-routing.md` (NEW, variants B/C only) | plugin-wide shared reference / routing table | request-response | `beck-tdd-by-example.md` for FILE SHAPE only; `lz-red/references/principle-backing.md` for a `pipe-table`-parsable table | role-match (shape only) |
| `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` (COND. MOD) | provenance backing table | data | its own existing rows (L56-69) | exact |

### Surface 2 -- Dev-only Node harness (`.claude/skills/*-workspace/**`, NEW)

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `lz-red-workspace/tools/check-rgr-routing.mjs` | validator (checker) | file-I/O, accumulate-then-exit | `lz-red-workspace/tools/check-red-references.mjs` (doctrine + TD-02 block) AND `lz-refactor-workspace/tools/check-hygiene.mjs` (whole-script skeleton) | exact |
| `lz-red-workspace/tools/check-rgr-routing.selftest.mjs` | test (mutation selftest) | transform, in-memory fixtures | `lz-red-workspace/tools/row-guards.selftest.mjs` | exact |
| `lz-red-workspace/tools/lib/routing-parse.mjs` | utility (parser lib) | transform | `lz-red-workspace/tools/lib/row-guards.mjs` + `lib/pipe-table.mjs` | exact |
| `lz-red-workspace/tools/lib/section-body.mjs` | utility (copied verbatim) | transform | `lz-refactor-workspace/tools/lib/section-body.mjs` | exact (verbatim copy) |
| the 9-case corpus JSON | config/data (single source) | data | `e2e-red-gilded-rose/targets.json` + `evals/trigger-eval.json` | role-match |
| `lz-red-workspace/variants/build-variants.mjs` | builder (generates plugin trees) | file-I/O (destructive) | `lz-red-workspace/treatment/build-treatment.mjs` | exact |
| `lz-red-workspace/e2e-rgr-routing/suite.json` | config | data | `e2e-red-gilded-rose/suite.json` | exact |
| `lz-red-workspace/e2e-rgr-routing/targets.json` | config | data | `e2e-red-gilded-rose/targets.json` | exact |
| `lz-red-workspace/e2e-rgr-routing/prompts/<case-id>.md` (x9) | data/fixture | data | `e2e-red-gilded-rose/prompts/r1-next-test.md` | exact |
| `lz-red-workspace/e2e-rgr-routing/RUN-GATE.md` | doc (gated presentation) | doc | `e2e-red-gilded-rose/RUN-GATE.md` | exact |
| `lz-red-workspace/grade-routing.mjs` | grader | transform + fail-closed artifact | `grade-red.mjs` (verdict classes, `--selfcheck`) + `grade-run.mjs` (`occursAffirmed`, `finalOutPath`) | exact |
| `lz-red-workspace/selfcheck-routing.mjs` | selfcheck (offline arm proof) | process-spawn -> argv assertions | `lz-red-workspace/selfcheck-red.mjs` cruxes 1+2 | exact |
| `lz-red-workspace/ROUTING-AB-RESULTS.md` | doc (writeup) | doc | `e2e-red-gilded-rose/EVAL-RESULTS.md` | exact |

### Surface 2 -- Dev-only Node harness (MODIFIED, all additive)

| Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---------------|------|-----------|----------------|---------------|
| `lz-refactor-workspace/e2e-nx/run-e2e.mjs` | driver (arm composition) | process-spawn | ITSELF -- `TREATMENT_DIR`/`FORCING_DIR` (L62-73) and the `d12` arm token (L1029-1030) | exact (self-analog) |
| `lz-refactor-workspace/tools/check-hygiene.mjs` | validator (scope widen) | file-I/O | ITSELF -- the `LZ_RED_*` scope block (L28-33, L114-118, L139-143) | exact (self-analog) |
| `lz-red-workspace/check-evals.mjs` | validator (clause-8 glob widen) | file-I/O | ITSELF -- `suiteDirs` filter (L277-279) + the non-vacuity assert (L292-297) | exact (self-analog) |
| `lz-red-workspace/tabulate-mechanical-red.mjs` | aggregator (`--grade-file` param) | transform | ITSELF -- existing `--selfcheck` + argv handling (L679) | exact (self-analog) |
| `lz-red-workspace/package.json` | config (`scripts.check` wiring) | data | its own existing `check` chain (L8) | exact |
| `.gitignore` | config | data | the explicit `e2e-red-*` block (L62-75) | exact |

### Planning doc (not code)

| File | Role | Analog |
|------|------|--------|
| `.planning/REQUIREMENTS.md` (MOD -- add CLS-01..CLS-05 + Traceability rows) | planning | the file's own existing `- [ ] **ID**: text` shape; recommended text is pre-authored in `22-RESEARCH.md` "Phase Requirements" |

---

## Pattern Assignments -- Surface 1: Shipped Markdown

### `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (classifier surface, request-response)

**Analog:** the other two skills' step-1 blocks; this file's own step 1 is the analog FOR them.

**Frontmatter shape to preserve** (`lz-refactor/SKILL.md` L1-18) -- folded `description: >-`, no
`version` field, reciprocal exclusion clause last:

```yaml
---
name: lz-refactor
description: >-
  This skill should be used for the refactor step of red-green-refactor TDD: ...
  Do NOT use it to
  make a failing or red test pass or otherwise ADD or CHANGE behavior -- that is the
  green/transformation step; use lz-tpp instead -- nor for writing new code, adding a feature, or
  writing a function from scratch.
---
```

D-06 edits the trailing `Do NOT use it to ...` clause ONLY. Budget: 1,245 chars today, cap 1,536,
so **291 chars of headroom** -- assert the measurement as a task check, do not assume it.

**Step-1 branch shape to copy FROM (this file is the best of the three today -- three positive
conditions, no catch-all), L49-53:**

```markdown
1. Classify the request against both seams, by what the developer is asking for. If the ask is to
   make a failing test pass by changing behavior, hand off to lz-tpp and stop. If the ask is to
   decide or write the next failing test, hand off to lz-red and stop. If the ask is to improve
   structure or readability without changing behavior, continue here (the refactor step). See
   "Refactoring vs the red step (lz-red) and the green step (lz-tpp)" above; do not restate it.
```

Two properties to keep verbatim in spirit: (a) every branch names its owner explicitly, (b) the
step ends with a `See "<exact heading>" above; do not restate it.` pointer. That pointer form is
the progressive-disclosure idiom all three files use and is what variant C's link-out must replace,
not delete.

**Correction -- property (a) is ASPIRATIONAL for the new content, not descriptive of the text quoted
above.** The quoted block names its owner explicitly only for the two branches it hands OFF
(`lz-tpp`, `lz-red`); the self-owning branch says "continue here (the refactor step)" and never the
literal slug. The same is true of both sibling files -- `lz-red/SKILL.md:42` ("is this skill"),
`lz-refactor/SKILL.md:45` ("that is this skill"), `lz-tpp/SKILL.md:44` ("is this skill"). Since
`destinationsIn()` (22-01) matches only the three literal slugs word-bounded and has NO
self-reference resolution, "keep verbatim in spirit" applied to a self-owning branch would author
text the gate cannot take GREEN. Read (a) as a REQUIREMENT on the new branches -- every branch,
including the self-owning one, carries the literal slug -- not as a property to preserve from here.
The literal-slug requirement sits on the authored content by design; the parser stays deliberately
dumb, which is what keeps it mutation-sensitive.

**Defect sites in THIS file, with the shape each must take:**

| Line | Defect | Required shape |
|------|--------|----------------|
| L30 | `## Two modes` coach gate keys on test state (`the tests are green and the code has a smell`) -- and contradicts step 5's own untested-code branch (L85-87) | reword to key on the ask only (D-03); the in-procedure precondition may survive elsewhere but must not read as an ownership decision |
| L53, L80 | `See "Refactoring vs ..."` resolves; **L80's `the QUESTION/COMMAND intent routing below` does NOT** -- the paragraph at L119-126 carries no heading | add the missing `## ` heading to the L119-126 paragraph (D-07: add the anchor, never delete the pointer) |
| L115-117 | step 6's reference router omits `refactoring-without-tests.md` and `beck-tidy-first.md` | add both to the router list; the list's shape is a comma-run of link names |
| L139 | `route any behavior change to lz-tpp and exclude it (step 1)` cites a step-1 rule step 1 does not contain | either add the rule to step 1 or re-cite; the new step 1 (D-01) supplies it |
| L49-53 branch (c) | over-captures test-file tidying vs test-quality asks | add D-04's explicit exclusion in branch (c) |

---

### `plugins/lz-tdd/skills/lz-red/SKILL.md` (classifier surface, request-response)

**Analog:** `lz-refactor/SKILL.md` L49-53 (above) for the positive-branch form.

**The catch-all to REMOVE, twice** -- narrative L40-42 and step 1 L57-61:

```markdown
Classify the request before acting: if a
failing test must be made to pass, hand off to lz-tpp; if already-passing code must be cleaned up,
hand off to lz-refactor; otherwise, choosing and writing the next failing test is this skill.
```

```markdown
1. Classify the request against the lz-tpp and lz-refactor seams. A failing test that must be made
   to pass is the green step: hand off to lz-tpp and stop. Already-passing code to clean up is the
   refactor step: hand off to lz-refactor. Otherwise choosing and writing the next failing test is
   this skill's work. See "RED vs the green step (lz-tpp) and the refactor step (lz-refactor)" above;
   do not restate it.
```

Both `otherwise ... is this skill` terminals are the D-01 target. Replace with positive disjoint
branches + a named owner per residual + one terminal that claims nothing. The target shape is
authored in `22-RESEARCH.md` "Pattern 1" (illustrative wording; exact wording is Claude's discretion
per CONTEXT).

**Reference-list citation form to copy for variants B/C (L158-159)** -- this is the ONE shipped
`${CLAUDE_PLUGIN_ROOT}` citation, and it uses INLINE CODE, not a Markdown link:

```markdown
- The red-green-refactor loop this skill's red step opens, and who owns which rule in it (plugin-wide
  reference, shared with lz-refactor): `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`
```

**Inline code is mandatory, not stylistic.** `check-red-references.mjs` guard N2 (`[lc9] every
relative markdown link in the shipped tree resolves`) classifies a variable-prefixed path as
RELATIVE and `existsSync`-checks it (its own comment at L809), so a Markdown link to a
`${CLAUDE_PLUGIN_ROOT}` path can never resolve and will redden the battery.

---

### `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (classifier surface, request-response)

**Analog:** the other two. D-05 caps the edit at classifier-only -- TPP content, ordering and worked
examples untouched.

**The test-state coach gate (L23) and the catch-all (L41-44):**

```markdown
- Coach mode: the request has a failing (red) test plus the current code, and the question is
  which minimal change makes the test pass. ...
```

```markdown
Classify a coach-mode request before ranking a
transformation: if already-passing code must be cleaned up, hand off to lz-refactor; if the next
failing test still has to be chosen or written, hand off to lz-red; otherwise, picking the minimal
change that turns the red bar green is this skill.
```

**The in-procedure precondition that SURVIVES (L54-57), reworded not deleted (D-03's narrow
reading):**

```markdown
1. Confirm the green phase. Exactly one new failing (red) test, all prior tests green, and
   the code compiles -> you are choosing a transformation. If the tests are green and the
   request is "clean this up", that is a refactoring (structure-only) -- do not priority-rank
   it.
```

The second sentence is the hybrid test-state + ask branch; it decides OWNERSHIP today and must be
reworded so it cannot be read that way. The first sentence is a sanity check and may stay.

---

### `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (reference leaf, request-response)

**Analog:** `lz-red/SKILL.md` L36-42 -- the leaf itself declares this at L127-129, which is why both
must change together.

**The replicated catch-all (L123-129), verbatim:**

```markdown
Classify first: before writing or selecting any test, sort the request into red, green, or refactor.
A failing test that must now be made to pass is the green step -- hand it off to lz-tpp and stop.
Already-passing code to clean up without changing behavior is the refactor step -- hand it off to
lz-refactor. Otherwise the work is choosing and writing the next failing test, which is lz-red: apply
the selection moves above under the Three Laws. This is the same red-vs-green-vs-refactor split the
SKILL.md router states; it is repeated here as the entry gate to the selection moves, not to re-argue
the seam.
```

The closing sentence is a machine-readable promise. `lz-red/SKILL.md` step 2 (L70-71) explicitly
tells the model to READ this leaf, so leaving it stale ships two contradicting classifiers inside one
skill. Keep the self-describing sentence -- it is what makes the pair auditable -- and keep the
`Law 1 -- gate entry` / `Law 3 -- the lz-tpp handoff` bullet shape at L117-121 (they are D-02's
authority; Law 1 is `Owned; oracle-verified`, the Law-3-as-handoff framing is
`lz-red orchestration, no-oracle` -- do not upgrade the latter's tier).

---

### `plugins/lz-tdd/references/beck-tdd-by-example.md` (plugin-wide shared reference)

**Analog for FILE SHAPE: itself. Analog for the SEAM SECTION: none in this file -- see Misleading
Analogs.**

**File-level shape to preserve (L1-6 scope line + L7-9 no-oracle banner):**

```markdown
# Test-Driven Development (Beck, TDD by Example)

Scope: the core of the test-first loop that lz-refactor sits inside, distilled from Beck's Test-Driven
Development by Example. This reference exists so the coach can name the seam it shares with lz-tpp and
explain where the refactor step begins. The green step is lz-tpp's concern; the refactor step is this
skill's. See the two-hats framing in principles.md for the same boundary from Fowler's side.

> No-oracle reference: high-confidence CORE only (no owned book to verify against). Original prose, no
> verbatim Beck prose or code (DST-04). NAMES of techniques are kept verbatim as facts; every
> definition below is written in original words.
```

The scope line is IN SCOPE (D-20b): "the test-first loop that **lz-refactor** sits inside" and "the
refactor step is **this skill's**" are skill-relative in a plugin-wide file cited from
`lz-red/SKILL.md:159`.

**D-26 boundary, machine-checkable:** the repair touches the scope line (L3-6) and the
`## The seam with lz-tpp` section (L66-73) ONLY. Every `## Sources` row (L75-87) stays byte-unchanged
-- including the `Owned; oracle-verified` Fowler Ch.4 row and the per-claim owned tier inside L29-37.
The ORCHESTRATOR runs the standard unprimed review, not an oracle-reviewer gate.

---

### `plugins/lz-tdd/references/rgr-routing.md` (NEW -- variants B/C only)

**Analog:** `beck-tdd-by-example.md` for file shape (H1 + `Scope:` line + provenance banner +
`## Sources`). For the table itself, the analog is a `pipe-table`-parsable table -- because the guard
parses cells, not prose.

**Table shape that `lib/pipe-table.mjs` `parseRows(text, width, headerFirstCell)` can consume**
(from `row-guards.selftest.mjs` L259-262, the proven contract): a fixed column count, a header row
identified BY VALUE of its first cell, and no ragged rows -- `parseRows` SKIPS a width mismatch
rather than guessing, and a skipped row makes every row-scoped guard over it silently blind. A
backslash-escaped pipe is cell content, not a boundary.

**Two hard constraints on this file, both measured:**

1. It lands in `plugins/lz-tdd/references/`, which is outside ALL THREE `check-hygiene.mjs` axes
   today (Finding 8). Widen the scope in Wave 0 or D-19's hygiene re-run is a vacuous pass on
   exactly this file.
2. Nothing in the shipped tree may LINK to it as a Markdown relative link if the path carries
   `${CLAUDE_PLUGIN_ROOT}` -- inline code only (guard N2, above).

---

## Pattern Assignments -- Surface 2: Dev-only Node harness

### `tools/check-rgr-routing.mjs` (validator, file-I/O + accumulate-then-exit)

**Analogs:** `check-hygiene.mjs` for the whole-script skeleton (229 lines, one clean pass);
`check-red-references.mjs` for the doctrine and the fail-closed read.

**Header block -- reproduce this shape (CONVENTIONS.md L154 calls it "the strongest convention in
the codebase"). Source `check-hygiene.mjs` L1-12:**

```javascript
#!/usr/bin/env node
// Hygiene checker over the shippable public surface -- both skill trees (lz-refactor + lz-tpp),
// the repo-root README/CHANGELOG/LICENSE, and both manifests:
//   (a) ASCII-only    -- fail on any non-ASCII byte, reported as file@byteN (cp1252 mojibake risk).
//   (b) work-email    -- enumerate every email-shaped token, subtract the approved public gmail,
//                        assert the remainder is empty (the work-email leak recurred twice in Phase 4).
//   (c) no-verbatim   -- DST-04 gate: fail on long double-quoted runs (a verbatim-prose proxy).
// (a), (b), and (c) are all HARD failures (non-zero exit). ... Node builtins only.
// GREEN against the current tree today (ASCII-clean, email-clean, no verbatim-looking runs).
//   node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs
```

The new header must additionally state: (i) the three assertions (exhaustive / at-most-one /
single-axis), (ii) **RED against today's tree BY DESIGN** -- the instrument-first baseline, using
`check-red-references.mjs` L72-79's wording as the model, and (iii) the COVERAGE BOUNDARY: this
proves the AUTHORED classifier is exhaustive/disjoint/single-axis over the corpus, it does NOT prove
a model routes correctly (that is CLS-05's metered eval). RESEARCH L1469-1476 requires that sentence
in the header.

**Path resolution -- comment the `..` walk (CONVENTIONS.md L99-104). Source `check-red-references.mjs`
L89-95 (same workspace, same depth):**

```javascript
const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");
```

**`report()` accumulator -- copy from `check-hygiene.mjs` L46-54 (the plain form; the
`check-red-references.mjs` variant adds roster instrumentation this file must NOT inherit):**

```javascript
let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};
```

**The fail-closed whole-file read (D-17). Copy from `check-red-references.mjs` L533-553 VERBATIM in
shape -- comment included, because the comment is the rationale D-17 cites:**

```javascript
// Deliberately NOT existsSync-gated, unlike the SEAM-02 and D-05 blocks it sits between. This file's
// own header condemns an existsSync-gated post-loop block as a silent vacuous pass, and an
// emit-nothing path would make the roster gate fire on the COUNT rather than on the guard that found
// something. The try/catch yields the empty string instead, which has no match, so the guard fails
// CLOSED with no extra branch and report() runs exactly once every run.
const lzRefactorSkillPath = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "SKILL.md");
let lzRefactorText = "";

try {
  lzRefactorText = fs.readFileSync(lzRefactorSkillPath, "utf8");
} catch {
  lzRefactorText = "";
}

const lzRefactorPointsBack = /lz-red/.test(lzRefactorText);

report(
  lzRefactorPointsBack,
  "lz-refactor/SKILL.md: TD-02 return pointer to lz-red",
  lzRefactorPointsBack ? "" : "lz-refactor skill carries no return pointer to the red step"
);
```

Note the LAST TWO lines are the F-1 CEILING, not the pattern: a bare `/lz-red/` needle is what
reviewer 1 defeated with a renamed heading. Copy the READ (try/catch -> `""`, one `report()` per
run); replace the ASSERTION with the parsed table.

**Scan-floor / anti-vacuity assert -- `check-hygiene.mjs` L156-172:**

```javascript
// Scan floor: the ASCII + work-email axes are only meaningful if the identity-bearing
// surface is actually present. A missing/renamed anchor (SKILL.md or either manifest)
// would silently drop from wideTargets, and an empty scan reads as "clean" -- a false
// GREEN on the load-bearing work-email control. Fail loud if any anchor is absent.
const missingAnchors = Object.entries({
  "SKILL.md": SKILL_MD,
  "plugin.json": PLUGIN_MANIFEST,
  "marketplace.json": MARKETPLACE_MANIFEST,
})
  .filter(([, p]) => !fs.existsSync(p))
  .map(([k]) => k);

report(
  missingAnchors.length === 0,
  "scan floor -- identity-bearing anchors present (SKILL.md + both manifests)",
  missingAnchors.length === 0 ? "" : `missing: ${missingAnchors.join(", ")}`
);
```

Adapt to: every surface in `ROUTING_SURFACES` present AND the corpus non-empty AND the parsed-branch
count above a floor. This is the D-17 "canonical location EXISTS as its own labeled check".

**Exit discipline -- `check-hygiene.mjs` L220-228 (0 GREEN / 1 RED). Add `process.exit(2)` for IO/usage
errors per CONVENTIONS.md L129-138:**

```javascript
console.log("");

if (failures === 0) {
  console.log(`SUMMARY: hygiene GREEN -- ASCII + work-email (${wideTargets.length} files) + no-verbatim (${verbatimTargets.length} files) all clean`);
  process.exit(0);
}

console.log(`SUMMARY: hygiene RED -- ${failures} hard failure(s)`);
process.exit(1);
```

**Section extraction that makes a heading rename FAIL (Finding 4) -- import the copied
`lib/section-body.mjs`; `null` is a FAILURE, never a skip:**

```javascript
export const sectionBody = (text, heading) => {
  const re = new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "m");
  const parts = text.split(re);

  if (parts.length < 2) {
    return null;              // a renamed heading lands HERE -- report(false, ...), never `continue`
  }

  return parts[1].split(/^##\s+/m)[0];
};
```

**Word-bounded skill-name match -- copy from `run-e2e.mjs` L317-324 (comment included; it names the
`lz-redux` case):**

```javascript
// Match a tracked BARE skill name ('lz-red') against a token the CLI reports, which is normally
// namespaced ('lz-tdd:lz-red'). Boundary-anchored on both sides so 'lz-red' does not match
// 'lz-redux' or 'lz-red-extra'; the boundary class excludes '-' because the names contain one.
function matchesSkillName(token, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`(^|[^a-z0-9-])${esc}($|[^a-z0-9-])`, 'i').test(String(token));
}
```

**Wrap tolerance -- flatten at BRANCH scope, not file scope.** The per-line default plus a bounded
per-needle opt-in is the file-level idiom (`check-red-references.mjs` L456-457 and the comment at
L445-455 warning that a blanket whole-text flip "would loosen every one of the ~100 pre-existing
per-line topics"):

```javascript
const hit = topic.wholeText ? topic.re.test(text) : lines.some((line) => topic.re.test(line));
```

The new parser applies the same reasoning STRUCTURALLY: split the section body into branches, then
`branch.replace(/\s+/g, ' ').trim()` per branch. No `wholeText` flags needed.

**Wiring -- `lz-red-workspace/package.json` L8. Append, preserving `&&` short-circuit order
(selftests first, then the checker):**

```json
"check": "node tools/provenance-honesty.selftest.mjs && node tools/row-guards.selftest.mjs && node tools/check-red-references.mjs"
```

---

### `tools/check-rgr-routing.selftest.mjs` (test, transform over in-memory fixtures)

**Analog:** `tools/row-guards.selftest.mjs` (483 lines). `provenance-honesty.selftest.mjs` (59
lines) is the minimal form if the mutation set stays small.

**Contract block to reproduce -- `row-guards.selftest.mjs` L1-31.** This is the both-directions
doctrine D-15 requires, already written:

```javascript
#!/usr/bin/env node
// Self-test for lib/row-guards.mjs and lib/pipe-table.mjs (quick-260729-2ig). Plain node:assert,
// matching this workspace's existing style ... IN-MEMORY FIXTURES ONLY; this file never reads a
// shipped document.
//   node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs
//
// CONTRACT. ...
//   1. PRISTINE   -> PASS. The guard accepts correct content.
//   2. EVASION    -> FAIL. The guard rejects the specific defect it exists to catch. ...
//   3. OLD NEEDLE -> PASSES the same evasion fixture. This is the "catches an evasion the old guard
//                   passed" evidence, COMMITTED here rather than thrown away in a scratchpad.
//   4. EMPTY TEXT -> FAIL. The anti-vacuity control, on EVERY guard. A guard that reports PASS on an
//                   empty document cannot fail, and a guard that cannot fail is worse than no guard
//                   (the wev R1 defect class).
```

Category 3 maps directly onto RESEARCH's mutation table: the "OLD NEEDLE" is the bare `/lz-red/`
presence needle, and proving it PASSES a fixture the new guard FAILS is the committed evidence that
the F-1 ceiling is closed.

**`mutate` / `dropLine` -- a mutation that silently no-ops must throw. Source L212-228:**

```javascript
const mutate = (text, from, to) => {
  const next = text.replace(from, to);

  assert.notEqual(next, text, `fixture mutation did not apply: ${from}`);

  return next;
};

// Drop the whole line containing `marker` -- the row-deletion evasion.
const dropLine = (text, marker) => {
  const lines = text.split("\n");
  const kept = lines.filter((line) => !line.includes(marker));

  assert.notEqual(kept.length, lines.length, `fixture line drop did not apply: ${marker}`);

  return kept.join("\n");
};
```

The rationale at L413-415 is worth copying too: "a silently no-op mutation here would leave PRISTINE
text under a check that expects FAIL, and while that still fails loudly it does so by accident rather
than by design."

**`check` / `verdict` harness + exit -- L234-248 and L477-483:**

```javascript
let failures = 0;

const check = (label, actual, expected) => {
  try {
    assert.deepEqual(actual, expected);
    console.log(`  [PASS] ${label}`);
  } catch (err) {
    failures++;
    console.log(
      `  [FAIL] ${label} -- expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}: ${err.message}`
    );
  }
};

const verdict = (result) => result.ok;
```

```javascript
if (failures === 0) {
  console.log("SUMMARY: row-guards self-test GREEN -- all assertions pass");
  process.exit(0);
}

console.log(`SUMMARY: row-guards self-test RED -- ${failures} assertion(s) FAILED`);
process.exit(1);
```

**Fixture construction -- arrays of double-quoted strings, not template literals (L36-39):**

```javascript
// Fixture builders. Lines are assembled from an ARRAY of double-quoted strings rather than a template
// literal, so the backticked term names need no escaping and a fixture cannot be silently corrupted by
// a missed backslash.
```

**Roster-shape assertion -- L426-442, the shape for asserting the parser's exported guard set:**

```javascript
console.log("lib/row-guards.mjs -- export roster (a count alone cannot see a renamed or swapped guard)");
check(
  "ROW_SCOPED_GUARDS exports exactly the five named row-scoped guards",
  Object.keys(ROW_SCOPED_GUARDS).sort(),
  [ /* ...named guards... */ ]
);
```

---

### `tools/lib/routing-parse.mjs` (utility / parser, transform)

**Analogs:** `lib/row-guards.mjs` (282 lines, each guard returns `{ ok, why }`), `lib/pipe-table.mjs`
(`parseRows`/`scanTables`/`findLinkTargets`), `lib/section-body.mjs`.

**Lib header doctrine -- `section-body.mjs` L1-8 and `heading-scan.mjs` L1-11 both open by declaring
themselves the single source of truth and naming why divergence is dangerous:**

```javascript
// Single source of truth for level-2 section-body extraction across the catalog checkers.
// Body text of a `## <heading>` section: everything after the heading line up to the next `## `
// (level-2) heading or EOF, or null when the heading is absent. ... Shared by check-gof /
// check-catalog / check-extra-patterns / check-functional so the four cannot diverge (WR-02). The
// heading is regex-escaped so a metacharacter in a heading can never corrupt the match ...
// Node builtins only.
```

**Both-directions pure-function export -- `selfcheck-red.mjs` L314-332 is the exact shape for the
`keysOnTestState` predicate (a pure exported token matcher, drivable in both directions, dropping
empty tokens so one blank entry cannot claim to have caught everything):**

```javascript
// The tokens from `tokens` that appear in `prompt`, case-insensitively. PURE, and exported so it
// can be driven in BOTH directions.
//
// Both directions are the point. A positive-only assertion ("the real prompt is clean") passes
// trivially today and would keep passing with a case-folding bug, an emptied token list, or a
// matcher wired to the wrong field ...
//
// Empty and whitespace-only tokens are dropped rather than matched: `''` is a substring of every
// string, so one blank entry in a list would make the guard claim to have caught everything.
export function forbiddenTokensIn(prompt, tokens) {
  const lowered = String(prompt == null ? '' : prompt).toLowerCase();

  return (Array.isArray(tokens) ? tokens : [])
    .filter((t) => typeof t === 'string' && t.trim() !== '')
    .filter((t) => lowered.includes(t.toLowerCase()));
}
```

`STATE_CLAIM_TOKENS` (`selfcheck-red.mjs` L334-359) is also the model for authoring the test-state
predicate set AS DATA, with the comment explaining why each token pairs a state word with a claim
rather than being a bare adverb.

**Return `null`/`{ok, why}` to signal absent; callers null-check** (CONVENTIONS.md L180-184). Do not
throw from the lib.

---

### `tools/lib/section-body.mjs` (utility, verbatim copy)

**Analog:** `.claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs` -- copy the 20-line
file BYTE-FOR-BYTE, including its header comment.

**The duplication convention is proven, not assumed:** `diff` reports
`.claude/skills/lz-red-workspace/tools/lib/scaffold-phrases.mjs` and
`.claude/skills/lz-refactor-workspace/tools/lib/scaffold-phrases.mjs` byte-identical
`[VERIFIED this session]`. There are ZERO cross-workspace imports today, and each workspace has its
own `package.json` + `npm run check`. A cross-import would make the lz-red battery fail if the
lz-refactor workspace moved.

---

### the 9-case corpus JSON (config/data, single source)

**Analogs:** `e2e-red-gilded-rose/targets.json` (per-id records with pinned metadata) and
`suite.json`'s `prompts` array (`[{ id, file, target, code }]`).

**Record shape (from RESEARCH Finding 10):**
`{ id, request, expectedOwner, expectedSecondHop, defectRef, matchTokens }`.

**Two conventions this file must carry:**

1. **A self-declaring provenance header** (D-23): cases 5-9 are RECONSTRUCTED, not the reviewer's
   verbatim set. The house idiom for an honest caveat INSIDE a data file is `suite.json`'s
   `requireExplicitApplyBase_note` key -- a sibling `<key>_note` string carrying the full rationale:
   ```json
   "requireExplicitApplyBase": true,
   "requireExplicitApplyBase_note": "This suite's real base is chosen AT THE GATE, not baked in above: ..."
   ```
2. **ONE source, two consumers.** The corpus feeds BOTH the guard (`matchTokens` + `expectedOwner`)
   and the eval (`prompts/<id>.md`). Assert the derivation in `selfcheck-routing.mjs` -- one prompt
   file per corpus case, ids matching. `selfcheck-red.mjs` L565-568 is the precedent (every
   `prompts[].target` must exist in `targets.json`, else fail).

---

### `variants/build-variants.mjs` (builder, destructive file-I/O)

**Analog:** `treatment/build-treatment.mjs` (400 lines). Read in full; every excerpt below is
verbatim.

**Header doctrine (L1-31), including the two sentences that ARE the fail-closed contract:**

```javascript
// Why a build script instead of committed copies: plugins/lz-tdd is 837K / 195 files, and each
// variant differs from it in one or two files. Git carries the artifact plus this script; the trees
// are built on demand into an already-gitignored directory (.gitignore `out/`).
//
// The shipped tree is never mutated. It IS the baseline arm of the A/B ...
//
// Everything here fails CLOSED. A silently-skipped insertion would produce a tree whose lever is
// absent, and the A/B would then measure nothing while looking healthy.
```

**Destination safety BEFORE any delete (L237-253) -- hardcoded, NO env override on the destructive
target:**

```javascript
  // Destination safety. Asserted BEFORE anything is deleted. Hardcoded, deliberately with NO env
  // override: the first thing this does to the path is a recursive delete, and an env-overridable
  // destructive target is a foot-gun. The runner's TREATMENT_DIR / FORCING_DIR carry the override
  // instead, because there the value is only ever READ.
  const dest = path.resolve(path.join(REPO_ROOT, 'out', variant.outName));
  const lastTwo = dest.split(path.sep).slice(-2);

  if (dest !== repoRoot && !dest.startsWith(repoRoot + path.sep)) {
    fail(`destination ${dest} is outside the repo root ${repoRoot}; refusing to delete anything`);
  }

  if (lastTwo[0] !== 'out' || lastTwo[1] !== variant.outName) {
    fail(`destination ${dest} does not end in out/${variant.outName}; refusing to delete anything`);
  }
```

**`VARIANTS` table shape (L170-195)** -- `{ id, outName, lever, activeLever, artifactSrc, anchor,
position, lines, marker, expectedDeltas }`. Variant C needs the vocabulary widened to at least
`{ insertBefore | replaceSection | deleteSection | addFile }`; **each new operation needs its own
fail-closed assert** (a `replaceSection` whose heading is absent must FAIL, not no-op).

**Anchor-count assert (L296-303) -- the model for every new operation's assert:**

```javascript
  const skillLines = fs.readFileSync(skillPath, 'utf8').split(/\r?\n/);
  const anchorAt = skillLines.reduce((acc, line, i) => (line.includes(variant.anchor) ? acc.concat(i) : acc), []);

  if (anchorAt.length !== 1) {
    fail(
      `${variant.id}: anchor count is ${anchorAt.length}, expected exactly 1, in ${SKILL_REL}. A zero-match insertion ` +
        'would yield a tree whose lever is absent.',
    );
  }
```

**`hashFile` / `hashTree` (L202-227) -- reuse verbatim; this is also the primitive for the D-11
frontmatter-identity assertion:**

```javascript
function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

// relative path -> content hash, for every file at any depth.
function hashTree(root) {
  const out = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (entry.isFile()) {
        out.set(path.relative(root, full), hashFile(full));
      }
    }
  };

  walk(root);

  return out;
}
```

**Delta-set exactness (L332-359) plus the manifest-name assert (L311-324) plus the source-untouched
proof (L235 `const before = hashTree(SOURCE_DIR);` -> L400 report). All four survive verbatim.**

**Pairwise-distinctness tail (L384-400) -- adapt to three trees; this is what catches "two arms are
the same tree twice":**

```javascript
for (const [a, b, label] of [
  [treatmentSkill, forcingSkill, 'treatment vs forcing'],
  [treatmentSkill, baselineSkill, 'treatment vs baseline'],
  [forcingSkill, baselineSkill, 'forcing vs baseline'],
]) {
  if (a === b) {
    fail(`${label}: the two ${SKILL_REL} files are IDENTICAL, so those arms are not distinct`);
  }
}
```

**ADD, per D-11:** the inverse assertion for frontmatter -- the extracted `description` block per
skill per tree must be sha256-IDENTICAL across all three trees. `hashFile`/`hashTree` gives the
primitive; the extraction is a frontmatter slice. Pitfall 3 (RESEARCH L1105-1114) names this the
single most important offline assertion in the phase.

**Note on style:** `build-treatment.mjs` uses SINGLE quotes; `check-*.mjs` in the same workspace uses
DOUBLE quotes. CONVENTIONS.md L64-66: "match the file you are editing." A new file modelled on
`build-treatment.mjs` should follow ITS quoting, not the checkers'.

---

### `e2e-rgr-routing/{suite.json,targets.json,prompts/,RUN-GATE.md}` (suite dir)

**Analog:** `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/` (all four artifacts present).

**`suite.json` -- copy the key set (`e2e-red-gilded-rose/suite.json`):**

```json
{
  "name": "red-gilded-rose",
  "repo": "D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript",
  "applyBase": "main",
  "protectedBranches": ["main", "master"],
  "skillCommand": "/lz-tdd:lz-red",
  "trackSkills": ["lz-red", "lz-tpp"],
  "preambles": {
    "apply": "You are pair-programming with me. ... Here is my question:\n\n"
  },
  "prompts": [
    { "id": "r1", "file": "r1-next-test.md", "target": "GRC", "code": true }
  ]
}
```

For the routing suite: `trackSkills: ["lz-red","lz-tpp","lz-refactor"]` (all three, since the metric
is which one gets named), a `recommend` preamble override, and 9 `prompts` entries. `applyBase` /
`protectedBranches` are apply-mode concerns and are not needed for a `recommend`-only suite.

**`targets.json` is REQUIRED even with no code target** -- `run-e2e.mjs` L92 reads it
UNCONDITIONALLY at module load, before any flag is parsed:

```javascript
// targets.json carries the file path per target id; the synthetic-base setup (D-02) needs it.
const TARGETS = JSON.parse(fs.readFileSync(path.join(SUITE_DIR, 'targets.json'), 'utf8'));
const TARGET_BY_ID = new Map((TARGETS.targets || []).map((t) => [t.id, t]));
```

**Preamble neutrality -- `run-e2e.mjs` L127-149.** The suite-level override mechanism exists and is
per SUITE, never per arm, "so prompt parity across the three arms is unaffected." The `recommend`
default is:

```javascript
  recommend:
    'You are pair-programming with me. Read what I point you at and tell me how you would ' +
    'approach it. Do NOT edit any file and do NOT run any command. Here is my question:\n\n',
```

**`RUN-GATE.md` -- copy the HALT structure (`e2e-red-gilded-rose/RUN-GATE.md` L1-40):**

```markdown
# lz-red APPLY Eval -- RUN-GATE (the gated metered-run presentation)

This file is DOCUMENTATION. It presents the ready-to-run gated metered commands and then STOPS.
Running any command below is out of scope for execute-phase; the metered 3-arm apply run is a
separate, freshly-approved, orchestrator-driven step.
...
## HALT -- METERED RUN

**METERED RUN -- requires fresh explicit user approval (eval-run-approval-gate). Do NOT run any
command below during execute-phase.**

This is the build-then-halt boundary (D-12). The instrument is BUILT and GREEN offline; every
`claude -p` command in this file spends real tokens and MUST NOT start without fresh explicit
approval per the standing eval-run-approval-gate. No prior approval and no `workflow.auto_advance`
setting carries over -- this gate is blocking-human and never auto-approvable. Until approval, the
phase is BUILD-complete and HALTED.

Offline instrument proof (zero spend -- safe to re-run any time; this is NOT the metered run):
```

D-14 requires TWO halts in this file (the placement A/B and the EVL-01 reciprocal trigger
regression), separately approvable, plus a note that stage 2's approval is not implied by stage 1's.

**`prompts/<id>.md`** = one bare request per case. Existing example: a single file
`prompts/r1-next-test.md`; the composed prompt is `preamble + body`, so the body carries no preamble
and no leading slash command.

---

### `grade-routing.mjs` (grader, transform + fail-closed artifact)

**Analogs:** `grade-red.mjs` (4,026 lines -- for the verdict-class doctrine and `--selfcheck` shape)
and `grade-run.mjs` (622 lines -- for `occursAffirmed` and `finalOutPath`).

**Closed verdict-label enumeration in the header -- `grade-red.mjs` L2-28. Copy the SHAPE (one line
per class, then the explicit `pass ==` definition, then why classes are kept apart):**

```javascript
// grade-red.mjs -- the D-06 RED correctness GATE + 9-class classifier (+ offline --selfcheck).
// ... and classifies the produced test into exactly one of:
//
//   genuinely_red   typecheck-clean AND >=1 ASSERTION failure in a test THE DIFF ADDED (a pass)
//   blunt_red       typecheck-clean AND the ADDED test's failure is a DELIBERATE not-implemented
//                   throw from a file the diff itself added or modified (also a pass)
//   false_green     the tests the diff added all pass; the diff changed only test files
//   ...
// pass == (verdict === 'genuinely_red' || verdict === 'blunt_red'). Everything else is reported,
// not passed (D-06). The two passing classes are kept APART rather than merged because ...
```

For routing the closed label set is `{lz-red, lz-tpp, lz-refactor, NONE}` plus the ordered pair
`(lz-red, lz-tpp)` for D-02's two-hop case, and the cardinality classes are
`exactly-one | multi | none`.

**Fail-closed doctrine sentence -- `grade-red.mjs` L49-53:**

```javascript
// It is a POST-RUN pass over captured artifacts ...; it does NOT drive claude and does NOT modify
// run-e2e.mjs. It fails CLOSED (T-21-02 / RESEARCH Security Domain): an unreadable/empty diff.patch,
// a garbled/keyless meta.json, an unparseable runner JSON, or a worktree that will not build throws /
// exits non-zero rather than silently scoring "no change".
```

**Shared classifier between the real gate and `--selfcheck` -- `grade-red.mjs` L60-62:**

```javascript
// The classifier logic is SHARED between the real gate (gradeRun) and --selfcheck (gradeFixture);
// only the runner command + cwd differ ...
```

**`occursAffirmed` -- copy from `grade-run.mjs` L162-183. This is the single most load-bearing reuse
in the grader: the classifier prose names all three skills, mostly inside EXCLUSION clauses, so a
bare `includes()` recreates the F-1 ceiling inside the grader:**

```javascript
// Phrase appears at least once as a real claim: present, negated in NEITHER direction, and not a
// hedged-then-retracted hypothetical.
function occursAffirmed(resp, phrase) {
  const re = phraseReAll(phrase);
  let m;

  while ((m = re.exec(resp)) !== null) {
    const idx = m.index;
    const end = idx + m[0].length;
    const negated = NEG.test(clauseBefore(resp, idx)) || NEG.test(clauseAfter(resp, end));

    if (!negated && !hedgedContrastive(resp, idx, end)) {
      return true;
    }

    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
  }

  return false;
}
```

**Fail-closed preliminary output -- `grade-run.mjs` L423-426, verbatim:**

```javascript
// Structural guard: never emit a FINAL-looking grading.json while judge items remain.
function finalOutPath(outArg, judgeCount) {
  return judgeCount > 0 ? path.join(path.dirname(outArg), "grading.preliminary.json") : outArg;
}
```

Paired with the `judge_required` accumulation at L409-420 (`expectations.filter((e) => e.passed ===
null).map((e) => e.text)`) -- `passed: null` is the "needs a judge" signal, and the grader routes
`multi` and `none` (except case 9) to it.

**`--selfcheck` block -- `grade-run.mjs` L428-439, the local-assert shape:**

```javascript
function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };
```

**Do NOT reuse `grade-run.mjs` itself.** It is structurally bound to the ten Phase-20 scenarios via
`RUBRICS[0-9]` with selfcheck-enforced count alignment (L405-407 throws `no rubric for eval-id`).
Reuse the two functions above; write a sibling.

---

### `selfcheck-routing.mjs` (selfcheck, process-spawn -> argv assertions)

**Analog:** `selfcheck-red.mjs` cruxes 1+2 (L299-471). Do NOT edit `selfcheck-red.mjs` -- D-22 keeps
it byte-unchanged.

**Dry-run spawn -- `selfcheck-red.mjs` L151-156:**

```javascript
// Spawn `node run-e2e.mjs --dry-run <extra>` and return its stdout. `env` overlays process.env for
  const r = spawnSync(process.execPath, [RUN_E2E, '--dry-run', ...extraArgs], {
```

The machine-parseable input it consumes is `run-e2e.mjs` L1067-1068:

```javascript
        // Machine-parseable, untruncated argv for the offline self-check (crux 1). See selfcheck-code-review.mjs.
        console.log(`argv: ${JSON.stringify(['claude', ...cmd])}`);
```

**Per-arm argv assertions -- `selfcheck-red.mjs` L371-409. This is the exact template for the three
placement arms:**

```javascript
  const arms = armMap(dryRun(extra));

  for (const name of ['no_skill', 'with_skill', 'invoke_skill']) {
    if (!arms[name]) {
      fail(`[crux 1] ${label}: dry-run did not compose the ${name} arm (got: ${Object.keys(arms).join(', ')})`);
    }
  }

  // with_skill: --plugin-dir ends with plugins/lz-tdd; -p is a natural prompt (no slash command).
  const wsPlugin = flagValue(arms.with_skill, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(wsPlugin)) {
    fail(`[crux 1] ${label}: with_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(wsPlugin)}`);
  }

  const wsPrompt = flagValue(arms.with_skill, '-p') || '';

  if (wsPrompt.startsWith('/')) {
    fail(`[crux 1] ${label}: with_skill -p must be a natural prompt (no leading slash command): ${JSON.stringify(wsPrompt.slice(0, 40))}`);
  }
```

**Byte-identical prompt parity -- `selfcheck-red.mjs` L411-420. For the placement A/B all THREE arms
must be byte-identical (no slash prefix on any of them, since descriptions are shared and
auto-trigger fires naturally):**

```javascript
  // crux 2: prompt-parity (EVL-03.1). no_skill == with_skill byte-identical; invoke == prefix + with_skill.
  const nsPrompt = flagValue(arms.no_skill, '-p') || '';

  if (nsPrompt !== wsPrompt) {
    fail(`[crux 2] ${label}: no_skill vs with_skill -p differ (must be byte-identical):\n  no_skill=${JSON.stringify(nsPrompt)}\n  with_skill=${JSON.stringify(wsPrompt)}`);
  }
```

**Suite discovery -- do NOT copy `discoverRedSuites()` (L305-312) as-is.** Its `startsWith('e2e-red-')`
filter is exactly why D-22 renames the suite. The new selfcheck targets ONE named suite dir directly.

---

### `ROUTING-AB-RESULTS.md` (writeup)

**Analog:** `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md` (EVL-03's
substance-only headline structure, Pass@k / Pass^k tables, unbiased-reviewer slot). D-25 puts the
writeup in a phase-scoped sibling rather than appending to `lz-red-workspace/EVAL-RESULTS.md` (515
lines of frozen EVL-01/EVL-02 evidence).

**Pass@k / Pass^k formulas -- reuse `tabulate-mechanical-red.mjs` L40-69 verbatim (already
selfchecked against fixtures):**

```javascript
// ---- Pass@k / Pass^k (copied VERBATIM from run-e2e.mjs / tabulate-mechanical.mjs; neither is
//      importably clean per the Phase-14 note) ----------------------------------------------------

// Pass@k (optimistic): prob >=1 of k sampled runs passes. Pass^k (conservative): all k pass.
// n = total runs, c = passing runs. Returns null when k > n.
function passAtK(n, c, k) {
  return k > n ? null : 1 - comb(n - c, k) / comb(n, k);
}

function passHatK(n, c, k) {
  return k > n ? null : comb(c, k) / comb(n, k);
}
```

Note the header comment records that the formulas are DUPLICATED across three files by deliberate
decision ("neither is importably clean") -- the same duplication-over-cross-import convention as
`section-body.mjs`.

---

## Pattern Assignments -- Additive edits to existing instruments

### `run-e2e.mjs` -- three `--plugin-dir` consts + one arm token

**Self-analog:** `TREATMENT_DIR` / `FORCING_DIR` (L50-73) and the `d12` token (L1029-1030).

**Const pattern (L50-62), including the comment that explains WHY an env override is safe here and
NOT on `PLUGIN_DIR`:**

```javascript
// The env override is safe HERE and only here, because this const is only ever READ as a
// --plugin-dir value. PLUGIN_DIR must NOT gain one: selfcheck-red.mjs crux 1/2 hard-assert that
// with_skill and invoke_skill resolve to plugins/lz-tdd for every suite, prompt and mode, and its
// dry runs spawn with inherited environment, so an exported override would redden the selfcheck
// from the operator's own shell. The build script's destination is hardcoded for the opposite
// reason: it starts with a recursive delete.
const TREATMENT_DIR = process.env.LZ_TREATMENT_DIR || path.join(REPO_ROOT, 'out', 'lz-tdd-treatment');
```

`variant_a` points at `PLUGIN_DIR` (the tracked tree IS variant A, D-24) and therefore needs no new
const; only `VARIANT_B_DIR` and `VARIANT_C_DIR` are new. Keep the "KEEP THE TWO IN SYNC" warning
(L53-54) -- the builder hardcodes the same paths.

**`buildCmd` chain (L304-312) -- append two branches, edit none:**

```javascript
  if (arm === 'with_skill' || arm === 'invoke_skill') {
    cmd.push('--plugin-dir', PLUGIN_DIR);
  } else if (arm === 'invoke_treatment') {
    cmd.push('--plugin-dir', TREATMENT_DIR);
  } else if (arm === 'invoke_forcing') {
    cmd.push('--plugin-dir', FORCING_DIR);
  } else if (arm === 'code_review') {
    cmd.push('--plugin-dir', MATTPOCOCK_DIR);
  }
```

**Arm-group token (L1015-1031) -- add `placement`, byte-preserving `all` / `both`. The comment
already records why a NEW token instead of an edit:**

```javascript
  // `d12` is a NEW token rather than an edit to an existing one, and that is deliberate: selfcheck
  // crux 6 pins the nx `--arm all` dry-run byte-for-byte, so adding a token keeps that guarantee
  // structural instead of merely tested. `both` and `all` are byte-unchanged.
  const arms =
    args.arm === 'both'
      ? ['with_skill', 'no_skill']
      : args.arm === 'all'
        ? ['with_skill', 'no_skill', 'invoke_skill']
        : args.arm === 'd12'
          ? ['invoke_skill', 'invoke_treatment', 'invoke_forcing']
          : [args.arm];
```

**Retrieval instrumentation (Finding 3 / Pitfall 5):** `extractResult` (L347+) already parses
`tool_use` blocks and separates three trigger facts (available / model-fired / forced, L326-346).
Recording "was `rgr-routing.md` actually READ" is an addition to that existing scan, not a new
mechanism.

---

### `check-hygiene.mjs` -- widen scope to `plugins/lz-tdd/references/` + `plugins/lz-tdd/README.md`

**Self-analog:** the `LZ_RED_*` block, which is the "ALL THREE axes" precedent (D-20a / A7 says the
plugin-wide references dir takes the same treatment as lz-red, being clean-room own-words):

```javascript
// lz-red skill tree -- in scope for ALL THREE axes: ASCII + work-email (wideTargets) AND
// no-verbatim (verbatimTargets). Unlike lz-tpp (cited FibTPP, no-verbatim-EXCLUDED by D-04),
// lz-red is clean-room own-words (DST-04), so it DOES take the no-verbatim gate.
const LZ_RED_SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");
const LZ_RED_SKILL_MD = path.join(LZ_RED_SKILL_DIR, "SKILL.md");
const LZ_RED_REFERENCES = path.join(LZ_RED_SKILL_DIR, "references");
```

```javascript
wideTargets.push(...walkMd(LZ_RED_REFERENCES));
...
verbatimTargets.push(...walkMd(LZ_RED_REFERENCES));
```

**MEASURED gap `[VERIFIED this session]`:** `plugins/lz-tdd/` contains exactly `README.md` (161
bytes) and `references/beck-tdd-by-example.md` (5,660 bytes) outside the three skill trees. Both fall
outside all three axes today.

**IMPORTANT correction for the planner -- there is NO file-count ASSERTION in this file today.** The
counts appear only in detail/summary STRINGS (L153, L185, L218, L223); the sole floor is the
three-anchor `scan floor` check (L160-172). D-21's "update the file-count assertion" therefore means
AUTHOR one. The analog for a non-vacuity count assert is `check-evals.mjs` L292-297:

```javascript
if (suiteDirs.length > 0 && suiteFileCount === 0) {
  fail(
    `found ${suiteDirs.length} e2e-red-* suite dir(s) but scanned 0 authored files in them; the hygiene ` +
      'sweep is not reaching the suite content it exists to cover (a SKIP is not a pass)',
  );
}
```

Measured baseline to move: `files: 197` -> `199` before the variant file exists.

---

### `check-evals.mjs` -- widen clause 8's glob

**Self-analog:** L277-279 (the `e2e-red-` filter) and L248-249 (the skip set):

```javascript
const SUITE_SCAN_EXTS = new Set(['.json', '.md']);
const SUITE_SKIP_DIR = /^(?:results|outputs|node_modules)|^run-/;
```

```javascript
const suiteDirs = readdirSync(here, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith('e2e-red-'))
  .map((e) => join(here, e.name));
```

Widen the filter so `e2e-rgr-routing` is included; keep `SUITE_SKIP_DIR` and the
`mechanical-red.json` exclusion (L261) so captured model text is never scanned. The non-vacuity
assert above must remain non-vacuous after the widen. Header clause list is at L16 and must be
updated in the same edit.

---

### `tabulate-mechanical-red.mjs` -- `--grade-file` parameter

**Self-analog:** the file's own `--selfcheck` argv handling (L679) and the fail-closed missing-grade
throw (L293-301):

```javascript
        const gradePath = path.join(dir, 'red-grade.json');
        ...
            `tabulate-red: captured run ${dir} is missing red-grade.json -- grade it with grade-red.mjs first (fail closed, T-21-02b)`,
```

Add a parameter, keep `red-grade.json` as the DEFAULT so Phase 21's frozen evidence path is
byte-unchanged, and re-run `--selfcheck` to prove the fixtures still pass. Header usage line to
extend (L30):

```javascript
//   node tabulate-mechanical-red.mjs --selfcheck  # offline, zero spend; assert rollup/auto-trigger/Pass@k on fixtures
```

---

### `.gitignore` -- explicit lines for the new suite

**Self-analog:** the `e2e-red-*` block (L62-75), including its own comment explaining why explicit
lines were added even though generic lines already covered the paths:

```
# Phase 21 RED apply suites (e2e-red-*): per-run capture tree under each suite dir. The generic
# lz-red-workspace results*/ + run-*/ lines above and the *-workspace outputs/ line already cover
# these paths; these explicit e2e-red-* lines make the new suite's run tree unambiguous
# (results/apply/<arm>/<pid>/run-N/{meta.json,answer.md,diff.patch,red-grade.json,outputs/}). No
.claude/skills/lz-red-workspace/e2e-red-*/**/results*/
.claude/skills/lz-red-workspace/e2e-red-*/**/run-*/
.claude/skills/lz-red-workspace/e2e-red-*/**/outputs/
...
.claude/skills/lz-red-workspace/e2e-red-*/mechanical-red.json
```

`out/` (L7) already covers the variant trees. The generic `**/results*/` + `**/run-*/` lines already
cover `e2e-rgr-routing`, so the new lines are for unambiguity, matching the file's own convention.
Add one for any new rollup JSON, mirroring `mechanical-red.json`.

---

## Shared Patterns

### Harness script skeleton (applies to EVERY new `.mjs`)

**Source:** `check-hygiene.mjs` (229 lines -- the cleanest complete example in the repo).
**Apply to:** `check-rgr-routing.mjs`, `check-rgr-routing.selftest.mjs`, `build-variants.mjs`,
`grade-routing.mjs`, `selfcheck-routing.mjs`.

Order, non-negotiable per CONVENTIONS.md:

1. `#!/usr/bin/env node`
2. Header comment block: what it checks, the invariants, the scope, the named failure mode, and a
   `//   node <path>` usage line.
3. Imports: `node:` builtins first, then local `./lib/*.mjs` with explicit `.mjs` extension. No
   aliases, no barrels.
4. Path resolution with the `..` walk COMMENTED.
5. `SCREAMING_SNAKE_CASE` module constants / data tables.
6. `let failures = 0;` + the `report()` funnel.
7. Checks.
8. Blank `console.log("")`, then `SUMMARY: ... GREEN` / `RED`, then `process.exit(0|1)`;
   `process.exit(2)` for IO/usage errors.

### The three named failure modes (CONVENTIONS.md L117-128)

**Apply to:** every new checker/grader/builder. Name the mode in a comment at the site.

- **fail-loud** -- an unrecognized-but-present input is reported explicitly, never silently passed.
  Reference: `toolDrive`'s `{ recognized: false }` in `grade-run.mjs` L186-189.
- **fail-closed** -- refuse to emit a final artifact while unresolved work remains. Reference:
  `finalOutPath` (above).
- **fail-safe / scan-floor** -- assert the load-bearing input exists so an empty scan cannot read as
  clean. Reference: `check-hygiene.mjs` L156-172 (above).

### ASCII-only, in code AND report strings

**Source:** `check-hygiene.mjs` axis (a), L84-94 + L174-185.
**Apply to:** every authored file this phase touches, including checker report labels, fixture
strings and comments. Substitutes: `->`, `--`, straight quotes, `*` / `-` bullets, `|` `|--` `'--`
for trees. Enforced at byte level (`buf[i] > 0x7f`).

### Email hygiene by allowlist-inversion

**Source:** `check-hygiene.mjs` L41-43 + L187-201.

```javascript
// Only the public contact is allowed in the public repo. The work email must never appear.
const APPROVED_EMAILS = new Set(["larsbrinknielsen@gmail.com"]);
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
```

**Apply to:** any new hygiene scope. EXTEND `APPROVED_EMAILS`; never add a forbidden literal as a
needle. `row-guards.selftest.mjs` L30-31 carries the corresponding fixture-level pledge:

```javascript
// No fixture, comment or label in this file contains any email-shaped token other than the project's
// approved public contact -- and no forbidden value is written even as a search needle, because the
// needle IS the leak. ASCII only.
```

### JS style (CONVENTIONS.md L63-73)

Two-space indent; double quotes in `tools/check-*.mjs`, single quotes in `build-treatment.mjs` /
`run-e2e.mjs` / `selfcheck-red.mjs` -- **match the file you are editing**; semicolons; blank line
around control flow and `return`; ALWAYS brace. No linter config is committed; style is convention
plus review.

### Main-module guard (only if another script imports the new file's tables)

**Source:** CONVENTIONS.md L191-198.

```javascript
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}
```

Needed for `lib/routing-parse.mjs` consumers (the checker AND the selftest both import it), and for
`grade-routing.mjs` if `selfcheck-routing.mjs` reuses its extraction function.

### `ponytail:` comments

**Source:** CONVENTIONS.md L75-77, e.g. `// ponytail: single self-contained script, no framework, no
config file`. **Apply to:** any deliberate simplification in a new script, naming its ceiling.

### Provenance identifiers in shipped prose

**Source:** CONVENTIONS.md L165-168. `D-04`, `TD-02`, `DST-04`, `WR-02`, `SEAM-02`, dated owner
decisions. **Apply to:** all shipped Markdown edits -- preserve existing identifiers and add this
phase's (`D-01`..`D-26`, `CLS-01`..`CLS-05`) where a decision is encoded in prose.

---

## Misleading Analogs -- do NOT copy blindly

| Analog | Why it misleads | What to do instead |
|--------|-----------------|--------------------|
| `check-red-references.mjs` SEAM-02 block (L514-525) | It is `existsSync`-GATED (`if (fs.existsSync(lzTppSkillPath)) { ... }`), which emits NOTHING when the file vanishes. **D-17 forbids this shape outright.** The same file's own header (L1007-1011) names it "a fully silent vacuous pass". | Copy the TD-02 block (L533-553): `try { ... } catch { text = "" }`, so `report()` runs exactly once every run. |
| `check-red-references.mjs` TD-02 ASSERTION (`/lz-red/.test(lzRefactorText)`, L547) | This IS the F-1 ceiling reviewer 1 measured: a renamed heading alone satisfies it. Copying the assertion reproduces the defect the phase exists to close. | Copy the READ, not the assertion. Make the heading a parse INPUT via `sectionBody` so a rename returns `null` -> attributable FAIL (Finding 4). |
| `check-red-references.mjs` `EXPECTED_CHECKS = 125` + `NEW_LABELS` + `RETIRED_LABELS` roster (L985-1127) | D-16 creates a SIBLING file precisely so this hand-maintained arithmetic and the 13-label roster stay untouched. Reproducing a roster in the new file adds a second literal to maintain; touching the original reddens the battery on `[2ig] roster integrity` instead of on the guard that found something (Pitfall 1). | Leave `check-red-references.mjs` byte-unchanged. If the new checker wants a count floor, it predicts its OWN literal and states its own arithmetic; do not import or mirror the 125. |
| `check-hygiene.mjs` `if (fs.existsSync(X)) { wideTargets.push(X) }` (L102-124) | Looks like an `existsSync` skip. It is not -- it is a scope BUILDER, and it is safe ONLY because the paired `scan floor` report (L160-172) fails loud when an anchor is missing. Copying the push-gate WITHOUT the floor produces exactly the vacuous pass D-17 forbids. | If you copy the scope builder, copy the scan floor in the same edit. For the new gate's per-surface READS, use the TD-02 try/catch instead. |
| `beck-tdd-by-example.md` `## The seam with lz-tpp` (L66-73) | Triple-defective and IN SCOPE to fix: skill-relative ("that is this skill's job", "stay here") in a plugin-wide file; TWO-WAY only (never names `lz-red`); and it **keys on test state** ("if the tests are green and the code has a smell") -- a direct SC3/D-03 violation. It is the file D-08 names as the precedent for variants B/C, so under variant C it would be the SECOND normative artifact, falsifying C's own premise. | Copy this file's FILE-LEVEL shape (H1, `Scope:` line, no-oracle banner, `## Sources`). For the seam CONTENT, author from D-01/D-02/D-03; do not paraphrase L66-73. |
| `lz-red/SKILL.md` L36-42 and `lz-tpp/SKILL.md` L41-44 narrative sections | Both end in the bare `otherwise ... is this skill` catch-all D-01 removes. They are the best available analog for FORM (three named seams, one paragraph, ends with a pointer) and the WORST for the terminal branch. | Copy the paragraph form and the `See "<heading>" above; do not restate it.` pointer. Replace the terminal per D-01. |
| `grade-run.mjs` as the grader base | Structurally bound to the ten Phase-20 scenarios (`RUBRICS[0-9]`, selfcheck-enforced count alignment; L405-407 throws on an unknown eval-id). Reusing it for the routing corpus means editing frozen Phase-20 evidence. | Reuse `occursAffirmed` + `finalOutPath` + the `--selfcheck` shape. Write a sibling `grade-routing.mjs`. |
| `selfcheck-red.mjs` `discoverRedSuites()` (L305-312) + `STATE_CLAIM_TOKENS` (L345-359) | Auto-discovers `e2e-red-*` and BANS 13 test-state tokens in prompts. The routing corpus MUST carry test-state facts by design (D-03 exists because routing has to ignore them), so a suite named `e2e-red-*` hard-fails a corpus that is CORRECT. | Name the suite `e2e-rgr-routing` (D-22); leave `selfcheck-red.mjs` byte-unchanged; add the sibling `selfcheck-routing.mjs`. Re-grep for other `e2e-` globs before committing to the name (Assumption A4) -- `check-evals.mjs` L278 is one, and it must be WIDENED not avoided. |
| `run-e2e.mjs` `--arm all` / `both` (L1024-1031) | Selfcheck crux 6 pins the nx `--arm all` dry-run BYTE-FOR-BYTE. Editing either token reddens a frozen guarantee. | Add a NEW `placement` token, exactly as `d12` did. |
| `run-e2e.mjs` `PLUGIN_DIR` (L40) | Adding an env override to it reddens `selfcheck-red.mjs` cruxes 1/2 from the operator's own shell (its dry-runs inherit the environment) -- see the comment at L56-61. | Env overrides on the two NEW variant consts only (read-only values). Never on `PLUGIN_DIR`; never on a destructive path in the builder. |
| `build-treatment.mjs`'s single insert-at-anchor operation | It supports exactly ONE transform. Variant C needs `replaceSection` / `deleteSection` / `addFile`. An anchor-based transform whose heading was reworded NO-OPS silently, producing a healthy-looking tree that measures nothing (Pitfall 4). | Widen the operation vocabulary and add one fail-closed assert PER new operation, mirroring the `anchorAt.length !== 1` check. |
| `sectionBody` returning `null` | Reads like an "absent, skip it" signal in the four catalog checkers that share it. | Here `null` is a FAILURE with an attributable label (Stage 1 of the parse). Never `continue` on it. |
| `git grep` for verifying variant-tree content | `out/` is gitignored, so `git grep` returns a SILENT ZERO with no error (Pitfall 6). | Use `rg` with an explicit path into `out/` (no flags needed for a named root). Check the exit code: 1 = genuine no-match, 2 = failed command. |
| A GREEN battery as an acceptance verdict | This phase EXISTS because a green 125/125 battery coexisted with a non-exhaustive classifier. STATE.md (2026-07-29): "THE BATTERY IS NOT THE GATE". | D-18's orchestrator-run UNPRIMED acceptance review is the gate; the battery is a floor. `gsd-executor` has no Agent tool -- plan those tasks as orchestrator steps after the executor returns. |

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `plugins/lz-tdd/references/rgr-routing.md` (variants B/C) | plugin-wide shared reference / routing table | request-response | Only ONE file exists in `plugins/lz-tdd/references/` today, and its routing section is the ANTI-pattern (see above). The FILE SHAPE analog is solid (`beck-tdd-by-example.md`'s H1 + `Scope:` line + provenance banner + `## Sources`); the TABLE analog is `lz-red/references/principle-backing.md` for a `pipe-table`-parsable shape. There is no existing normative cross-skill routing table to copy -- author it from D-01..D-04 plus RESEARCH "Pattern 1". |

Everything else has an in-repo analog. RESEARCH's own conclusion holds: "every primitive this phase
needs already exists in one of the two workspaces."

---

## Metadata

**Analog search scope:**
`plugins/lz-tdd/` (skills x3 + plugin-wide references + README),
`.claude/skills/lz-red-workspace/` (root scripts, `tools/`, `tools/lib/`, `treatment/`,
`e2e-red-gilded-rose/`),
`.claude/skills/lz-refactor-workspace/` (`tools/`, `tools/lib/`, `e2e-nx/`),
`.gitignore`, both `package.json` files.

**Files read this session (analogs):** 24
`section-body.mjs`, `heading-scan.mjs`, `provenance-honesty.selftest.mjs`,
`lz-red-workspace/package.json`, `check-hygiene.mjs` (full),
`check-red-references.mjs` (L1-95, L396-475, L496-565, L985-1137),
`row-guards.selftest.mjs` (L1-100, L212-266, L390-483),
`build-treatment.mjs` (full), `run-e2e.mjs` (L40-149, L276-355, L995-1084),
`grade-run.mjs` (L150-194, L405-439), `grade-red.mjs` (L1-62),
`selfcheck-red.mjs` (L296-425), `check-evals.mjs` (L238-307),
`tabulate-mechanical-red.mjs` (L36-75), `e2e-red-gilded-rose/{suite.json,RUN-GATE.md L1-40}`,
`lz-refactor/SKILL.md`, `lz-red/SKILL.md`, `lz-tpp/SKILL.md`,
`beck-tdd-by-example.md`, `three-laws-and-test-selection.md` (L112-139),
plus directory inventories and a `diff` of both `scaffold-phrases.mjs` copies.

**Measurements taken this session:**
- `scaffold-phrases.mjs` byte-identical across both `tools/lib/` dirs -- the duplication convention
  is verified, not inferred.
- `plugins/lz-tdd/` contains exactly `README.md` + `references/beck-tdd-by-example.md` outside the
  three skill trees -- Finding 8's hygiene hole confirmed.
- `check-hygiene.mjs` has NO file-count assertion today (counts appear only in detail strings); the
  sole floor is the three-anchor `scan floor` check. D-21's count assertion must be AUTHORED.
- `check-evals.mjs` L278 is a SECOND `e2e-red-`-anchored glob beyond `selfcheck-red.mjs` (partially
  discharges Assumption A4; keep re-grepping).

**Pattern extraction date:** 2026-08-03
