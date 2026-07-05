#!/usr/bin/env node
// FWL-04 / KRV-01 compile harness. Walks BOTH the Fowler and Kerievsky catalog leaves (incl. any
// *-walkthrough.md overflow companions), extracts every fenced `ts` block into its OWN module under
// samples/ (one module per fence so before/after snippets that reuse the same symbol names never
// collide), then runs tsc --strict --noEmit.
// Fences whose info string carries "ignore" (e.g. ```ts ignore) are skipped and counted.
// Node builtins only; the sole dependency is the pinned `typescript` (global tsc 6.0.3 also
// works via PATH). Throwaway checker idiom, mirrors tools/verify-scaffold.mjs. Run from anywhere:
//   node .claude/skills/lz-refactor-workspace/extract-samples.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = path.dirname(fileURLToPath(import.meta.url));
// lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
// Walk BOTH catalogs; namespace sample filenames by catalog so a Kerievsky slug cannot silently
// overwrite a Fowler sample module (false green). walkMd's .md filter also picks up *-walkthrough.md.
const CATALOGS = [
  { dir: path.join(REFERENCES, "fowler-catalog"), prefix: "fowler" },
  { dir: path.join(REFERENCES, "kerievsky-catalog"), prefix: "kerievsky" },
];
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
    const m = line.match(/^```(.*)$/);

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

  return fences;
};

// Fresh samples dir each run so a deleted fence never leaves a stale module behind.
if (isDir(SAMPLES)) {
  fs.rmSync(SAMPLES, { recursive: true, force: true });
}

fs.mkdirSync(SAMPLES, { recursive: true });

let extracted = 0;
let skipped = 0;
const written = [];

for (const { dir, prefix } of CATALOGS) {
  for (const file of walkMd(dir)) {
    const leaf = path.basename(file, ".md");

    if (leaf.toLowerCase() === "readme") {
      continue;
    }

    const fences = extractFences(fs.readFileSync(file, "utf8"));
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
      // and collide with a sibling fence's identically named symbols.
      if (!/^\s*(import|export)\b/m.test(code)) {
        code = `${code}\n\nexport {};\n`;
      }

      // Namespace by catalog so a Kerievsky slug never overwrites a Fowler sample module.
      const outName = `${prefix}-${leaf}-${n}.ts`;
      fs.writeFileSync(path.join(SAMPLES, outName), code, "utf8");
      written.push(outName);
      extracted++;
    }
  }
}

console.log(`extract-samples: ${extracted} module(s) extracted, ${skipped} fence(s) skipped (ts ignore)`);

if (extracted === 0) {
  // ponytail: `tsc -p` errors ("No inputs were found") on an empty include set, so an empty
  // catalog would false-RED. Nothing to compile == vacuously strict-clean; report GREEN.
  console.log("SUMMARY: FWL-04 GREEN -- 0 modules to compile (empty-catalog baseline)");
  process.exit(0);
}

const result = spawnSync("tsc", ["--strict", "--noEmit", "-p", "tsconfig.json"], {
  cwd: here,
  stdio: "inherit",
  shell: true,
});

if (result.status === 0) {
  console.log(`SUMMARY: FWL-04 GREEN -- ${extracted} module(s) tsc --strict --noEmit clean, ${skipped} skipped`);
  process.exit(0);
}

console.log(`SUMMARY: FWL-04 RED -- tsc --strict --noEmit failed over ${extracted} module(s)`);
process.exit(1);
