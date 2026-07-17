#!/usr/bin/env node
// FUN-01..04 functional-catalog gate (C1-C8, LOCKED 19-idiom-leaf by-idiom model). A faithful
// sibling of check-gof.mjs / check-kerievsky.mjs: node builtins only; imports the shared anchor
// slug helper; resolves repoRoot the same way; reports with the same [PASS]/[FAIL] +
// SUMMARY: ... GREEN/RED + process.exit(0|1) convention. The catalog is one leaf file per FP idiom
// under functional-catalog/<slug>.md (README.md is the N:1 index, not a leaf). Asserts:
//   C1 -- each of the 19 canonical idiom names is present EXACTLY once as a leaf's level-1 heading
//         (identity, not cardinality), filename == slug, and the leaf carries the LOCKED template:
//         `Use when:`, `Correspondence:`, `Keep the OO form when:`, `## Idiom`, `## Example`
//         (with a non-ignore ts fence INSIDE it), `## When each fits`. No unknown/typo H1.
//   C2 -- `Correspondence:` value is the closed enum {dissolves-from | alternative-to} (matching the
//         leaf's expected direction) + >=1 pattern link of the shape
//         ../{gof,kerievsky,extra-patterns,fowler}-catalog/<slug>.md#<anchor> (fowler-catalog is an
//         accepted resolution-only target per A3/OQ2 -- lens/transducers/normalized-store).
//   C3 -- selector-mirror (N:1): each leaf's `Use when:` appears verbatim in >=1 README row linking
//         to that leaf (bare slug.md OR slug.md#pattern-anchor).
//   C4 -- bidirectional: every gof/kerievsky/extra leaf (EXACTLY the 55: 23 gof + 27 kerievsky + 5
//         extra, mirroring check-kerievsky collectLeaves -- readme.md AND -walkthrough.md skipped)
//         carries EXACTLY one `Functional alternative:` link to a known idiom leaf whose intra-leaf
//         anchor is githubSlug of the leaf's own H1 (1:1) or of a served pattern (N:1), and that
//         idiom leaf's `Correspondence:` names it back (forward-subset mutuality). RESOLUTION of the
//         target file/anchor is check-crossrefs's job -- this asserts PRESENCE + format + mutuality.
//   C5 -- per-pattern residual cap: for each N:1 leaf, `## When each fits` has EXACTLY one
//         `### <Pattern>` sub-heading per served pattern, each followed by EXACTLY one non-blank
//         content line. 1:1 leaves get no per-pattern split.
//   C6 -- every Example has >=1 non-`ignore` ts fence (the tsc --strict compile itself is delegated
//         to extract-samples.mjs / `npm run typecheck`, which now walks functional-catalog too).
//   C7 -- note discipline: every NOTE_ITEMS source (Fowler moot / data-modeling / light) appears as
//         a one-line README note with NO functional-catalog leaf link.
//   C8 -- README `## Sources` cites `.planning/research/functional-depatterning-ts.md` (the no-oracle
//         correctness anchor; D-06).
// Link RESOLUTION (target file exists + anchor resolves) is DELEGATED to check-crossrefs (which now
// lists functional-catalog as a source dir) -- there is NO second resolver here, and no second slug
// function (FILENAME uses slugFor; #anchor uses the imported githubSlug so a DEMANDED anchor can
// never diverge from the anchor check-crossrefs VALIDATES, WR-02). check-hygiene already guards
// ASCII-only + no-verbatim + work-email over references/ recursively. Throwaway; node builtins only.
// RED against the empty catalog (0/19 leaves; 55 missing `Functional alternative:` lines; no README
// rows) is the EXPECTED instrument-first Wave-1 baseline, not a failure -- FUN-01..04 close only when
// the authoring waves turn the battery GREEN.
//   node .claude/skills/lz-refactor-workspace/tools/check-functional.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { githubSlug } from "./lib/github-slug.mjs";
import { collectH1Lines } from "./lib/heading-scan.mjs";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { sectionBody } from "./lib/section-body.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-refactor-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "references");
const FUNCTIONAL = path.join(REFERENCES, "functional-catalog");
const README = path.join(FUNCTIONAL, "README.md");

// The 19 canonical idiom leaves (D-13, RESEARCH.md Deliverable 1): 13 dissolves-from + 6
// alternative-to. `name` is the exact H1 text (identity); `slug` is slugFor(name) == the filename
// AND githubSlug(name) (they agree -- all names are alphanumeric + single spaces + one hyphen);
// `correspondence` is the closed-enum direction; `served` is the set of distinct gof/extra target
// patterns that map to an N:1 leaf and therefore need a `### <Pattern>` residual anchor (C5). A leaf
// with fewer than 2 served patterns is 1:1 (no per-pattern split). The served sets are the distinct
// PATTERNS from the Deliverable-2 N:1 map (Kerievsky refactorings inherit their target pattern's
// anchor, so they add no new residuals).
const LEAVES = [
  // 13 dissolves-from
  { name: "First-Class Function", slug: "first-class-function", correspondence: "dissolves-from", served: ["Strategy", "Bridge", "Adapter"] },
  { name: "Thunk and Lazy Value", slug: "thunk-and-lazy-value", correspondence: "dissolves-from", served: ["Command", "Proxy"] },
  { name: "Function Composition", slug: "function-composition", correspondence: "dissolves-from", served: ["Decorator", "Chain of Responsibility", "Template Method", "Builder", "Composed Method", "Collecting Parameter"] },
  { name: "Discriminated Union and Fold", slug: "discriminated-union-and-fold", correspondence: "dissolves-from", served: ["Visitor", "State", "Interpreter", "Composite"] },
  { name: "Reducer and Store", slug: "reducer-and-store", correspondence: "dissolves-from", served: [] },
  { name: "Observer Callbacks", slug: "observer-callbacks", correspondence: "dissolves-from", served: [] },
  { name: "Generator", slug: "generator", correspondence: "dissolves-from", served: [] },
  { name: "Module Namespace", slug: "module-namespace", correspondence: "dissolves-from", served: ["Singleton", "Facade"] },
  { name: "Factory Function", slug: "factory-function", correspondence: "dissolves-from", served: ["Abstract Factory", "Factory Method", "Factory", "Creation Method"] },
  { name: "Memoization and Interning", slug: "memoization-and-interning", correspondence: "dissolves-from", served: [] },
  { name: "Immutable Snapshot", slug: "immutable-snapshot", correspondence: "dissolves-from", served: [] },
  { name: "Structural Clone", slug: "structural-clone", correspondence: "dissolves-from", served: [] },
  { name: "Branded Type", slug: "branded-type", correspondence: "dissolves-from", served: [] },
  // 6 alternative-to
  { name: "Option and Either", slug: "option-and-either", correspondence: "alternative-to", served: [] },
  { name: "Functor and Monad", slug: "functor-and-monad", correspondence: "alternative-to", served: [] },
  { name: "Lens and Optics", slug: "lens-and-optics", correspondence: "alternative-to", served: [] },
  { name: "Currying and Partial Application", slug: "currying-and-partial-application", correspondence: "alternative-to", served: [] },
  { name: "Transducers", slug: "transducers", correspondence: "alternative-to", served: [] },
  { name: "Normalized Store", slug: "normalized-store", correspondence: "alternative-to", served: [] },
];

const EXPECTED = LEAVES.length; // 19

// The three OO catalogs whose 55 leaves (23 + 27 + 5) each carry a `Functional alternative:` line
// (D-09). Fowler is deliberately absent: Fowler participates via the README map rows only (D-10).
const OO_LEAF_DIRS = ["gof-catalog", "kerievsky-catalog", "extra-patterns-catalog"];

// Fowler moot / data-modeling / light-note source items (RESEARCH.md S12.3: 3 moot + 8
// data-modeling + 3 light). Each must appear as a one-line README NOTE with NO functional-catalog
// leaf link (C7) -- a moot/data-modeling item must not silently acquire a leaf. Exact membership is
// reconciled against the shipped fowler-catalog leaf names when the README notes are authored (A5,
// plan 08.2-05); this set is the instrument's starting contract.
const NOTE_ITEMS = [
  // moot / FP-baseline (3)
  "Change Reference to Value",
  "Remove Setting Method",
  "Replace Superclass with Delegate",
  // FP-avoids-via-data-modeling (8)
  "Pull Up Method",
  "Push Down Method",
  "Pull Up Field",
  "Push Down Field",
  "Pull Up Constructor Body",
  "Extract Superclass",
  "Collapse Hierarchy",
  "Remove Subclass",
  // light functional notes (3)
  "Move Field",
  "Encapsulate Variable",
  "Encapsulate Collection",
];

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

// kebab-case FILENAME slug of a canonical name (deterministic cross-link target).
const slugFor = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Escape a pattern name for use inside a dynamically built RegExp (the served/OO names are plain
// today, but this keeps the sub-heading + back-link matches robust). Still used at the served
// sub-heading + Correspondence back-link matches below.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// sectionBody (## <heading> body up to the next ## or EOF; `### ` sub-headings stay inside) is
// shared via lib/section-body.mjs, so `## When each fits` retains its per-pattern residuals (C5).

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

// Collect every functional-catalog leaf: { name, tag, file, base, text }. A leaf is a
// functional-catalog/*.md that is not the README. Identity is the single level-1 `# <Name>` heading
// with a trailing `[tag]` (if any) stripped off.
const collectLeaves = () => {
  const leaves = [];

  for (const file of walkMd(FUNCTIONAL)) {
    if (path.basename(file).toLowerCase() === "readme.md") {
      continue;
    }

    const text = fs.readFileSync(file, "utf8");
    // Fence-aware H1 scan now routes through the shared lib/heading-scan.mjs helper (IN-02 / D-10),
    // so all four catalog checkers detect headings identically and a column-0 `#` inside a fenced
    // block can never be mistaken for a leaf heading.
    const h1s = collectH1Lines(text);
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

// Collect the 55 OO leaves for C4. Mirrors check-kerievsky.mjs collectLeaves EXACTLY: skip README
// AND any *-walkthrough.md overflow companion, so the `Functional alternative:` line is demanded on
// the 55 real leaves (23 gof + 27 kerievsky + 5 extra), never on the 3 kerievsky walkthroughs.
const collectOoLeafFiles = (dir) => {
  const out = [];

  if (!isDir(dir)) {
    return out;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const lower = entry.name.toLowerCase();

    if (entry.isFile() && entry.name.endsWith(".md") && lower !== "readme.md" && !lower.endsWith("-walkthrough.md")) {
      out.push(path.join(dir, entry.name));
    }
  }

  return out;
};

// Parse README rows so we can assert each leaf's `Use when:` is mirrored (C3). Returns a map
// slug -> array of README line texts that link to that slug's leaf. Unlike the 1:1 sibling READMEs,
// the N:1 map rows link to `slug.md#pattern-anchor`, so the capture accepts an OPTIONAL anchor.
const readmeRowsBySlug = () => {
  const map = new Map();

  if (!fs.existsSync(README)) {
    return map;
  }

  const linkRe = /\]\(([a-z0-9][a-z0-9-]*)\.md(?:#[a-z0-9-]+)?\)/g;

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
const idiomTextBySlug = new Map();

for (const leaf of leaves) {
  if (leaf.base) {
    idiomTextBySlug.set(leaf.base, leaf.text);
  }

  if (!leaf.name) {
    continue;
  }

  if (!byName.has(leaf.name)) {
    byName.set(leaf.name, []);
  }

  byName.get(leaf.name).push(leaf);
}

const rows = readmeRowsBySlug();
const readmeText = fs.existsSync(README) ? fs.readFileSync(README, "utf8") : "";

console.log("FUN-01..04 functional-catalog completeness + per-leaf contract check (19-idiom scope, C1-C8)");
console.log(`  catalog dir: ${path.relative(repoRoot, FUNCTIONAL)}`);
console.log(`  leaf files found: ${leaves.length}`);
console.log("");

// --- C1/C2/C3/C5/C6: the 19 idiom leaves ---
let present = 0;

for (const spec of LEAVES) {
  const matches = byName.get(spec.name) || [];

  if (matches.length === 0) {
    report(false, spec.name, "0 leaves found");
    continue;
  }

  if (matches.length > 1) {
    report(false, spec.name, `${matches.length} leaves (expected exactly 1)`);
    continue;
  }

  present++;
  const leaf = matches[0];
  const missing = [];

  // C1: filename == slug.
  if (leaf.base !== spec.slug) {
    missing.push(`filename ${leaf.base}.md != ${spec.slug}.md`);
  }

  // C1: LOCKED leaf template (D-01 / S13.2).
  if (!/^Use when:\s*\S/m.test(leaf.text)) {
    missing.push("Use when: line");
  }

  if (!/^Keep the OO form when:\s*\S/m.test(leaf.text)) {
    missing.push("Keep the OO form when: line");
  }

  if (!/^##\s+Idiom\s*$/m.test(leaf.text)) {
    missing.push("## Idiom");
  }

  // WR-02: exact heading (not `\b`) so C1 agrees with sectionBody (line 149). A loose `\b` would
  // pass a `## Example (Before -> After)` heading that sectionBody then fails to find, giving the
  // misleading "non-ignore ts fence in ## Example" diagnostic even when the fence is present.
  if (!/^##\s+Example\s*$/m.test(leaf.text)) {
    missing.push("## Example");
  }

  if (!/^##\s+When each fits\s*$/m.test(leaf.text)) {
    missing.push("## When each fits");
  }

  // C1 + C6: >=1 NON-ignore ts fence INSIDE the ## Example section (a stray fence elsewhere, or an
  // `ts ignore` fence, does not count). The compile itself is `npm run typecheck`.
  const exampleBody = sectionBody(leaf.text, "Example");
  const hasLiveTs = exampleBody !== null
    && exampleBody.split(/\r?\n/).some((l) => /^```(ts|typescript)\b/.test(l) && !/\bignore\b/.test(l));

  if (!hasLiveTs) {
    missing.push("non-ignore ts fence in ## Example");
  }

  // C2: Correspondence enum + link shape.
  const corrLine = leaf.text.match(/^Correspondence:\s*(.+?)\s*$/m);

  if (!corrLine) {
    missing.push("Correspondence: line");
  } else {
    const val = corrLine[1];
    const enumMatch = val.match(/^(dissolves-from|alternative-to)\b/);

    if (!enumMatch) {
      missing.push("Correspondence enum {dissolves-from|alternative-to}");
    } else if (enumMatch[1] !== spec.correspondence) {
      missing.push(`Correspondence enum "${enumMatch[1]}" != expected "${spec.correspondence}"`);
    }

    // >=1 pattern link; fowler-catalog accepted as a resolution-only target (A3/OQ2).
    if (!/\]\(\.\.\/(gof|kerievsky|extra-patterns|fowler)-catalog\/[a-z0-9-]+\.md#[a-z0-9-]+\)/.test(val)) {
      missing.push("Correspondence link ../{gof,kerievsky,extra-patterns,fowler}-catalog/<slug>.md#<anchor>");
    }
  }

  // C3: selector-mirror. The leaf's `Use when:` must appear verbatim in a README row linking to it.
  const useWhen = (leaf.text.match(/^Use when:\s*(.+?)\s*$/m) || [])[1];

  if (useWhen) {
    const rowLines = rows.get(spec.slug) || [];

    if (rowLines.length === 0) {
      missing.push("no README index row");
    } else if (!rowLines.some((line) => line.includes(useWhen))) {
      missing.push("Use-when not mirrored in README row");
    }
  }

  // C5: per-pattern residual cap (N:1 leaves only). Exactly one `### <Pattern>` per served pattern
  // under `## When each fits`, each followed by exactly one non-blank content line. 1:1 leaves get
  // no per-pattern split (nothing enforced here).
  if (spec.served.length >= 2) {
    const wefBody = sectionBody(leaf.text, "When each fits");

    if (wefBody !== null) {
      for (const pat of spec.served) {
        const subCount = (wefBody.match(new RegExp(`^###\\s+${escapeRe(pat)}\\s*$`, "gm")) || []).length;

        if (subCount !== 1) {
          missing.push(`## When each fits needs exactly one "### ${pat}" (found ${subCount})`);
          continue;
        }

        const after = wefBody.split(new RegExp(`^###\\s+${escapeRe(pat)}\\s*$`, "m"))[1] || "";
        const contentLines = after.split(/^###\s+/m)[0].split(/\r?\n/).filter((l) => l.trim().length > 0);

        if (contentLines.length !== 1) {
          missing.push(`"### ${pat}" needs exactly one content line (found ${contentLines.length})`);
        }
      }
    }
  }

  // No draft-scaffolding phrases.
  for (const re of SCAFFOLD_RES) {
    if (re.test(leaf.text)) {
      missing.push(`scaffolding phrase ${re}`);
    }
  }

  report(missing.length === 0, spec.name, missing.length === 0 ? "" : `missing: ${missing.join("; ")}`);
}

// C1 reject unknown: flag any functional-catalog leaf heading that is not a canonical idiom name.
const canonical = new Set(LEAVES.map((l) => l.name));

for (const leaf of leaves) {
  if (leaf.name && !canonical.has(leaf.name)) {
    report(false, `unknown leaf heading: ${leaf.name}`, leaf.file);
  }
}

// --- C4: bidirectional `Functional alternative:` on the 55 OO leaves ---
console.log("");
console.log("C4 -- Functional alternative: line on the 55 OO leaves (23 gof + 27 kerievsky + 5 extra)");

const idiomSlugs = new Set(LEAVES.map((l) => l.slug));
const specBySlug = new Map(LEAVES.map((l) => [l.slug, l]));
let ooChecked = 0;

for (const dir of OO_LEAF_DIRS) {
  for (const file of collectOoLeafFiles(path.join(REFERENCES, dir))) {
    ooChecked++;
    const base = path.basename(file, ".md");
    const text = fs.readFileSync(file, "utf8");
    // C4 contract (header lines 17-22): EXACTLY one `Functional alternative:` line. Match ALL
    // occurrences and assert cardinality -- a first-match-only check (WR-01) let a second,
    // valid-resolving-but-semantically-wrong link slip past on future drift.
    const all = [...text.matchAll(/^Functional alternative:\s*(.+?)\s*$/gm)];

    if (all.length === 0) {
      report(false, `${dir}/${base}.md`, "Functional alternative: line missing");
      continue;
    }

    if (all.length !== 1) {
      report(false, `${dir}/${base}.md`, `expected exactly one Functional alternative: line, found ${all.length}`);
      continue;
    }

    const line = all[0];

    const link = line[1].match(/\[([^\]]+)\]\(([^)]+)\)/);

    if (!link) {
      report(false, `${dir}/${base}.md`, "Functional alternative: has no Markdown link");
      continue;
    }

    const m = link[2].trim().match(/^\.\.\/functional-catalog\/([a-z0-9-]+)\.md#([a-z0-9-]+)$/);

    if (!m) {
      report(false, `${dir}/${base}.md`, `link "${link[2].trim()}" is not ../functional-catalog/<slug>.md#<anchor>`);
      continue;
    }

    const idiomSlug = m[1];
    const anchor = m[2];

    if (!idiomSlugs.has(idiomSlug)) {
      report(false, `${dir}/${base}.md`, `unknown idiom leaf "${idiomSlug}"`);
      continue;
    }

    // Intra-leaf anchor (PRESENCE/format via the shared githubSlug -- resolution is check-crossrefs):
    // a 1:1 leaf's link targets its own H1 anchor; an N:1 leaf's link targets a served-pattern anchor.
    const spec = specBySlug.get(idiomSlug);
    const validAnchors = spec.served.length >= 2
      ? spec.served.map((p) => githubSlug(p))
      : [githubSlug(spec.name)];

    if (!validAnchors.includes(anchor)) {
      report(false, `${dir}/${base}.md`, `anchor "#${anchor}" is not a valid ${idiomSlug} target (expected one of: ${validAnchors.join(", ")})`);
      continue;
    }

    // Mutuality (forward-subset): IF the idiom leaf exists, its `Correspondence:` must name this OO
    // leaf back. If the idiom leaf does not exist yet, that is check-crossrefs's RED-by-design job.
    const idiomText = idiomTextBySlug.get(idiomSlug);

    if (idiomText) {
      const corr = idiomText.match(/^Correspondence:\s*(.+?)\s*$/m);
      const backRe = new RegExp(`\\.\\./${dir}/${escapeRe(base)}\\.md[#)]`);

      if (!corr || !backRe.test(corr[1])) {
        report(false, `${dir}/${base}.md <-> ${idiomSlug}`, `idiom Correspondence does not name ../${dir}/${base}.md back`);
        continue;
      }
    }

    report(true, `${dir}/${base}.md -> ${idiomSlug}#${anchor}`);
  }
}

// C4 count assertion (IN-01): the header contract is EXACTLY 55 OO leaves (23 gof + 27 kerievsky +
// 5 extra). Assert the aggregate here so an entire missing catalog dir cannot pass C4 silently --
// each dir's own count is asserted by its sibling checker (check-gof/check-kerievsky/check-extra),
// this is the in-gate defense-in-depth that makes the "EXACTLY the 55" header claim actually hold.
report(ooChecked === 55, "C4 OO-leaf count == 55 (23 gof + 27 kerievsky + 5 extra)", ooChecked === 55 ? "" : `found ${ooChecked}`);

// --- C7: Fowler note discipline in the README ---
console.log("");
console.log("C7 -- Fowler moot / data-modeling / light items are one-line README notes (no leaf link)");

const readmeLines = readmeText.split(/\r?\n/);

for (const item of NOTE_ITEMS) {
  const noteLines = readmeLines.filter((l) => l.includes(item));

  if (noteLines.length === 0) {
    report(false, `note: ${item}`, "no README note row");
    continue;
  }

  const hasLeafLink = noteLines.some((l) => /\]\([a-z0-9-]+\.md(?:#[a-z0-9-]+)?\)/.test(l));
  report(!hasLeafLink, `note: ${item}`, hasLeafLink ? "note must not carry a functional-catalog leaf link" : "");
}

// --- C8: README ## Sources cites the research artifact ---
console.log("");
const hasSourcesHeading = /^##\s+Sources\s*$/m.test(readmeText);
const citesResearch = readmeText.includes(".planning/research/functional-depatterning-ts.md");
report(hasSourcesHeading && citesResearch, "C8 README ## Sources cites .planning/research/functional-depatterning-ts.md",
  hasSourcesHeading ? (citesResearch ? "" : "citation missing") : "## Sources heading missing");

console.log("");
console.log(`  [INFO] OO leaves checked for Functional alternative: -- ${ooChecked} (expected 55)`);

if (failures === 0) {
  console.log(`SUMMARY: FUN GREEN -- ${present}/${EXPECTED} idiom leaves present with template + Correspondence + bidirectional Functional alternative + selector-mirror`);
  process.exit(0);
}

console.log(`SUMMARY: FUN RED -- ${present}/${EXPECTED} present, ${failures} check(s) FAILED (instrument-first RED baseline by design pre-content)`);
process.exit(1);
