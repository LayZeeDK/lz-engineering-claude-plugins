#!/usr/bin/env node
// Self-test for lib/package-links.mjs, the per-link core of the relative-link gate in
// check-red-references.mjs. Plain node:assert, matching this workspace's other self-tests. Each target
// goes through findLinkTargets first, so the kind classification is exercised together with the core.
// The tracked set is an in-memory fixture; no git repo or fixture tree is needed.
//   node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { findLinkTargets } from "./lib/pipe-table.mjs";
import { packageLinkProblems } from "./lib/package-links.mjs";

const README = "plugins/lz-tdd/README.md";
const LZ_RED_SKILL = "plugins/lz-tdd/skills/lz-red/SKILL.md";
const LZ_REFACTOR_SKILL = "plugins/lz-tdd/skills/lz-refactor/SKILL.md";
const TRACKED = new Set([README, LZ_RED_SKILL, LZ_REFACTOR_SKILL]);

const targetOf = (raw) => findLinkTargets(`[p](${raw})`)[0];
const problemsOf = (raw, sourceRel, tracked = TRACKED) => packageLinkProblems(targetOf(raw), sourceRel, tracked);

const shapeOf = (problems) => ({
  count: problems.length,
  dead: problems.some((problem) => problem.includes("dead")),
  leavesPackage: problems.some((problem) => problem.includes("LEAVES PACKAGE")),
});

// Every node:fs entry point the core could reach, replaced by a recorder that never touches the real
// filesystem. A UNC target must not reach the network even in a run against a core that still calls fs.
const FS_ENTRY_POINTS = ["existsSync", "statSync", "lstatSync", "realpathSync", "accessSync", "readdirSync", "readFileSync"];

const withFsRecorder = (run) => {
  const saved = {};
  const calls = [];

  for (const name of FS_ENTRY_POINTS) {
    saved[name] = fs[name];
    fs[name] = (...args) => {
      calls.push(`${name}(${String(args[0])})`);

      if (name === "existsSync") {
        return false;
      }

      throw Object.assign(new Error(`ENOENT: recorder, ${name}`), { code: "ENOENT" });
    };
  }

  try {
    return { result: run(), fsCalls: calls };
  } finally {
    for (const name of FS_ENTRY_POINTS) {
      fs[name] = saved[name];
    }
  }
};

let failures = 0;
let checks = 0;

const check = (label, actual, expected) => {
  checks++;

  try {
    assert.deepEqual(actual, expected);
    console.log(`  [PASS] ${label}`);
  } catch (err) {
    failures++;
    console.log(`  [FAIL] ${label} -- expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}: ${err.message.split("\n")[0]}`);
  }
};

const leavesWithoutFs = (label, raw) => {
  const { result, fsCalls } = withFsRecorder(() => shapeOf(problemsOf(raw, README)));
  check(label, { leavesPackage: result.leavesPackage, fsCalls }, { leavesPackage: true, fsCalls: [] });
};

console.log("package-links self-test (relative-link gate core)");
console.log("");

check("floor: in-package link to a tracked file -> fine", problemsOf("skills/lz-red/SKILL.md", README), []);
check("floor: file-plus-fragment link to a tracked file -> fine", problemsOf("skills/lz-red/SKILL.md#x", README), []);
check("floor: in-package `..` link to a tracked file -> fine", problemsOf("../lz-refactor/SKILL.md", LZ_RED_SKILL), []);
check(
  "floor: target neither on disk nor tracked -> one dead problem",
  shapeOf(problemsOf("skills/lz-red/no-such-file.md", README)),
  { count: 1, dead: true, leavesPackage: false }
);
check("floor: `../../README.md` escapes the package -> LEAVES PACKAGE", shapeOf(problemsOf("../../README.md", README)).leavesPackage, true);
check("floor: `..\\..\\README.md` escapes the package -> LEAVES PACKAGE", shapeOf(problemsOf("..\\..\\README.md", README)).leavesPackage, true);

check(
  "F1: target on disk but not in the tracked set -> one dead problem",
  shapeOf(problemsOf("skills/lz-red/SKILL.md", README, new Set([README]))),
  { count: 1, dead: true, leavesPackage: false }
);

check(
  "F4: target differing only in letter case from a tracked file -> one dead problem",
  shapeOf(problemsOf("SKILLS/LZ-RED/SKILL.md", README)),
  { count: 1, dead: true, leavesPackage: false }
);

leavesWithoutFs("F2: UNC target -> LEAVES PACKAGE with zero fs calls", "\\\\127.0.0.1\\lzjfm-probe\\x.md");
leavesWithoutFs("F2: relative escape -> LEAVES PACKAGE with zero fs calls", "../../README.md");
leavesWithoutFs("F2: root-absolute target -> LEAVES PACKAGE with zero fs calls", "/etc/x.md");

for (const raw of ["C:/Windows/win.ini", "C:\\x.md", "c:..\\..\\README.md"]) {
  check(`F3: drive-letter target \`${raw}\` classifies absolute`, targetOf(raw).kind, "absolute");
  leavesWithoutFs(`F3: drive-letter target \`${raw}\` -> LEAVES PACKAGE with zero fs calls`, raw);
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: package-links self-test GREEN -- ${checks}/${checks} assertions pass`);
  process.exit(0);
}

console.log(`SUMMARY: package-links self-test RED -- ${failures} of ${checks} assertion(s) FAILED`);
process.exit(1);
