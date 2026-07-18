#!/usr/bin/env node
// SEL-01/SEL-02/STR-01/STR-02/NAME-01 completeness gate for the three CORE lz-red RED references.
// A mirror of check-backing.mjs (per-file topic-token presence + SUMMARY + process.exit(0|1),
// accumulate-then-exit, run from anywhere), with two additions over the bare template: a file-level
// `>= 1 ts fence` assertion (borrowed from check-catalog's fence idiom) and a must-REMAIN later-phase
// deferral guard on the two co-edited stubs.
//
// RED against the current Phase-15 stubs BY DESIGN -- this is the instrument-first Wave-0 Nyquist
// baseline, NOT a failure. The tsc extractor is GREEN-on-empty (0 fences compile vacuously), so it
// cannot be the content-completeness signal; THIS checker is. Each stub today carries a
// `## Sources (placeholder)` heading (trips /\bplaceholder\b/i via the shared SCAFFOLD set) and zero
// ts fences, so the gate is RED now and flips GREEN only when Phase-16 authoring adds a tsc-strict
// Vitest fence AND rewrites `## Sources (placeholder)` to a real `## Sources` section. The deferral
// guard asserts each co-edited stub keeps its later-phase marker (Phase 17 assertions / Phase 18
// spine) so Wave-1 fills only its own slice and never over-fills a later phase's.
//   node .claude/skills/lz-red-workspace/tools/check-red-references.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");

// One entry per Phase-16 core reference. topics = content-present line patterns (present once the
// slice is authored). deferral = a must-REMAIN later-phase marker for the two CO-EDITED stubs, so
// Wave-1 fills only its slice; naming.md is fully Phase 16 -> no deferral guard.
const FILES = [
  {
    name: "three-laws-and-test-selection.md",
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
    topics: [
      { label: "arrange-act-assert", re: /arrange-act-assert/i },
      { label: "given-when-then", re: /given-when-then/i },
      { label: "assert-first", re: /assert-first/i },
      { label: "evident test data", re: /evident (test )?data/i },
      { label: "one concept per test", re: /one concept/i },
    ],
    deferral: { label: "Phase 17 assertions marker remains", re: /Phase 17|ASRT-0/ },
  },
  {
    name: "naming.md",
    topics: [
      { label: "should-naming primary convention", re: /\bshould\b/i },
      { label: "behavior-oriented naming", re: /behavior/i },
      { label: "Osherove three-part alternative", re: /osherove|three-part/i },
      { label: "match the house naming stance", re: /match.*(house|stance)/i },
    ],
    deferral: null,
  },
];

// File-level assertion: at least one tsc-strict TypeScript fence (check-catalog fence idiom). The
// stubs have zero ts fences today -- a reliable RED-until-authored content signal the GREEN-on-empty
// tsc extractor cannot itself provide (D-10 requires >= 1 Vitest example per core ref).
const TS_FENCE_RE = /```(ts|typescript)\b/;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("SEL/STR/NAME core-reference completeness check (RED-on-stubs by design)");
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

  const hasFence = TS_FENCE_RE.test(text);
  report(hasFence, `${spec.name}: >= 1 ts fence`, hasFence ? "" : "no tsc-strict TypeScript fence yet");

  const scaffold = SCAFFOLD_RES.find((re) => re.test(text));
  report(!scaffold, `${spec.name}: no scaffold phrase`, scaffold ? `matches ${scaffold}` : "");

  if (spec.deferral) {
    const kept = lines.some((line) => spec.deferral.re.test(line));
    report(kept, `${spec.name}: ${spec.deferral.label}`, kept ? "" : "later-phase deferral marker missing");
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} core references authored (SEL/STR/NAME) with topics + ts fence, no scaffold leak, deferral markers intact`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} references present, ${failures} check(s) FAILED (instrument-first RED baseline by design pre-content)`);
process.exit(1);
