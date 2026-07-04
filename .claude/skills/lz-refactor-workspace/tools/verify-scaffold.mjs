#!/usr/bin/env node
// Wave-0 scaffold checker for the lz-refactor skill (Phase 6, SC1-SC4). Throwaway, node builtins
// only, no framework. Encodes nine filesystem/frontmatter assertions against the shipped skill
// dir and exits 0 only when every check passes. Run from anywhere:
//   node .claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const SKILL_DIR = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor");
const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");
const REFERENCES = path.join(SKILL_DIR, "references");

const DESC_CAP = 1536;
const LINE_CAP = 500;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

const isDir = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

// Minimal YAML frontmatter parse: capture top-level keys and fold the description block scalar.
const parseFrontmatter = (text) => {
  const lines = text.split(/\r?\n/);

  if (lines[0].trim() !== "---") {
    return { keys: [], name: null, description: null };
  }

  let end = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      end = i;
      break;
    }
  }

  if (end === -1) {
    return { keys: [], name: null, description: null };
  }

  const block = lines.slice(1, end);
  const keys = [];
  let name = null;
  let description = null;
  const keyRe = /^([A-Za-z][A-Za-z0-9_-]*):(.*)$/;

  for (let i = 0; i < block.length; i++) {
    const m = block[i].match(keyRe);

    if (!m) {
      continue;
    }

    const key = m[1];
    const inline = m[2].trim();
    keys.push(key);

    if (key === "name") {
      name = inline;
    }

    if (key === "description") {
      if (inline === "" || inline.startsWith(">") || inline.startsWith("|")) {
        const folded = [];

        for (let j = i + 1; j < block.length; j++) {
          if (keyRe.test(block[j]) && !/^\s/.test(block[j])) {
            break;
          }

          folded.push(block[j].trim());
        }

        description = folded.filter((l) => l.length > 0).join(" ");
      } else {
        description = inline;
      }
    }
  }

  return { keys, name, description };
};

const scanNonAscii = (p) => {
  const buf = fs.readFileSync(p);

  for (let i = 0; i < buf.length; i++) {
    if (buf[i] > 0x7f) {
      return i;
    }
  }

  return -1;
};

const walkMd = (dir) => {
  const out = [];

  if (!isDir(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...walkMd(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }

  return out;
};

console.log("lz-refactor Wave-0 scaffold check");
console.log(`  skill dir: ${path.relative(repoRoot, SKILL_DIR)}`);
console.log("");

// Check 1: SKILL.md exists.
const skillExists = fs.existsSync(SKILL_MD) && fs.statSync(SKILL_MD).isFile();
report(skillExists, "SC1 SKILL.md exists", skillExists ? "" : "not found");

if (!skillExists) {
  console.log("");
  console.log("SUMMARY: 1 or more checks FAILED (SKILL.md absent -- expected RED before scaffold)");
  process.exit(1);
}

const skillText = fs.readFileSync(SKILL_MD, "utf8");
const fm = parseFrontmatter(skillText);

// Check 2: frontmatter name/description + dual-mode-by-omission.
const nameOk = fm.name === "lz-refactor";
const descPresent = typeof fm.description === "string" && fm.description.length > 0;
const dmiAbsent = !fm.keys.includes("disable-model-invocation");
const uiAbsent = !fm.keys.includes("user-invocable");
report(nameOk, "SC1 name === lz-refactor", nameOk ? "" : `got ${JSON.stringify(fm.name)}`);
report(descPresent, "SC1 description present and non-empty", descPresent ? "" : "empty/absent");
report(
  dmiAbsent && uiAbsent,
  "SC1 dual-mode by omission (disable-model-invocation + user-invocable ABSENT)",
  dmiAbsent && uiAbsent ? "" : `keys: ${fm.keys.join(", ")}`
);

// Check 3: description length within cap.
const descLen = descPresent ? fm.description.length : 0;
report(descLen <= DESC_CAP, "SC3 description length <= 1536", `${descLen} chars (target ~750)`);

// Check 4: line count under cap.
const lineCount = skillText.split(/\r?\n/).length;
report(lineCount < LINE_CAP, "SC2 SKILL.md line count < 500", `${lineCount} lines (target ~90-150)`);

// Check 5: exactly 5 distinct references/ pointers.
const pointerRe = /\]\((references\/[^)]+)\)/g;
const pointers = new Set();
let pm;

while ((pm = pointerRe.exec(skillText)) !== null) {
  pointers.add(pm[1]);
}

const pointerList = [...pointers];
report(pointerList.length === 5, "SC2 exactly 5 distinct references/ pointers", `${pointerList.length} found`);

// Check 6: every pointer resolves on disk (relative to SKILL_DIR).
let unresolved = [];

for (const rel of pointerList) {
  const target = path.join(SKILL_DIR, rel);

  if (!fs.existsSync(target)) {
    unresolved.push(rel);
  }
}

report(
  unresolved.length === 0,
  "SC2 every references/ pointer resolves on disk",
  unresolved.length === 0 ? `${pointerList.length} resolved` : `missing: ${unresolved.join(", ")}`
);

// Check 7: both catalog subdirs exist.
const fowlerDir = isDir(path.join(REFERENCES, "fowler-catalog"));
const kerievskyDir = isDir(path.join(REFERENCES, "kerievsky-catalog"));
report(
  fowlerDir && kerievskyDir,
  "SC4 catalog subdirs exist (references/fowler-catalog + references/kerievsky-catalog)",
  fowlerDir && kerievskyDir ? "" : `fowler=${fowlerDir} kerievsky=${kerievskyDir}`
);

// Check 8: description carries should-be-used + Do-not-use near-miss + lz-tpp seam.
const descLc = descPresent ? fm.description.toLowerCase() : "";
const hasShouldBeUsed = descLc.includes("should be used");
const hasDoNotUse = descLc.includes("do not use");
const hasSeam = descLc.includes("lz-tpp");
report(
  hasShouldBeUsed && hasDoNotUse && hasSeam,
  "SC3 description has should-be-used + Do-not-use + lz-tpp seam",
  `should-be-used=${hasShouldBeUsed} do-not-use=${hasDoNotUse} lz-tpp=${hasSeam}`
);

// Check 9: ASCII-only across SKILL.md and every references/*.md.
const asciiTargets = [SKILL_MD, ...walkMd(REFERENCES)];
let nonAscii = [];

for (const f of asciiTargets) {
  const at = scanNonAscii(f);

  if (at !== -1) {
    nonAscii.push(`${path.relative(repoRoot, f)}@byte${at}`);
  }
}

report(
  nonAscii.length === 0,
  "ASCII-only (SKILL.md + references/*.md)",
  nonAscii.length === 0 ? `${asciiTargets.length} files clean` : nonAscii.join(", ")
);

console.log("");

if (failures === 0) {
  console.log("SUMMARY: all checks PASSED -- scaffold is GREEN (SC1-SC4)");
  process.exit(0);
}

console.log(`SUMMARY: ${failures} check(s) FAILED -- scaffold incomplete`);
process.exit(1);
