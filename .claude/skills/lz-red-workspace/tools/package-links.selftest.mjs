#!/usr/bin/env node
// Self-test for lib/package-links.mjs, the per-link core of the relative-link gate in
// check-red-references.mjs. Plain node:assert, matching this workspace's other self-tests. Each target
// goes through findLinkTargets first, so the kind classification is exercised together with the core.
// The core cases use an in-memory tracked set; the tracked-set builder runs against a throwaway git repo
// in the OS temp folder, deleted afterwards.
//   node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs, { existsSync } from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import os from "node:os";
import path from "node:path";
import { findLinkTargets } from "./lib/pipe-table.mjs";
import * as pipeTable from "./lib/pipe-table.mjs";
import * as packageLinks from "./lib/package-links.mjs";

const { packageLinkProblems } = packageLinks;

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

  // Propagates the patched default-export properties to every `import { name } from "node:fs"` binding.
  syncBuiltinESMExports();

  try {
    return { result: run(), fsCalls: calls };
  } finally {
    for (const name of FS_ENTRY_POINTS) {
      fs[name] = saved[name];
    }

    syncBuiltinESMExports();
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

// Reports a throw as a value, so a missing export fails its own checks instead of ending the run.
const attempt = (run) => {
  try {
    return run();
  } catch (err) {
    return `threw: ${err.message.split("\n")[0]}`;
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

// The installed package root is not named after the plugin, so a `..` that climbs above the root and
// comes back in through its folder name is broken in the package even though it normalises inside.
check("H1: `../lz-tdd/...` re-enters through the plugin folder name -> LEAVES PACKAGE", shapeOf(problemsOf("../lz-tdd/skills/lz-red/SKILL.md", README)).leavesPackage, true);
check("H1: `../../plugins/lz-tdd/README.md` re-enters from the repo root -> LEAVES PACKAGE", shapeOf(problemsOf("../../plugins/lz-tdd/README.md", README)).leavesPackage, true);
check("H1: `../../../lz-tdd/README.md` from a nested file re-enters -> LEAVES PACKAGE", shapeOf(problemsOf("../../../lz-tdd/README.md", LZ_RED_SKILL)).leavesPackage, true);

check(
  "M1: backslash-separated in-package target -> one backslash problem",
  ((problems) => ({ count: problems.length, backslash: problems.some((problem) => problem.includes("backslash")) }))(problemsOf("skills\\lz-red\\SKILL.md", README)),
  { count: 1, backslash: true }
);

check("M3: directory link with a trailing slash -> fine", problemsOf("skills/lz-red/", README), []);
check("M3: directory link without a trailing slash -> fine", problemsOf("skills", README), []);
check("M3: `.` names the plugin root -> fine", problemsOf(".", README), []);
check("M3: directory that holds no tracked file -> one dead problem", shapeOf(problemsOf("skills/no-such-dir/", README)), { count: 1, dead: true, leavesPackage: false });
check("M3: a name that is only a prefix of a tracked directory -> one dead problem", shapeOf(problemsOf("skills/lz-re", README)), { count: 1, dead: true, leavesPackage: false });

// On a POSIX install a path through a file or a missing directory fails with ENOTDIR or ENOENT, even
// when `..` would cancel the segment lexically.
check("K1: trailing slash after a tracked file -> one dead problem", shapeOf(problemsOf("README.md/", README)), { count: 1, dead: true, leavesPackage: false });
check("K2: trailing slash after a nested tracked file -> one dead problem", shapeOf(problemsOf("skills/lz-red/SKILL.md/", README)), { count: 1, dead: true, leavesPackage: false });
check("K3: `..` out of a missing directory -> one dead problem", shapeOf(problemsOf("no-such-dir/..", README)), { count: 1, dead: true, leavesPackage: false });
check("K4: a path through a missing directory -> one dead problem", shapeOf(problemsOf("no-such-dir/../skills/lz-red/SKILL.md", README)), { count: 1, dead: true, leavesPackage: false });
check("K5: a path through a file used as a directory -> one dead problem", shapeOf(problemsOf("skills/lz-red/SKILL.md/../SKILL.md", README)), { count: 1, dead: true, leavesPackage: false });
check("K6: `..` out of a tracked directory -> fine", problemsOf("skills/lz-red/../lz-refactor/SKILL.md", README), []);

// Link forms findLinkTargets does not extract must be reported, so the gate fails on them instead of
// passing them unchecked.
const unsupported = (text) => attempt(() => pipeTable.findUnsupportedLinkForms(text));
const formsOf = (text) => ((found) => (Array.isArray(found) ? found.map(({ form }) => form) : found))(unsupported(text));

const referenceLine = "[r]: skills/lz-red/SKILL.md";
const angleLine = "see [p](<skills/lz-red/SKILL.md>)";
const singleQuoteLine = "see [p](skills/lz-red/SKILL.md 'title')";
const hrefLine = '<a href="skills/lz-red/SKILL.md">p</a>';
const srcLine = '<img src="x.png">';
const unsupportedLines = [referenceLine, angleLine, singleQuoteLine, hrefLine, srcLine];

check("U1: reference-style definition -> reported", formsOf(referenceLine), ["reference-style definition"]);
check("U2: angle-bracket destination -> reported", formsOf(angleLine), ["angle-bracket destination"]);
check("U3: single-quoted link title -> reported", formsOf(singleQuoteLine), ["single-quoted link title"]);
check("U4: HTML href attribute -> reported", formsOf(hrefLine), ["HTML href/src attribute"]);
check("U5: HTML src attribute -> reported", formsOf(srcLine), ["HTML href/src attribute"]);
check(
  "U6: every unsupported form inside a backtick fence and a tilde fence -> nothing reported",
  unsupported(["```", ...unsupportedLines, "```", "~~~", ...unsupportedLines, "~~~"].join("\n")),
  []
);
check(
  "U7: double-quoted title, scheme and anchor links -> nothing reported",
  unsupported('[p](skills/lz-red/SKILL.md "title") and [q](https://example.com) and [r](#anchor)'),
  []
);
check(
  "U8: a form on line 2 -> reported at line 2",
  attempt(() => pipeTable.findUnsupportedLinkForms(`intro\n${referenceLine}`).map(({ line }) => line)),
  [2]
);

// A fence closes only on the opener's character, a run at least as long, and nothing else on the line;
// a tab indent is indented code, not a fence. Either mistake hides every later link.
const rawTargetsOf = (text) => findLinkTargets(text).map(({ raw }) => raw);

check("X1: a link after a 4-backtick fence holding a 3-backtick line -> extracted", rawTargetsOf("````md\n```\n````\n[a](dead.md)"), ["dead.md"]);
check("X2: a link after the inner 3-backtick line, inside the 4-backtick fence -> not extracted", rawTargetsOf("````md\n```\n[a](dead.md)\n````"), []);
check("X3: a tab-indented backtick run is not a fence -> the link after it is extracted", rawTargetsOf("\t```\n[a](dead.md)"), ["dead.md"]);

// Any `](` the extractor did not consume is a link nobody resolves.
check("X4: nested brackets in link text -> unparsed link", formsOf("[a [b] c](dead.md)"), ["unparsed link"]);
check("X5: escaped bracket in link text -> unparsed link", formsOf("[a\\]b](dead.md)"), ["unparsed link"]);
check("X6: parenthesised link title -> unparsed link", formsOf("[a](dead.md (t))"), ["unparsed link"]);
check(
  "X7: link text broken across lines -> unparsed link on the second line",
  attempt(() => pipeTable.findUnsupportedLinkForms("[a\nb](dead.md)")),
  [{ line: 2, form: "unparsed link" }]
);
check("X12: a closing run with trailing text does not close the fence", rawTargetsOf("```\nx\n``` foo\n[a](dead.md)\n```\n[b](dead2.md)"), ["dead2.md"]);

// A fence still open at the end of the file hides every later link, so it is reported at its opener.
check("Y1: a fence opened on a list-marker line -> unterminated fence at the indented closer", unsupported("- ```js\n  x\n  ```\n\n[a](dead.md)"), [{ line: 3, form: "unterminated fence" }]);
check("Y2: a fence opened on an ordered-list line -> unterminated fence at the indented closer", unsupported("1. ```\n   code\n   ```\n[a](dead.md)"), [{ line: 3, form: "unterminated fence" }]);
check("Y3: a fence inside a list item left open -> unterminated fence at its opener", unsupported("- item\n  ```\n  x\n\npara\n[a](dead.md)"), [{ line: 2, form: "unterminated fence" }]);

// A backtick run whose info string holds a backtick is not a fence opener.
check("Y4: backtick info string holding a backtick -> the link after it is extracted", rawTargetsOf("```a`b\n[a](dead.md)"), ["dead.md"]);
check("Y5: backtick info string holding a backtick, then a fence line -> the link between is extracted", rawTargetsOf("```a`b\n[a](dead.md)\n```"), ["dead.md"]);

check("X9: reference definition indented three spaces -> reported", formsOf("   [r]: skills/lz-red/SKILL.md"), ["reference-style definition"]);
check("X10: uppercase HREF attribute -> reported", formsOf('<a HREF="skills/lz-red/SKILL.md">p</a>'), ["HTML href/src attribute"]);

for (const raw of ["file:///C:/x.md", "file:../../README.md"]) {
  check(`L2: \`${raw}\` classifies absolute`, targetOf(raw).kind, "absolute");
  leavesWithoutFs(`L2: \`${raw}\` -> LEAVES PACKAGE with zero fs calls`, raw);
}

// A core that switched to `import { existsSync } from "node:fs"` keeps its own binding, so the recorder
// must reach named imports too, or the zero-fs-calls cases above could pass while the core touches disk.
check(
  "L1: the fs recorder records a call made through a named import",
  withFsRecorder(() => existsSync("lzjfm-recorder-probe.md")).fsCalls,
  ["existsSync(lzjfm-recorder-probe.md)"]
);

// The gate reads exactly the tracked `.md` files, reports a dead link and an unsupported form as hits,
// and counts only the targets it resolved.
const gateTexts = { "plugins/p/a.md": "[ok](b.md)\n[gone](nope.md)\n", "plugins/p/b.md": "[r]: a.md\n" };
const gateTracked = new Set(["plugins/p/a.md", "plugins/p/b.md", "plugins/p/plugin.json"]);

check(
  "W1: packageLinkGate reads only the tracked .md files and reports a dead link and an unsupported form",
  attempt(() => {
    const reads = [];
    const { hits, resolved } = packageLinks.packageLinkGate(gateTracked, (rel) => {
      reads.push(rel);

      return gateTexts[rel];
    });

    return { reads, resolved, hits };
  }),
  {
    reads: ["plugins/p/a.md", "plugins/p/b.md"],
    resolved: 2,
    hits: [
      "plugins/p/a.md:2 -> nope.md dead (target is not in the package)",
      "plugins/p/b.md:1 -> unsupported link form (reference-style definition), not checked",
    ],
  }
);

check(
  "W3: an unreadable tracked file is one hit and the gate continues",
  attempt(() =>
    packageLinks.packageLinkGate(new Set(["plugins/p/a.md", "plugins/p/b.md"]), (rel) => {
      if (rel === "plugins/p/a.md") {
        throw Object.assign(new Error("EACCES: denied"), { code: "EACCES" });
      }

      return "[ok](a.md)\n";
    })
  ),
  { hits: ["plugins/p/a.md: UNREADABLE (EACCES)"], resolved: 1 }
);

check(
  "X8: tracked `.MD` and `.markdown` files are read and their dead links reported",
  attempt(() => packageLinks.packageLinkGate(new Set(["plugins/p/Docs.MD", "plugins/p/n.markdown"]), () => "[a](dead.md)\n").hits),
  ["plugins/p/Docs.MD:1 -> dead.md dead (target is not in the package)", "plugins/p/n.markdown:1 -> dead.md dead (target is not in the package)"]
);

check(
  "X11: a Markdown file directly under plugins/ -> one hit naming the file",
  attempt(() => packageLinks.packageLinkGate(new Set(["plugins/README.md", "plugins/p/a.md"]), () => "[a](a.md)\n").hits),
  ["plugins/README.md: NOT IN A PLUGIN (a file directly under plugins/ ships in no package)"]
);

// The disk walk skips symlinked files, so a tracked symlink is found from the index modes instead.
const objectId = "a".repeat(40);
const lsRecord = (mode, rel) => `${mode} ${objectId} 0\t${rel}\0`;
const symlinksOf = (listing) => attempt(() => packageLinks.symlinkEntries(listing));

check(
  "T1: symlinkEntries returns the one mode-120000 path among regular files",
  symlinksOf(lsRecord("100644", "plugins/p/a.md") + lsRecord("120000", "plugins/p/link.md") + lsRecord("100644", "plugins/p/b.md")),
  ["plugins/p/link.md"]
);
check("T2: symlinkEntries over regular and executable files -> none", symlinksOf(lsRecord("100644", "plugins/p/a.md") + lsRecord("100755", "plugins/p/run.sh")), []);
check("T3: a symlink path with a space and a non-ASCII name comes back verbatim", symlinksOf(lsRecord("120000", "plugins/p/spaced ø.md")), ["plugins/p/spaced ø.md"]);
check("T4: an empty listing -> none", symlinksOf(""), []);
check("T5: a record with no tab -> throws malformed", String(symlinksOf("120000 x\0")).startsWith("threw: malformed git ls-files -s record"), true);

// The tracked-set builder, against a real git repo: only the git-tracked files under plugins/ belong to
// the package, and a non-ASCII name comes back unquoted.
let trackedActual;
let gateReadsActual;
let symlinksActual;
let symlinksFailClosed;
const scratchRepo = fs.mkdtempSync(path.join(os.tmpdir(), "lzjfm-tracked-"));

try {
  const git = (...args) => execFileSync("git", args, { cwd: scratchRepo, stdio: "pipe" });
  const pluginDir = path.join(scratchRepo, "plugins", "p");
  git("init", "-q");
  fs.mkdirSync(pluginDir, { recursive: true });
  fs.writeFileSync(path.join(scratchRepo, ".gitignore"), "plugins/p/ignored.md\n");

  for (const name of ["tracked.md", "spaced \u00f8.md", "untracked.md", "ignored.md"]) {
    fs.writeFileSync(path.join(pluginDir, name), "x\n");
  }

  git("add", "--", ".gitignore", "plugins/p/tracked.md", "plugins/p/spaced \u00f8.md");
  trackedActual = [...packageLinks.trackedFiles(scratchRepo)].sort();

  // A symlink index entry, staged without a filesystem symlink, so no Windows privilege is needed.
  gateReadsActual = attempt(() => {
    const blob = execFileSync("git", ["hash-object", "-w", "--stdin"], { cwd: scratchRepo, input: "tracked.md", encoding: "utf8" }).trim();
    git("update-index", "--add", "--cacheinfo", `120000,${blob},plugins/p/linked.md`);
    const reads = [];
    packageLinks.packageLinkGate(packageLinks.trackedFiles(scratchRepo), (rel) => {
      reads.push(rel);

      return "";
    });

    return reads;
  });

  symlinksActual = attempt(() => packageLinks.trackedSymlinks(scratchRepo));
  symlinksFailClosed =
    typeof packageLinks.trackedSymlinks === "function" &&
    String(attempt(() => packageLinks.trackedSymlinks(path.join(scratchRepo, "no-such-dir")))).startsWith("threw:");
} catch (err) {
  trackedActual = `threw: ${err.message.split("\n")[0]}`;
} finally {
  fs.rmSync(scratchRepo, { recursive: true, force: true });
}

check(
  "M2: trackedFiles lists only the git-tracked files under plugins/, non-ASCII names unquoted",
  trackedActual,
  ["plugins/p/spaced \u00f8.md", "plugins/p/tracked.md"]
);

check(
  "W2: packageLinkGate over trackedFiles reads a tracked symlink and skips untracked and ignored files",
  gateReadsActual,
  ["plugins/p/linked.md", "plugins/p/spaced \u00f8.md", "plugins/p/tracked.md"]
);

check("T6: trackedSymlinks finds the staged mode-120000 entry in a real repo", symlinksActual, ["plugins/p/linked.md"]);
check("T7: trackedSymlinks throws when git fails, so the caller fails closed", symlinksFailClosed, true);

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: package-links self-test GREEN -- ${checks}/${checks} assertions pass`);
  process.exit(0);
}

console.log(`SUMMARY: package-links self-test RED -- ${failures} of ${checks} assertion(s) FAILED`);
process.exit(1);
