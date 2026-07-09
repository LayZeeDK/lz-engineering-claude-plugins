#!/usr/bin/env node
// PRIN-01/02/03 principle-backing structural gate (D-09). A sibling of check-principles.mjs (NOT an
// overload of that FWL-03-specific checker): same line-oriented topic-token presence model, same
// [PASS]/[FAIL] + SUMMARY + process.exit(0|1) convention. Asserts, per no-oracle backing reference:
//   - beck-tdd-by-example.md   : red-green-refactor cycle, the two rules, Fake It, Triangulate,
//                                Obvious Implementation, and the lz-tpp seam (PRIN-01);
//   - beck-tidy-first.md       : structural / behavioral separation, coupling, cohesion, options,
//                                PLUS >=1 link into ../fowler-catalog/<slug>.md (PRIN-02 core: the
//                                overlapping Fowler refactorings are cross-referenced by LINK, PRESENCE
//                                only -- link RESOLUTION is check-crossrefs's job, no second resolver);
//   - refactoring-without-tests.md : seams, characterization test, the change algorithm, Sprout, Wrap,
//                                Subclass and Override, Extract Interface (PRIN-03).
// For ALL THREE: the visible no-oracle provenance tag (/no-oracle/i) must be present AND no draft
// SCAFFOLD phrase may leak (TODO / TBD / placeholder / "once it exists" / "to be authored"). A missing
// file is a FAIL, mirroring check-principles handling of an absent file.
// Line-oriented (a soft-wrapped token cannot false-negative -- the Phase 2/3 lesson). Throwaway; node
// builtins only. RED against the phase-open tree BY DESIGN (2 Beck files absent + the Feathers stub's
// `## Sources (placeholder)` trips the SCAFFOLD guard) -- that is the EXPECTED instrument-first Wave-1
// baseline, not a failure. PRIN-01/02/03 close only when the Wave-2 authoring turns this gate GREEN.
//   node .claude/skills/lz-refactor-workspace/tools/check-backing.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");

// Per-file core topic tokens (D-08 scope; RESEARCH topic-token map). Each entry: a label + a
// line-matching pattern (case-insensitive). beck-tidy-first also carries a topic asserting >=1
// fowler-catalog cross-link; PRESENCE only -- link resolution is check-crossrefs's job.
const FILES = [
  {
    name: "beck-tdd-by-example.md",
    topics: [
      { label: "red-green-refactor cycle", re: /red-green-refactor/i },
      { label: "the two rules", re: /two rules/i },
      { label: "Fake It", re: /fake it/i },
      { label: "Triangulate", re: /triangulate/i },
      { label: "Obvious Implementation", re: /obvious implementation/i },
      { label: "lz-tpp seam", re: /lz-tpp/i },
    ],
  },
  {
    name: "beck-tidy-first.md",
    topics: [
      { label: "structural change", re: /structural/i },
      { label: "behavioral change", re: /behavioral/i },
      { label: "coupling", re: /coupling/i },
      { label: "cohesion", re: /cohesion/i },
      { label: "options", re: /options/i },
      { label: ">=1 fowler-catalog cross-link", re: /\]\(\.\.?\/?fowler-catalog\/[a-z0-9-]+\.md/ },
    ],
  },
  {
    name: "refactoring-without-tests.md",
    topics: [
      { label: "seams", re: /seams?/i },
      { label: "characterization test", re: /characterization test/i },
      { label: "the change algorithm", re: /change algorithm/i },
      { label: "Sprout Method/Class", re: /sprout/i },
      { label: "Wrap Method/Class", re: /wrap/i },
      { label: "Subclass and Override", re: /subclass and override/i },
      { label: "Extract Interface", re: /extract interface/i },
    ],
  },
];

// The no-oracle provenance tag every backing reference must carry (D-07).
const NO_ORACLE = /no-oracle/i;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("PRIN-01/02/03 principle-backing topic + provenance check (no-oracle)");
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

  const hasTag = lines.some((line) => NO_ORACLE.test(line));
  report(hasTag, `${spec.name}: no-oracle tag`, hasTag ? "" : "no-oracle tag absent");

  const scaffold = SCAFFOLD_RES.find((re) => re.test(text));
  report(!scaffold, `${spec.name}: no scaffold phrase`, scaffold ? `matches ${scaffold}` : "");
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: PRIN-01/02/03 backing GREEN -- ${filesPresent}/${FILES.length} references authored with core topics + no-oracle tag`);
  process.exit(0);
}

console.log(`SUMMARY: PRIN-01/02/03 backing RED -- ${filesPresent}/${FILES.length} references present, ${failures} check(s) FAILED (instrument-first RED baseline by design pre-content)`);
process.exit(1);
