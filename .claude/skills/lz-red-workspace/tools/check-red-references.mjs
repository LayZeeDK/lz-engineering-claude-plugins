#!/usr/bin/env node
// Phase-18 content-completeness gate for the lz-red SKILL.md coach procedure + the RED references
// (extended in place from the Phase-16 SEL/STR/NAME core gate and the Phase-17 ASRT/RTR/VIT/ANTI
// slices; D-13 instrument-first, extend-in-place, no sibling checker). A mirror of check-backing.mjs
// (per-file topic-token presence + SUMMARY + process.exit(0|1), accumulate-then-exit, run from
// anywhere), with these additions over the bare template: a PER-FILE `requireFence` flag (>= 1
// tsc-strict ts fence, borrowed from check-catalog's fence idiom); a `requireNonIgnoreFence` flag (a
// BARE ts fence only, so a coverage-skipping ts-ignore fence cannot satisfy VIT-02); a per-entry
// `dir` base override (SKILL.md sits at the skill root, not under references/); an `absent`
// no-stale-marker guard (the D-14 inverse of `deferral`); filename-presence cross-link tokens folded
// into `topics`; and a post-loop SEAM-02 block reading the shipped lz-tpp/SKILL.md.
//
// Eleven FILES entries: the SKILL.md router (dir-override entry -- coach-procedure tokens + a
// non-ignore ts fence + a no-stale-marker guard) plus the ten lz-red references. The four co-edited
// Phase-18 slices (three-laws-and-test-selection, test-structure-and-assertions,
// vitest-typescript-mechanics, principle-backing) had their must-REMAIN Phase-18 deferral guards
// FLIPPED to positive content topics + an `absent: /Phase 18/i` no-stale-marker guard; every
// Phase-16/17 topic is kept as the regression floor.
//
// RED against the current placeholder / un-filled Phase-18 slices BY DESIGN -- this is the
// instrument-first Wave-0 Nyquist baseline, NOT a failure. The tsc extractor is GREEN-on-empty (it
// compiles whatever fences exist), so it cannot be the content-completeness signal; THIS checker is.
// The SKILL.md placeholder trips /\bplaceholder\b/i, carries no bare ts fence, and still carries the
// deferral marker; the four co-edited slices still carry their `/Phase 18/i` marker; and lz-tpp has
// no reverse pointers yet -- so the gate is RED now and flips GREEN only when later waves author the
// coach procedure + a tsc-strict Vitest fence, fill the four slices, remove every deferral marker,
// and add both lz-tpp reverse pointers. The Phase-17.1 D-05 honesty gate stays intact.
//   node .claude/skills/lz-red-workspace/tools/check-red-references.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { findBookCitedAsOwned } from "./lib/provenance-honesty.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");
// The lz-red skill ROOT (parent of references/). The SKILL.md FILES entry resolves against it via a
// per-entry `dir` override, since the checker otherwise reads only references/ (Pitfall 2).
const SKILL_ROOT = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");

// One entry per lz-red RED reference (subdir names include the `testing-stance/` segment, joined
// under REFERENCES). topics = content-present line patterns (present once the slice is authored),
// including filename-presence tokens for the required cross-links / cross-references. requireFence =
// assert >= 1 tsc-strict ts fence for that file (VIT-02 "examples throughout"; false for nav-only /
// prose-only files the tsc extractor skips or that carry no example). deferral = a must-REMAIN
// later-phase marker for a CO-EDITED stub, so a wave fills only its own slice. absent = the inverse
// of deferral (D-14 no-stale-marker guard): FAILS if the pattern is still PRESENT, so once a slice
// is filled its `/Phase 18/i` deferral artifact must be gone. The needle is `/Phase 18/i` ONLY --
// LAW-0 / SEAM-0 legitimately remain as requirement refs (LAW-01 / SEAM-01) in filled content.
// requireNonIgnoreFence = assert >= 1 BARE ts fence (exactly ```ts / ```typescript) the tsc extractor
// actually compiles; unlike requireFence's looser TS_FENCE_RE a ```ts ignore fence does NOT satisfy
// it (VIT-02 real coverage). dir = optional per-entry base dir (defaults to REFERENCES); the SKILL.md
// entry sets it to the skill root so the checker reaches the router at the tree root.
const FILES = [
  {
    name: "three-laws-and-test-selection.md",
    requireFence: true,
    topics: [
      { label: "running test list", re: /test list/i },
      { label: "one small/single step", re: /one (small |single )?step/i },
      { label: "degenerate / starter case", re: /degenerate|starter|empty|zero|null/i },
      { label: "triangulation (test-selection facet)", re: /triangulat/i },
      { label: "lz-tpp GREEN firewall reference", re: /lz-tpp/i },
      // Phase-18 spine slice (filled this phase; LAW-01, SEAM-01).
      { label: "Three Laws spine present", re: /three laws|law 1|law 2|law 3/i },
      { label: "classify-first framing", re: /classify/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    name: "test-structure-and-assertions.md",
    requireFence: true,
    topics: [
      // STR slice (Phase 16, kept -- regression floor).
      { label: "arrange-act-assert", re: /arrange-act-assert/i },
      { label: "given-when-then", re: /given-when-then/i },
      { label: "assert-first", re: /assert-first/i },
      { label: "evident test data", re: /evident (test )?data/i },
      { label: "one concept per test", re: /one concept/i },
      // ASRT slice (Phase 17, filled this milestone).
      { label: "four pillars", re: /four pillars/i },
      { label: "resistance to refactoring", re: /resistance to refactoring/i },
      { label: "F.I.R.S.T. properties", re: /F\.I\.R\.S\.T\./ },
      { label: "observable behavior", re: /observable behavior/i },
      { label: "communication-based selection", re: /communication-based/i },
      // ASRT-02 spine (ROADMAP SC1): the assertions slice points at the three stance leaves.
      { label: "links functional-core.md", re: /functional-core\.md/ },
      { label: "links message-matrix.md", re: /message-matrix\.md/ },
      { label: "links seams-and-legacy.md", re: /seams-and-legacy\.md/ },
      // Phase-18 slice (filled this phase; LAW-02 leans on the owned F.I.R.S.T. row).
      { label: "F.I.R.S.T. red-step baseline", re: /red-step baseline/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    name: "naming.md",
    requireFence: true,
    topics: [
      { label: "should-naming primary convention", re: /\bshould\b/i },
      { label: "behavior-oriented naming", re: /behavior/i },
      { label: "Osherove three-part alternative", re: /osherove|three-part/i },
      { label: "match the house naming stance", re: /match.*(house|stance)/i },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/README.md",
    requireFence: false,
    topics: [
      { label: "detection signal", re: /detection signal/i },
      { label: "route table", re: /route table/i },
      { label: "links functional-core.md", re: /functional-core\.md/ },
      { label: "links message-matrix.md", re: /message-matrix\.md/ },
      { label: "links seams-and-legacy.md", re: /seams-and-legacy\.md/ },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/functional-core.md",
    requireFence: true,
    topics: [
      { label: "functional core", re: /functional core/i },
      { label: "imperative shell", re: /imperative shell/i },
      { label: "value-based/output-based assert", re: /value-based|output-based/i },
      { label: "no doubles in the core", re: /no (test )?doubles?/i },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/message-matrix.md",
    requireFence: true,
    topics: [
      { label: "incoming query", re: /incoming query/i },
      { label: "incoming command", re: /incoming command/i },
      { label: "outgoing command", re: /outgoing command/i },
      { label: "outgoing query", re: /outgoing query/i },
      { label: "expect-to-send warranted double", re: /expect[ -]to[ -]send|expect to send/i },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/seams-and-legacy.md",
    requireFence: false,
    topics: [
      { label: "seam", re: /\bseam/i },
      { label: "characterization", re: /characterization/i },
      { label: "sequencing", re: /sequenc/i },
      // RTR-01 cross-link presence guard (check-backing cross-link idiom): cross-linked, not copied.
      { label: "cross-link refactoring-without-tests.md", re: /refactoring-without-tests\.md/ },
    ],
    deferral: null,
  },
  {
    name: "vitest-typescript-mechanics.md",
    requireFence: true,
    topics: [
      { label: "it.todo running test list", re: /it\.todo|test\.todo/ },
      { label: "test.each/it.each triangulation", re: /test\.each|it\.each/ },
      { label: "vi.* restraint", re: /restraint/i },
      { label: "watch loop", re: /watch/i },
      { label: "fails for the right reason", re: /right reason|AssertionError/ },
      { label: "ADV forward-pointer", re: /ADV-0|expectTypeOf|fast-check/ },
      // Cross-reference filename-presence tokens for the leaf's outbound links.
      { label: "cross-ref anti-patterns.md", re: /anti-patterns\.md/ },
      { label: "cross-ref message-matrix.md", re: /message-matrix\.md/ },
      // Phase-18 slice (filled this phase; ties the red-bar mechanic to the LAW-02 procedure step).
      { label: "fail-for-the-right-reason procedure step", re: /procedure step|law-02|law 2/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    name: "anti-patterns.md",
    requireFence: false,
    topics: [
      { label: "over-mock/test-per-class", re: /over-mock|test-per-class/i },
      { label: "private methods", re: /private method/i },
      { label: "multiple unrelated assertions", re: /unrelated assert|multiple.*assert/i },
      { label: "passes immediately / no red", re: /passes immediately|never.?red|no red/i },
      { label: "snapshot as thinking", re: /snapshot/i },
      { label: "slow / order-dependent", re: /order-dependent|slow test/i },
      { label: "listen to the tests", re: /listen to the tests/i },
      { label: "GOOS counterpoint", re: /goos|counterpoint/i },
      { label: "Test Desiderata", re: /desiderata/i },
      { label: "tradeoff/heuristic lens", re: /tradeoff|heuristic/i },
    ],
    deferral: null,
  },
  {
    name: "principle-backing.md",
    requireFence: false,
    topics: [
      { label: "owned/oracle-verified tier", re: /oracle-verified/i },
      { label: "no-oracle tier", re: /no-oracle/i },
      { label: ">= 1 recommendation link", re: /\]\([^)]+\.md/ },
      { label: "named Phase-17 source (Khorikov)", re: /Khorikov/i },
      // Phase-18 slice (filled this phase; LAW / SEAM backing rows + access tiers).
      { label: "Three Laws backing row", re: /three laws/i },
      { label: "lz-tpp seam backing row", re: /seam|handoff/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    // NET-NEW (D-13, Pitfall 2): the SKILL.md coach procedure sits at the skill ROOT, so it resolves
    // via the `dir` override (the checker reads references/ only by default). requireNonIgnoreFence
    // demands a BARE ts fence the tsc extractor compiles (VIT-02), not a skipped `ts ignore` fence.
    name: "SKILL.md",
    dir: SKILL_ROOT,
    requireNonIgnoreFence: true,
    topics: [
      { label: "classify-first", re: /classify/i },
      { label: "Three Laws spine", re: /three laws|law 1|law 2|law 3/i },
      { label: "stance routing step", re: /route|routing/i },
      { label: "house test idiom", re: /house .*idiom|test idiom|idiom/i },
      { label: "natural-language override", re: /override|plain language|stance preference/i },
      { label: "fail for the right reason", re: /right reason|AssertionError/ },
      { label: "forward lz-tpp handoff", re: /lz-tpp/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
];

// File-level assertion (per-file via requireFence): at least one tsc-strict TypeScript fence
// (check-catalog fence idiom). A reliable RED-until-authored content signal for the example-bearing
// slices that the GREEN-on-empty tsc extractor cannot itself provide (VIT-02: >= 1 Vitest example).
const TS_FENCE_RE = /```(ts|typescript)\b/;

// A NON-ignore ts fence-open: the info string is EXACTLY `ts` or `typescript` (CommonMark allows up
// to three leading spaces), end-of-line right after the language token. Unlike TS_FENCE_RE -- whose
// `\b` sits before a space, so it also matches a coverage-skipping ```ts ignore fence that
// extract-samples.mjs silently skips -- this requires a BARE fence the tsc extractor actually
// compiles, so VIT-02 gets real tsc --strict coverage (Pitfall 3).
const NON_IGNORE_TS_FENCE_RE = /^\s{0,3}```(ts|typescript)\s*$/m;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("lz-red Phase-18 coach-procedure + reference completeness check (RED-on-stubs by design)");
console.log(`  references dir: ${path.relative(repoRoot, REFERENCES)}`);
console.log("");

let filesPresent = 0;

for (const spec of FILES) {
  const filePath = path.join(spec.dir ?? REFERENCES, spec.name);

  if (!fs.existsSync(filePath)) {
    report(false, `${spec.name} exists`, "not found");
    continue;
  }

  filesPresent++;
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  for (const topic of spec.topics) {
    const hit = lines.some((line) => topic.re.test(line));
    report(hit, `${spec.name}: ${topic.label}`, hit ? "" : "topic token absent");
  }

  if (spec.requireFence) {
    const hasFence = TS_FENCE_RE.test(text);
    report(hasFence, `${spec.name}: >= 1 ts fence`, hasFence ? "" : "no tsc-strict TypeScript fence yet");
  }

  if (spec.requireNonIgnoreFence) {
    const hasNonIgnoreFence = NON_IGNORE_TS_FENCE_RE.test(text);
    report(
      hasNonIgnoreFence,
      `${spec.name}: >= 1 non-ignore ts fence`,
      hasNonIgnoreFence ? "" : "no bare tsc-strict TypeScript fence yet (a `ts ignore` fence does not count)"
    );
  }

  const scaffold = SCAFFOLD_RES.find((re) => re.test(text));
  report(!scaffold, `${spec.name}: no scaffold phrase`, scaffold ? `matches ${scaffold}` : "");

  if (spec.deferral) {
    const kept = lines.some((line) => spec.deferral.re.test(line));
    report(kept, `${spec.name}: ${spec.deferral.label}`, kept ? "" : "later-phase deferral marker missing");
  }

  // Inverse of deferral (D-14): a filled slice must NOT keep its `/Phase 18/i` deferral artifact.
  // PASS only when NO line matches; RED now because the un-filled slices still carry the marker.
  if (spec.absent) {
    const present = lines.some((line) => spec.absent.re.test(line));
    report(!present, `${spec.name}: ${spec.absent.label}`, present ? `stale marker still present (matches ${spec.absent.re})` : "");
  }
}

// Phase-17.1 D-05 honesty gate: no principle-backing.md row may be tagged "Owned;
// oracle-verified ..." while its Source cell still cites Kent Beck, Test-Driven Development by
// Example (Access: book, summary-only, never gateable -- 17.1-CONTEXT.md D-05). Generic over the
// whole table so a future tier-cell flip that forgets to also fix the Source cell trips this, not
// just the six Beck rows re-tiered in Phase 17.1. See lib/provenance-honesty.mjs.
const principleBackingPath = path.join(REFERENCES, "principle-backing.md");

if (fs.existsSync(principleBackingPath)) {
  const bookOwnedViolations = findBookCitedAsOwned(fs.readFileSync(principleBackingPath, "utf8"));

  report(
    bookOwnedViolations.length === 0,
    "principle-backing.md: D-05 honesty gate (no Owned row cites the book)",
    bookOwnedViolations.length === 0 ? "" : `violating rows: ${bookOwnedViolations.join(", ")}`
  );
}

// SEAM-02 (D-09): the reverse pointers in the SHIPPED lz-tpp skill. The red-green-refactor seam is
// fully wired only when lz-tpp/SKILL.md points BACK at BOTH siblings -- lz-red (the red step) AND
// lz-refactor (the refactor step), added in one edit. Reads a path OUTSIDE the lz-red references
// tree, so it is a standalone post-loop block (mirrors the D-05 honesty-gate idiom). RED now: the
// shipped lz-tpp skill carries no cross-skill pointer section yet.
const lzTppSkillPath = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-tpp", "SKILL.md");

if (fs.existsSync(lzTppSkillPath)) {
  const lzTppText = fs.readFileSync(lzTppSkillPath, "utf8");
  const bothPointers = /lz-red/.test(lzTppText) && /lz-refactor/.test(lzTppText);

  report(
    bothPointers,
    "lz-tpp/SKILL.md: SEAM-02 reverse pointers (lz-red AND lz-refactor)",
    bothPointers ? "" : "lz-tpp skill missing one or both reverse pointers"
  );
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} lz-red surfaces authored (SKILL.md coach procedure + SEL/STR/NAME/ASRT/RTR/VIT/ANTI references) with topics + required ts fences + cross-links, no scaffold leak, no stale Phase-18 markers, SEAM-02 lz-tpp reverse pointers present, D-05 honesty gate holds`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} surfaces present, ${failures} check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)`);
process.exit(1);
