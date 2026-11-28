#!/usr/bin/env node
// RED-SAMPLES compile harness. Walks the FLAT lz-red references tree (plus the testing-stance/
// subdir stubs, which carry zero ts fences in Phase 16), extracts every fenced `ts` block into its
// OWN module under samples/ (one module per fence so snippets that reuse the same symbol names never
// collide), then runs tsc --strict --noEmit.
// Fences whose info string carries "ignore" (e.g. ```ts ignore) are skipped and counted.
// Node builtins only; the sole compile dependency is the pinned `typescript` (global tsc 6.0.3 also
// works via PATH), plus a local `vitest` devDep so bundler resolution finds the vitest types the
// example fences import. Throwaway checker idiom. Run from anywhere:
//   node .claude/skills/lz-red-workspace/extract-samples.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
// lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..");
// lz-red references are FLAT files directly under one dir (no catalog subdirs). walkMd recurses,
// so this single root covers the flat refs plus the testing-stance/ subdir stubs.
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");
// The SKILL.md coach procedure carries the VIT-02 worked example. SKILL.md sits at the skill root
// (parent of references/), so walkMd(REFERENCES) never reaches it; prepend it to the walk. Its
// basename is "SKILL" (not "readme"), so it passes the README-skip guard; a ts fence extracts as
// SKILL-1.ts. Today SKILL.md carries no ts fence, so the extractor stays GREEN-on-empty.
const SKILL_MD = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "SKILL.md");
const SAMPLES = path.join(here, "samples");

const isDir = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
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

// Split a Markdown source into its fenced code blocks. Each fence is {lang, rest, code}
// where `lang` is the first info-string token (lowercased) and `rest` the remaining tokens.
const extractFences = (text) => {
  const lines = text.split(/\r?\n/);
  const fences = [];
  let open = null;
  let body = [];

  for (const line of lines) {
    // CommonMark allows a fence marker to be indented up to 3 spaces (open and close alike).
    const m = line.match(/^\s{0,3}```(.*)$/);

    if (m) {
      if (open === null) {
        const info = m[1].trim();
        const tokens = info.length ? info.split(/\s+/) : [];
        open = { lang: (tokens[0] || "").toLowerCase(), rest: tokens.slice(1).map((t) => t.toLowerCase()) };
        body = [];
      } else {
        fences.push({ lang: open.lang, rest: open.rest, code: body.join("\n") });
        open = null;
        body = [];
      }

      continue;
    }

    if (open !== null) {
      body.push(line);
    }
  }

  // WR-01: a fence opened but never closed (EOF with open !== null) would otherwise be
  // silently dropped -- shrinking compile coverage instead of failing. Surface it so the
  // caller can fail loudly rather than let a malformed example pass as green.
  return { fences, unterminated: open !== null };
};

// Fresh samples dir each run so a deleted fence never leaves a stale module behind.
if (isDir(SAMPLES)) {
  fs.rmSync(SAMPLES, { recursive: true, force: true });
}

fs.mkdirSync(SAMPLES, { recursive: true });

let extracted = 0;
let skipped = 0;
const written = [];

for (const file of [SKILL_MD, ...walkMd(REFERENCES)]) {
  const leaf = path.basename(file, ".md");

  if (leaf.toLowerCase() === "readme") {
    continue;
  }

  const { fences, unterminated } = extractFences(fs.readFileSync(file, "utf8"));

  if (unterminated) {
    console.log(`SUMMARY: RED-SAMPLES RED -- unterminated code fence in ${path.relative(repoRoot, file)}`);
    process.exit(1);
  }

  let n = 0;

  for (const f of fences) {
    if (f.lang !== "ts" && f.lang !== "typescript") {
      continue;
    }

    if (f.rest.includes("ignore")) {
      skipped++;
      continue;
    }

    n++;
    let code = f.code;

    // Force module scope so top-level declarations do not leak into the global namespace
    // and collide with a sibling fence's identically named symbols. A fence that already
    // imports (e.g. from 'vitest') is a module and is left untouched.
    if (!/^\s*(import|export)\b/m.test(code)) {
      code = `${code}\n\nexport {};\n`;
    }

    const outName = `${leaf}-${n}.ts`;
    fs.writeFileSync(path.join(SAMPLES, outName), code, "utf8");
    written.push(outName);
    extracted++;
  }
}

console.log(`extract-samples: ${extracted} module(s) extracted, ${skipped} fence(s) skipped (ts ignore)`);

if (extracted === 0) {
  // ponytail: `tsc -p` errors ("No inputs were found") on an empty include set, so an empty
  // ref set would false-RED. Nothing to compile == vacuously strict-clean; report GREEN.
  console.log("SUMMARY: RED-SAMPLES GREEN -- 0 modules to compile (empty-refs baseline)");
  process.exit(0);
}

const result = spawnSync("tsc", ["--strict", "--noEmit", "-p", "tsconfig.json"], {
  cwd: here,
  stdio: "inherit",
  shell: true,
});

if (result.status === 0) {
  console.log(`SUMMARY: RED-SAMPLES GREEN -- ${extracted} module(s) tsc --strict --noEmit clean, ${skipped} skipped`);
  process.exit(0);
}

console.log(`SUMMARY: RED-SAMPLES RED -- tsc --strict --noEmit failed over ${extracted} module(s)`);
process.exit(1);
