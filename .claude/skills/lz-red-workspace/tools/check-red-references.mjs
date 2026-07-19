#!/usr/bin/env node
// Phase-17 content-completeness gate for the lz-red RED references (extended from the Phase-16
// SEL/STR/NAME core gate; D-13 instrument-first, extend-in-place, no sibling checker). A mirror of
// check-backing.mjs (per-file topic-token presence + SUMMARY + process.exit(0|1), accumulate-then-exit,
// run from anywhere), with three additions over the bare template: a PER-FILE `requireFence` flag
// (>= 1 tsc-strict ts fence, borrowed from check-catalog's fence idiom, asserted only where true), a
// must-REMAIN later-phase deferral guard on each co-edited stub, and filename-presence cross-link /
// cross-reference tokens (folded into `topics`, the check-backing fowler-catalog idiom).
//
// Ten FILES entries: three carried-over Phase-16 core refs (three-laws + naming unchanged; the
// test-structure-and-assertions assertions slice FLIPPED -- STR tokens kept, five ASRT tokens + three
// stance-leaf filename tokens added, the Phase-17 deferral replaced by a Phase-18 F.I.R.S.T.-baseline
// deferral), the six new Phase-17 slices (testing-stance README + functional-core + message-matrix +
// seams-and-legacy, vitest-typescript-mechanics, anti-patterns), and the co-edited principle-backing.
//
// RED against the current Phase-15 stubs BY DESIGN -- this is the instrument-first Wave-0 Nyquist
// baseline, NOT a failure. The tsc extractor is GREEN-on-empty (0 fences compile vacuously), so it
// cannot be the content-completeness signal; THIS checker is. Each unfilled stub carries a
// `## Sources (placeholder)` heading (trips /\bplaceholder\b/i via the shared SCAFFOLD set) and, where
// requireFence is true, zero ts fences, so the gate is RED now and flips GREEN only when Waves 2-3
// author real content, add a tsc-strict Vitest fence, add the cross-links, keep the Phase-18 markers,
// and rewrite `## Sources (placeholder)` to a real `## Sources` section. The deferral guards assert
// each co-edited stub keeps its later-phase (Phase 18) marker so a wave fills only its own slice.
//   node .claude/skills/lz-red-workspace/tools/check-red-references.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");

// One entry per lz-red RED reference (subdir names include the `testing-stance/` segment, joined
// under REFERENCES). topics = content-present line patterns (present once the slice is authored),
// including filename-presence tokens for the required cross-links / cross-references. requireFence =
// assert >= 1 tsc-strict ts fence for that file (VIT-02 "examples throughout"; false for nav-only /
// prose-only files the tsc extractor skips or that carry no example). deferral = a must-REMAIN
// later-phase marker for a CO-EDITED stub, so a wave fills only its own slice.
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
    ],
    deferral: { label: "Phase 18 spine/seam marker remains", re: /Phase 18|LAW-0|SEAM-0/ },
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
    ],
    deferral: { label: "Phase 18 F.I.R.S.T.-baseline/LAW marker remains", re: /Phase 18|LAW-0/ },
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
    ],
    deferral: { label: "Phase 18 LAW-02 spine marker remains", re: /Phase 18|LAW-0/ },
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
    ],
    deferral: { label: "Phase 18 Three-Laws/seam backing marker remains", re: /Phase 18|LAW-0|SEAM-0/ },
  },
];

// File-level assertion (per-file via requireFence): at least one tsc-strict TypeScript fence
// (check-catalog fence idiom). A reliable RED-until-authored content signal for the example-bearing
// slices that the GREEN-on-empty tsc extractor cannot itself provide (VIT-02: >= 1 Vitest example).
const TS_FENCE_RE = /```(ts|typescript)\b/;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("lz-red Phase-17 reference completeness check (RED-on-stubs by design)");
console.log(`  references dir: ${path.relative(repoRoot, REFERENCES)}`);
console.log("");

let filesPresent = 0;

for (const spec of FILES) {
  const filePath = path.join(REFERENCES, spec.name);

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

  const scaffold = SCAFFOLD_RES.find((re) => re.test(text));
  report(!scaffold, `${spec.name}: no scaffold phrase`, scaffold ? `matches ${scaffold}` : "");

  if (spec.deferral) {
    const kept = lines.some((line) => spec.deferral.re.test(line));
    report(kept, `${spec.name}: ${spec.deferral.label}`, kept ? "" : "later-phase deferral marker missing");
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} lz-red references authored (SEL/STR/NAME + ASRT/RTR/VIT/ANTI) with topics + required ts fences + cross-links, no scaffold leak, Phase-18 deferral markers intact`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} references present, ${failures} check(s) FAILED (instrument-first Phase-17 RED baseline by design pre-content)`);
process.exit(1);
