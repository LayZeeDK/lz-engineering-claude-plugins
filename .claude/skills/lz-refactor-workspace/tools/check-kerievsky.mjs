#!/usr/bin/env node
// KRV-01/02/04 completeness + per-Kerievsky-leaf contract checker (27-scope, name-identity model).
// A sibling of check-catalog.mjs: the Fowler 62-checker stays untouched. The catalog is one leaf
// file per pattern-directed refactoring under kerievsky-catalog/<slug>.md (README.md is the index,
// not a leaf). Asserts:
//   - each of the 27 canonical Kerievsky names is present EXACTLY once as a leaf's level-1 heading
//     (identity, not just cardinality -- closes the WR-02 gap), no dupes, no unknown/typo heading;
//   - each leaf file name is the kebab-case slug of its heading name (deterministic cross-link target);
//   - each leaf carries the LOCKED Fowler contract fields: a one-line `Use when:` selector, a
//     `## Motivation` section, a `## Mechanics` section, and a `## Example` section with >=1 ts/js fence;
//   - PLUS the three Kerievsky field labels (token-lockstep with the leaf template, Pitfall 4):
//       Direction:                    value in {To, To/Towards, Towards, Away, n/a} (KRV-02); the
//                                     compound `To/Towards` (the 6 both-listed refactorings) and the
//                                     `n/a` sentinel (the 4 table-absent utilities) come from the
//                                     book's authoritative Refactoring Directions table (08-06)
//       GoF pattern:                  linkify gate (D-08/D-11): a GoF-23 name links to
//                                     ../gof-catalog/<slug>.md#<slug>; an extra-5 name links to
//                                     ../extra-patterns-catalog/<slug>.md#<slug>; a token in neither
//                                     set (n/a -- utility, Class / type-safe value) stays free text.
//                                     Exact-name set lookup, never substring (Factory vs Factory
//                                     Method, Pitfall 1). RED on ~23 un-linkified tokens pre-Wave-3.
//       Composed Fowler primitive(s): >=1 link matching ../fowler-catalog/<slug>.md#<slug> (KRV-01,
//                                     PRESENCE only -- link RESOLUTION is check-crossrefs's job);
//   - the 3 named de-patterning (Away) cases (Inline Singleton, Move Accumulation to Visitor,
//     Encapsulate Composite with Builder) are present AND carry Direction: Away plus an
//     "away from <pattern>" callout in the leaf body (KRV-02, D-03);
//   - no draft-scaffolding phrases leak into a leaf (uppercase TODO / "once it exists" / etc.);
//   - each leaf's `Use when:` line is mirrored verbatim into its README index row.
// check-hygiene already guards no-verbatim GoF/Kerievsky text + ASCII-only (DST-04). Throwaway; node
// builtins only; mirrors check-catalog.mjs. RED against the empty kerievsky-catalog by design (0/27)
// -- that is the expected Wave-1 baseline, not a failure.
//   node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CATALOG = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references", "kerievsky-catalog");
const README = path.join(CATALOG, "README.md");

// The 27 canonical Kerievsky pattern-directed refactoring names (public facts, industriallogic.com
// catalog), grouped by the book's six catalog chapters. Chapter counts: 6 + 6 + 7 + 3 + 2 + 3 = 27.
// The authoring waves oracle-confirm exact wording; 08-06 Task 2 reconciles any oracle correction
// into this array in lockstep with the authored leaf H1 slugs (the sole authorized post-wave-1 edit).
const NAMES = [
  // Ch.6 Creation (6)
  "Replace Constructors with Creation Methods",
  "Move Creation Knowledge to Factory",
  "Encapsulate Classes with Factory",
  "Introduce Polymorphic Creation with Factory Method",
  "Encapsulate Composite with Builder",
  "Inline Singleton",
  // Ch.7 Simplification (6)
  "Compose Method",
  "Replace Conditional Logic with Strategy",
  "Move Embellishment to Decorator",
  "Replace State-Altering Conditionals with State",
  "Replace Implicit Tree with Composite",
  "Replace Conditional Dispatcher with Command",
  // Ch.8 Generalization (7)
  "Form Template Method",
  "Extract Composite",
  "Replace One/Many Distinctions with Composite",
  "Replace Hard-Coded Notifications with Observer",
  "Unify Interfaces with Adapter",
  "Extract Adapter",
  "Replace Implicit Language with Interpreter",
  // Ch.9 Protection (3)
  "Replace Type Code with Class",
  "Limit Instantiation with Singleton",
  "Introduce Null Object",
  // Ch.10 Accumulation (2)
  "Move Accumulation to Collecting Parameter",
  "Move Accumulation to Visitor",
  // Ch.11 Utilities (3)
  "Chain Constructors",
  "Unify Interfaces",
  "Extract Parameter",
];

const EXPECTED = 27;

// The 3 named de-patterning cases (D-03): present AND flagged Direction: Away + an "away from
// <pattern>" callout in the body. Modeled on check-catalog.mjs's WEB_ONLY membership pattern.
const AWAY = new Set([
  "Inline Singleton",
  "Move Accumulation to Visitor",
  "Encapsulate Composite with Builder",
]);

// The GoF pattern: linkify gate (D-08/D-11). Every leaf's `GoF pattern:` token is one of three
// outcomes: a GoF-23 name MUST link to ../gof-catalog/<slug>.md#<slug>; an extra-5 name MUST link to
// ../extra-patterns-catalog/<slug>.md#<slug>; a token in NEITHER set (the `n/a -- utility` sentinels +
// `Class / type-safe value`) MUST carry NO gof/extra link (free text). Membership is EXACT-name set
// lookup, NEVER substring -- so `Factory` (extra) maps to extra-patterns-catalog/factory.md and is
// never confused with `Factory Method` (gof-catalog/factory-method.md), Pitfall 1. Pre-Wave-3 the 23
// pattern tokens are plain names with no link -> 23 FAILs (the EXPECTED instrument-first RED baseline);
// the 4 free-text tokens PASS. RESOLUTION of the link target is check-crossrefs's job.
const GOF23 = new Set([
  // Creational (5)
  "Abstract Factory",
  "Builder",
  "Factory Method",
  "Prototype",
  "Singleton",
  // Structural (7)
  "Adapter",
  "Bridge",
  "Composite",
  "Decorator",
  "Facade",
  "Flyweight",
  "Proxy",
  // Behavioral (11)
  "Chain of Responsibility",
  "Command",
  "Interpreter",
  "Iterator",
  "Mediator",
  "Memento",
  "Observer",
  "State",
  "Strategy",
  "Template Method",
  "Visitor",
]);

const EXTRA5 = new Set([
  "Null Object",
  "Factory",
  "Creation Method",
  "Composed Method",
  "Collecting Parameter",
]);

// Draft-scaffolding phrases that must never leak into a shipped leaf. Uppercase TODO only (so a
// `todos` domain example never false-fails); the rest are unambiguous draft markers.
const SCAFFOLD_RES = [/\bTODO\b/, /once it exists/i, /to be authored/i, /\bplaceholder\b/i, /\bTBD\b/];

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

// kebab-case slug of a canonical name (deterministic cross-link target).
const slugFor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

// Collect every leaf: { name, tag, file, base, text }. A leaf is a kerievsky-catalog/*.md that is
// not the README and not a *-walkthrough.md overflow companion. Its identity is the single level-1
// `# <Name>` heading, with a trailing `[tag]` (if any) stripped off the name.
const collectLeaves = () => {
  const leaves = [];

  for (const file of walkMd(CATALOG)) {
    const baseName = path.basename(file).toLowerCase();

    if (baseName === "readme.md" || baseName.endsWith("-walkthrough.md")) {
      continue;
    }

    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);
    const h1s = lines.filter((l) => /^#\s+\S/.test(l));
    const base = path.basename(file, ".md");
    const rel = path.relative(repoRoot, file);

    if (h1s.length !== 1) {
      report(false, `leaf ${base}.md has exactly one level-1 heading`, `found ${h1s.length}`);
      leaves.push({ name: null, tag: null, file: rel, base, text });
      continue;
    }

    const raw = h1s[0].replace(/^#\s+/, "").trim();
    const tagMatch = raw.match(/\[([^\]]+)\]\s*$/);
    const tag = tagMatch ? tagMatch[1] : null;
    const name = raw.replace(/\s*\[[^\]]+\]\s*$/, "").trim();
    leaves.push({ name, tag, file: rel, base, text });
  }

  return leaves;
};

// Parse README rows so we can assert each leaf's Use-when is mirrored. Returns a map
// slug -> array of README line texts that link to that slug's leaf.
const readmeRowsBySlug = () => {
  const map = new Map();

  if (!fs.existsSync(README)) {
    return map;
  }

  const linkRe = /\]\(([a-z0-9][a-z0-9-]*)\.md\)/g;

  for (const line of fs.readFileSync(README, "utf8").split(/\r?\n/)) {
    let m;

    while ((m = linkRe.exec(line)) !== null) {
      const slug = m[1];

      if (!map.has(slug)) {
        map.set(slug, []);
      }

      map.get(slug).push(line);
    }
  }

  return map;
};

const leaves = collectLeaves();
const byName = new Map();

for (const leaf of leaves) {
  if (!leaf.name) {
    continue;
  }

  if (!byName.has(leaf.name)) {
    byName.set(leaf.name, []);
  }

  byName.get(leaf.name).push(leaf);
}

const rows = readmeRowsBySlug();

console.log("KRV-01/02/04 Kerievsky catalog completeness + per-leaf contract check (27-scope)");
console.log(`  catalog dir: ${path.relative(repoRoot, CATALOG)}`);
console.log(`  leaf files found: ${leaves.length}`);
console.log("");

let present = 0;

for (const name of NAMES) {
  const matches = byName.get(name) || [];

  if (matches.length === 0) {
    report(false, name, "0 leaves found");
    continue;
  }

  if (matches.length > 1) {
    report(false, name, `${matches.length} leaves (expected exactly 1)`);
    continue;
  }

  present++;
  const leaf = matches[0];
  const expectedSlug = slugFor(name);
  const missing = [];

  if (leaf.base !== expectedSlug) {
    missing.push(`filename ${leaf.base}.md != ${expectedSlug}.md`);
  }

  // LOCKED Fowler leaf contract (mirrored verbatim from check-catalog.mjs).
  if (!/^Use when:\s*\S/m.test(leaf.text)) {
    missing.push("Use when: line");
  }

  if (!/^##\s+Motivation\s*$/m.test(leaf.text)) {
    missing.push("## Motivation");
  }

  if (!/^##\s+Mechanics\s*$/m.test(leaf.text)) {
    missing.push("## Mechanics");
  }

  if (!/^##\s+Example\b/m.test(leaf.text)) {
    missing.push("## Example");
  }

  if (!/```(ts|typescript|js|javascript)\b/.test(leaf.text)) {
    missing.push("ts/js fence");
  }

  // Kerievsky-specific fields (token-lockstep with the leaf template, Pitfall 4). The Direction
  // allow-list is widened (08-06) to the authoritative Refactoring Directions table's vocabulary:
  // leading-token match validates `To`, the compound `To/Towards` (6 both-listed refactorings, routes
  // as To), `Towards`, `Away`, and the `n/a` sentinel (4 table-absent utilities). The Phase-9 coach
  // keys only on `Away`, so its routing is untouched.
  if (!/^Direction:\s*(To|Towards|Away|n\/a)\b/m.test(leaf.text)) {
    missing.push("Direction: field (To|To/Towards|Towards|Away|n/a)");
  }

  // GoF pattern: linkify gate (D-08/D-11) -- replaces the old presence-only check. Parse the
  // `GoF pattern:` line: if it carries a Markdown link, the declared name is the link text and the
  // link URL is validated; else the declared name is the leading token before ` (` (the parenthetical
  // qualifier, if any). Then EXACT-name set membership decides the required form (never substring).
  const gofLine = leaf.text.match(/^GoF pattern:\s*(.+?)\s*$/m);

  if (!gofLine) {
    missing.push("GoF pattern: field");
  } else {
    const value = gofLine[1];
    const link = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const declaredName = link ? link[1].trim() : value.split(" (")[0].trim();
    const linkUrl = link ? link[2].trim() : null;

    if (GOF23.has(declaredName)) {
      const want = `../gof-catalog/${slugFor(declaredName)}.md#${slugFor(declaredName)}`;

      if (linkUrl !== want) {
        missing.push(`GoF pattern "${declaredName}" must link to ${want}`);
      }
    } else if (EXTRA5.has(declaredName)) {
      const want = `../extra-patterns-catalog/${slugFor(declaredName)}.md#${slugFor(declaredName)}`;

      if (linkUrl !== want) {
        missing.push(`GoF pattern "${declaredName}" must link to ${want}`);
      }
    } else if (linkUrl && /\.\.\/(?:gof-catalog|extra-patterns-catalog)\//.test(linkUrl)) {
      // Token naming no real pattern (n/a -- utility, Class / type-safe value) MUST stay free text.
      missing.push(`GoF pattern free-text token "${declaredName}" must not carry a gof/extra link`);
    }
  }

  // Composed Fowler primitive(s): PRESENCE of >=1 cross-link to a Fowler leaf H1 anchor. Resolution
  // is check-crossrefs's job; this only proves the leaf declares its composition.
  if (!/^Composed Fowler primitive\(s\):.*\]\(\.\.\/fowler-catalog\/[a-z0-9-]+\.md#[a-z0-9-]+\)/m.test(leaf.text)) {
    missing.push("Composed Fowler primitive cross-link");
  }

  // The 3 named Away cases: Direction: Away + an "away from <pattern>" callout in the body (D-03).
  if (AWAY.has(name)) {
    if (!/^Direction:\s*Away\b/m.test(leaf.text)) {
      missing.push("Direction: Away (de-patterning case)");
    }

    if (!/away from\s+\S/i.test(leaf.text)) {
      missing.push('"away from <pattern>" callout');
    }
  }

  // No draft-scaffolding phrases.
  for (const re of SCAFFOLD_RES) {
    if (re.test(leaf.text)) {
      missing.push(`scaffolding phrase ${re}`);
    }
  }

  // Index-row Use-when mirror: the leaf's `Use when:` selector must appear verbatim in a README row
  // that links to this leaf. RED until the authoring waves fill the index (expected baseline).
  const useWhen = (leaf.text.match(/^Use when:\s*(.+?)\s*$/m) || [])[1];

  if (useWhen) {
    const rowLines = rows.get(expectedSlug) || [];

    if (rowLines.length === 0) {
      missing.push("no README index row");
    } else if (!rowLines.some((line) => line.includes(useWhen))) {
      missing.push("Use-when not mirrored in README row");
    }
  }

  report(missing.length === 0, name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// Flag any leaf heading that is not a canonical name (typo / stray / dropped refactoring).
const canonical = new Set(NAMES);

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown leaf heading: ${leaf.name}`, leaf.file);
  }
}

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: KRV GREEN -- ${present}/${EXPECTED} refactorings present with contract + Direction + GoF + composed-primitive fields`);
  process.exit(0);
}

console.log(`SUMMARY: KRV RED -- ${present}/${EXPECTED} present, ${failures} check(s) FAILED`);
process.exit(1);
