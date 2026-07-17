#!/usr/bin/env node
// FWL-03 principles checker. Asserts each Fowler Ch.2 topic token appears on its own line in
// principles.md (line-oriented so a soft-wrapped token cannot false-negative -- Phase 2/3
// lesson): definition, two hats, rule of three, preparatory, comprehension, litter-pickup,
// performance, YAGNI. Throwaway; node builtins only; mirrors verify-scaffold.mjs.
// RED against the empty principles.md stub by design -- proves the checker works before content.
//   node .claude/skills/lz-refactor-workspace/tools/check-principles.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const PRINCIPLES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "principles.md");

// Ch.2 topic set (D-05). Each entry: a label + a line-matching pattern (case-insensitive).
const TOPICS = [
  { label: "definition of refactoring", re: /\bdefinition\b/i },
  { label: "two hats", re: /\btwo hats\b/i },
  { label: "rule of three", re: /\brule of three\b/i },
  { label: "preparatory refactoring", re: /\bpreparatory\b/i },
  { label: "comprehension refactoring", re: /\bcomprehension\b/i },
  { label: "litter-pickup refactoring", re: /\blitter[-\s]pickup\b/i },
  { label: "performance", re: /\bperformance\b/i },
  { label: "YAGNI", re: /\byagni\b/i },
];

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("FWL-03 Fowler Ch.2 principles topic check");
console.log(`  principles file: ${path.relative(repoRoot, PRINCIPLES)}`);
console.log("");

if (!fs.existsSync(PRINCIPLES)) {
  report(false, "principles.md exists", "not found");
  console.log("");
  console.log("SUMMARY: FWL-03 RED -- principles.md absent");
  process.exit(1);
}

const lines = fs.readFileSync(PRINCIPLES, "utf8").split(/\r?\n/);
let present = 0;

for (const topic of TOPICS) {
  const hit = lines.some((line) => topic.re.test(line));

  if (hit) {
    present++;
  }

  report(hit, topic.label, hit ? "" : "topic token absent");
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: FWL-03 GREEN -- ${present}/${TOPICS.length} Ch.2 topics present`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-03 RED -- ${present}/${TOPICS.length} Ch.2 topics present, ${failures} absent`);
process.exit(1);
