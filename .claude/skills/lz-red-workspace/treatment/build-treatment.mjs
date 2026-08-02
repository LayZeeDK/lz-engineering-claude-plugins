#!/usr/bin/env node
// Regenerate the D-12 NON-BASELINE plugin trees from tracked inputs. TWO of them, one per lever:
//
//   out/lz-tdd-treatment -- the PASSIVE lever. Shipped lz-tdd with the test-double taxonomy composed
//                           INLINE into lz-red's SKILL.md body. Drives --arm invoke_treatment.
//   out/lz-tdd-forcing   -- the ACTIVE lever. Shipped lz-tdd plus an always-active
//                           enumerate-then-decide step in lz-red's SKILL.md, and DELIBERATELY NO
//                           reference artifact. Drives --arm invoke_forcing.
//
// Both are measured against the SAME baseline, --arm invoke_skill (plugins/lz-tdd, untouched).
//
// WHY TWO LEVERS. Passive skill content is 0-for-5 on this repo's output axis; the one probe that
// ever moved it was an ACTIVE forcing function -- lz-refactor's always-active loop AUDIT+DECIDE step
// (plugins/lz-tdd/skills/lz-refactor/SKILL.md), which went 0/3 to 5/5 and shipped after five passive
// probes measured null. Running the passive and active levers as separate arms against one baseline
// is what makes a null on one of them interpretable.
//
// THE LEVER SEPARATION IS THE POINT, and it is enforced rather than trusted: the forcing tree adds
// NO file (its delta set is one edited SKILL.md), carries no copy of the artifact, and its inserted
// block is scanned for taxonomy content. If the step ever smuggles the table in, the forcing arm
// becomes the treatment arm in disguise and the experiment can no longer tell the two levers apart.
//
// Why a build script instead of committed copies: plugins/lz-tdd is 837K / 195 files, and each
// variant differs from it in one or two files. Git carries the artifact plus this script; the trees
// are built on demand into an already-gitignored directory (.gitignore `out/`).
//
// The shipped tree is never mutated. It IS the baseline arm of the A/B, and guard N3 forbids a
// taxonomy copy under plugins/, so both properties hold by construction rather than by discipline.
//
// Everything here fails CLOSED. A silently-skipped insertion would produce a tree whose lever is
// absent, and the A/B would then measure nothing while looking healthy.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../../..');
const SOURCE_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd');
const ARTIFACT_NAME = 'test-double-taxonomy.md';
const ARTIFACT_SRC = path.join(HERE, ARTIFACT_NAME);

const SKILL_REL = path.join('skills', 'lz-red', 'SKILL.md');
const ARTIFACT_REL = path.join('references', ARTIFACT_NAME);
const MANIFEST_REL = path.join('.claude-plugin', 'plugin.json');

// ---------------------------------------------------------------------------------------------
// Variant 1: the PASSIVE lever. Compose the taxonomy INTO the SKILL.md body.
// ---------------------------------------------------------------------------------------------
// WHY INLINE rather than cited (D-04, 2026-08-02). The prior round shipped the artifact into
// references/ and cited it from the reference LIST at the end of the file. ZERO of six treatment
// runs opened it -- verified by transcript grep with a passing positive control -- so the treatment
// DOSE was zero and the arm measured RETRIEVAL rather than content. Inlining puts the content in the
// MAIN BODY, which is guaranteed loaded, and that is the entire purpose.
//
// WHY NOT point the FORCING step at the artifact instead, which would also guarantee delivery: it
// would fuse the two levers into one arm. Arm 2 must stay purely passive content and arm 3 purely
// the active step, or a positive result is unattributable. Lever separation is the reason the round
// has three arms at all.
//
// PLACEMENT: immediately BEFORE the reference-material heading. That lands the content right after
// the numbered procedure and the worked RED example, where the qualify-by-side rule sets it up, and
// it needs only ONE anchor, which is all this builder supports. Inserting earlier would push the
// worked example and the coach-don't-drive paragraph ~110 lines down, which is strictly worse.
//
// KNOWN CONFOUND, unavoidable and therefore declared rather than fixed: the three arms are no longer
// matched on SKILL.md length (MEASURED 2026-08-02: baseline 167 lines, forcing 174, treatment 282 --
// the treatment body is 69% longer than the baseline, on every run). Any measured
// treatment effect is confounded with length and position, and treatment-versus-forcing is not a
// clean two-lever comparison on length either. The dose cannot be guaranteed and the length held
// constant at the same time.
const TAXONOMY_ANCHOR = '## Reference material';
// NOT the artifact's own H1 reworded -- a heading that CONTAINED the H1 string would defeat the
// header-strip assertion below, which is the thing standing between a dev-time notice and a
// SKILL.md.
const TAXONOMY_HEADING = '## Which side of the line a term names';
// Occurs exactly ONCE in the artifact and ZERO times in the shipped SKILL.md, so the builder's
// existing marker-count assertion stays meaningful after the substitution.
const TAXONOMY_MARKER = 'HARD RULE ON EMPTINESS';

// The artifact body, dev-time header stripped, ready to splice.
//
// The artifact opens with an H1 plus two workspace-meta paragraphs -- a not-approved-for-shipping
// notice and a gating-status note. Those must never enter a SKILL.md: they would tell the model
// under test that it is inside an experiment. The slice is anchored on the artifact's FIRST `## `
// heading rather than on a line count, because a positional slice mis-slices silently the moment the
// header is reworded. The TRACKED artifact keeps its header; only this generated copy is stripped.
function taxonomyBodyLines() {
  if (!fs.existsSync(ARTIFACT_SRC)) {
    fail(`treatment: taxonomy artifact missing: ${ARTIFACT_SRC}`);
  }

  const lines = fs.readFileSync(ARTIFACT_SRC, 'utf8').split(/\r?\n/);
  const h1 = lines[0];
  const firstHeadingAt = lines.findIndex((l) => l.startsWith('## '));

  if (firstHeadingAt < 0) {
    fail(`treatment: ${ARTIFACT_NAME} carries no '## ' heading, so the dev-time header cannot be sliced off deterministically`);
  }

  const body = lines.slice(firstHeadingAt);

  if (!body[0].startsWith('## ')) {
    fail(`treatment: the sliced block does not begin at a '## ' heading (got ${JSON.stringify(body[0])})`);
  }

  if (body.some((l) => l === h1)) {
    fail(`treatment: the artifact's H1 ${JSON.stringify(h1)} survived the header strip; a dev-time notice must never reach a SKILL.md`);
  }

  if (!body.some((l) => l.includes(TAXONOMY_MARKER))) {
    fail(`treatment: the sliced block does not carry the marker ${JSON.stringify(TAXONOMY_MARKER)}, so the marker-count assertion would be vacuous`);
  }

  // A trailing blank separates the inlined section from the reference-material heading it precedes.
  return [TAXONOMY_HEADING, '', ...body, ''];
}

// ---------------------------------------------------------------------------------------------
// Variant 2: the ACTIVE lever. An always-active enumerate-then-decide step.
// ---------------------------------------------------------------------------------------------
// PLACEMENT. Inserted at the END of coach step 1 (Classify the request), immediately before the
// line that opens step 2. Step 1 runs on every coach-mode request and is reached regardless of the
// stance router, which is exactly the lz-refactor lesson: the audit that worked lived in the
// SKILL.md step, not in a leaf that only opens on a smell match. Appending to step 1 rather than
// adding a step 7 also avoids renumbering, and the procedure cross-references its own step numbers
// in four places ("Law 3 is step 6", "step 5 decides", "(step 4)").
//
// WHAT IT DELIBERATELY DOES NOT DO, and each omission is load-bearing:
//   - It supplies NO taxonomy. No axes, no census, no catalog kinds, no author attributions, and it
//     never names the correct side for any case. It tells the model to LOOK and to STATE A VERDICT;
//     the treatment arm is the one that hands over the table. TAXONOMY_TOKENS below is the tripwire.
//   - It does NOT say what to do after the verdict. The lz-refactor precedent routes its audit into
//     action ("handle the yes list as step 5 handles any refactoring") because the deliverable there
//     is code. Here the deliverable is prose and ACTIONABILITY IS A SCORED RUBRIC DIMENSION, so an
//     instruction about response shape would score the arm high by construction -- the same defect
//     class the rubric already refuses for phrase sets and for "did it ask which side".
//   - It does not use the contested word itself, which would hint at which word to look at.
const FORCING_ANCHOR = '2. Hold the Three Laws spine. Law 1 gates entry: write no production code until a failing test asks';
const FORCING_MARKER = 'audit the stand-in vocabulary in the request';
const FORCING_LINES = [
  '   Also before you answer, ' + FORCING_MARKER + ' (run this on every request,',
  '   including one that hands off to a sibling skill in the paragraph above and never reaches the',
  '   later steps). List every word the developer used for something that stands in for something',
  '   else -- their words, not yours, and list it even when only one such word appears. For each,',
  '   DECIDE from the request alone whether its wording settles which side of the line that word',
  '   names -- answer settled or unsettled, with a one-line reason quoting the wording you decided',
  '   from. State those verdicts before the rest of your answer.',
];

// The lever-separation tripwire. None of these may appear in the forcing tree's inserted block: they
// are the content the PASSIVE arm exists to supply, and any of them here would collapse the two arms
// into one. Scanned against the inserted lines ONLY -- the shipped SKILL.md legitimately carries
// "production-side" and "collaborator-side" in its step 6, and that inline rule is part of the
// common baseline all three arms share.
const TAXONOMY_TOKENS = [
  'Dummy Object', 'Test Stub', 'Test Spy', 'Mock Object', 'Fake Object', 'Responder', 'Saboteur',
  'Temporary Test Stub', 'Test Double', 'Meszaros', 'Fowler', 'Bernhardt', 'Kerievsky', 'Metz',
  'production-side', 'collaborator-side', 'census',
];

// activeLever is the EXPLICIT lever-identity field the two lever-separation guards key on. It used
// to be inferred from `!variant.artifactSrc`, which was a sound proxy only while the PASSIVE lever
// was the one shipping a file. D-04 removes that file, which INVERTS the proxy: the smuggle tripwire
// would then run against the treatment block -- which is nothing but taxonomy content -- and the
// build would fail loudly, blaming the ACTIVE lever. Keying on identity rather than on a side effect
// keeps both guards live. Neither may be deleted: the tripwire is what catches the taxonomy leaking
// into the arm that must not have it, which is the class of mistake guard N3 was hardened against.
const VARIANTS = [
  {
    id: 'treatment',
    outName: 'lz-tdd-treatment',
    lever: 'PASSIVE (taxonomy content, inlined into the SKILL.md body)',
    activeLever: false,
    artifactSrc: null,
    anchor: TAXONOMY_ANCHOR,
    position: 'before',
    lines: taxonomyBodyLines(),
    marker: TAXONOMY_MARKER,
    expectedDeltas: [`edited  ${SKILL_REL}`],
  },
  {
    id: 'forcing',
    outName: 'lz-tdd-forcing',
    lever: 'ACTIVE (always-active enumerate-then-decide step)',
    activeLever: true,
    artifactSrc: null,
    anchor: FORCING_ANCHOR,
    position: 'before',
    lines: FORCING_LINES,
    marker: FORCING_MARKER,
    expectedDeltas: [`edited  ${SKILL_REL}`],
  },
];

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

// relative path -> content hash, for every file at any depth.
function hashTree(root) {
  const out = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (entry.isFile()) {
        out.set(path.relative(root, full), hashFile(full));
      }
    }
  };

  walk(root);

  return out;
}

const repoRoot = path.resolve(REPO_ROOT);

if (!fs.existsSync(SOURCE_DIR)) {
  fail(`source plugin tree missing: ${SOURCE_DIR}`);
}

const before = hashTree(SOURCE_DIR);

function buildVariant(variant) {
  // -------------------------------------------------------------------------------------------
  // Destination safety. Asserted BEFORE anything is deleted. Hardcoded, deliberately with NO env
  // override: the first thing this does to the path is a recursive delete, and an env-overridable
  // destructive target is a foot-gun. The runner's TREATMENT_DIR / FORCING_DIR carry the override
  // instead, because there the value is only ever READ.
  // -------------------------------------------------------------------------------------------
  const dest = path.resolve(path.join(REPO_ROOT, 'out', variant.outName));
  const lastTwo = dest.split(path.sep).slice(-2);

  if (dest !== repoRoot && !dest.startsWith(repoRoot + path.sep)) {
    fail(`destination ${dest} is outside the repo root ${repoRoot}; refusing to delete anything`);
  }

  if (lastTwo[0] !== 'out' || lastTwo[1] !== variant.outName) {
    fail(`destination ${dest} does not end in out/${variant.outName}; refusing to delete anything`);
  }

  if (variant.artifactSrc && !fs.existsSync(variant.artifactSrc)) {
    fail(`${variant.id}: artifact missing: ${variant.artifactSrc}`);
  }

  // Lever separation, asserted on the INPUT before the tree exists: only the PASSIVE variant may
  // carry taxonomy content into its insertion. Keyed on the explicit lever identity, NOT on
  // `!variant.artifactSrc` -- that proxy inverted the moment the passive lever stopped shipping a
  // file (D-04/D-07), and inverted it would accuse the active lever of smuggling the very content
  // the passive lever exists to supply.
  if (variant.activeLever) {
    const block = variant.lines.join('\n');
    const smuggled = TAXONOMY_TOKENS.filter((t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(block));

    if (smuggled.length) {
      fail(
        `${variant.id}: the inserted block carries taxonomy content ${JSON.stringify(smuggled)}. The ACTIVE lever must ` +
          'tell the model to look, not hand it the table -- otherwise this arm is the treatment arm in disguise and the ' +
          'experiment cannot tell the two levers apart.',
      );
    }
  }

  // -------------------------------------------------------------------------------------------
  // Build.
  // -------------------------------------------------------------------------------------------
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(SOURCE_DIR, dest, { recursive: true });

  if (variant.artifactSrc) {
    const artifactOut = path.join(dest, ARTIFACT_REL);
    fs.mkdirSync(path.dirname(artifactOut), { recursive: true });
    fs.copyFileSync(variant.artifactSrc, artifactOut);
  }

  const skillPath = path.join(dest, SKILL_REL);

  if (!fs.existsSync(skillPath)) {
    fail(`${variant.id}: copied skill missing: ${skillPath}`);
  }

  const skillLines = fs.readFileSync(skillPath, 'utf8').split(/\r?\n/);
  const anchorAt = skillLines.reduce((acc, line, i) => (line.includes(variant.anchor) ? acc.concat(i) : acc), []);

  if (anchorAt.length !== 1) {
    fail(
      `${variant.id}: anchor count is ${anchorAt.length}, expected exactly 1, in ${SKILL_REL}. A zero-match insertion ` +
        'would yield a tree whose lever is absent.',
    );
  }

  skillLines.splice(variant.position === 'after' ? anchorAt[0] + 1 : anchorAt[0], 0, ...variant.lines);
  fs.writeFileSync(skillPath, skillLines.join('\n'));

  // -------------------------------------------------------------------------------------------
  // Post-build assertions. All fail closed, all printed.
  // -------------------------------------------------------------------------------------------
  const manifestPath = path.join(dest, MANIFEST_REL);

  if (!fs.existsSync(manifestPath)) {
    fail(`${variant.id}: generated tree has no ${MANIFEST_REL}; --plugin-dir would not load it`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (manifest.name !== 'lz-tdd') {
    fail(
      `${variant.id}: generated manifest name is ${JSON.stringify(manifest.name)}, expected "lz-tdd". Any other name ` +
        'breaks the forced slash command and the plugin-root variable, turning this arm into a second baseline.',
    );
  }

  const markerCount = fs.readFileSync(skillPath, 'utf8').split(variant.marker).length - 1;

  if (markerCount !== 1) {
    fail(`${variant.id}: the inserted marker occurs ${markerCount} time(s) in the generated ${SKILL_REL}, expected exactly 1`);
  }

  const after = hashTree(dest);
  const deltas = [];

  for (const [rel, hash] of after) {
    if (!before.has(rel)) {
      deltas.push(`added   ${rel}`);
      continue;
    }

    if (before.get(rel) !== hash) {
      deltas.push(`edited  ${rel}`);
    }
  }

  for (const rel of before.keys()) {
    if (!after.has(rel)) {
      deltas.push(`removed ${rel}`);
    }
  }

  const expected = variant.expectedDeltas.slice().sort();

  if (deltas.length !== expected.length || deltas.slice().sort().join('|') !== expected.join('|')) {
    fail(
      `${variant.id}: expected exactly ${expected.length} delta(s) (${expected.join(', ')}), got ${deltas.length}:\n  ` +
        deltas.join('\n  '),
    );
  }

  // Lever separation, asserted on the OUTPUT tree: the ACTIVE arm must carry no copy of the
  // artifact anywhere, under any name. The delta check above already implies it; this states it
  // directly so the guarantee does not rest on reading a delta list. Same re-keying as the input
  // guard above, for the same reason.
  if (variant.activeLever) {
    const copies = [...after.keys()].filter((rel) => rel.toLowerCase().includes('test-double-taxonomy'));

    if (copies.length) {
      fail(`${variant.id}: the ACTIVE arm's tree carries a taxonomy copy ${JSON.stringify(copies)}; the two levers must stay separate`);
    }
  }

  console.log(`[OK] ${variant.id} tree built at ${path.relative(repoRoot, dest)} -- lever: ${variant.lever} (plugin name: ${manifest.name})`);

  for (const delta of deltas) {
    console.log(`[OK] ${variant.id} delta: ${delta}`);
  }
}

for (const variant of VARIANTS) {
  buildVariant(variant);
}

// The two generated SKILL.md files must DIFFER, or the arms are the same tree twice.
const treatmentSkill = fs.readFileSync(path.join(REPO_ROOT, 'out', 'lz-tdd-treatment', SKILL_REL), 'utf8');
const forcingSkill = fs.readFileSync(path.join(REPO_ROOT, 'out', 'lz-tdd-forcing', SKILL_REL), 'utf8');
const baselineSkill = fs.readFileSync(path.join(SOURCE_DIR, SKILL_REL), 'utf8');

for (const [a, b, label] of [
  [treatmentSkill, forcingSkill, 'treatment vs forcing'],
  [treatmentSkill, baselineSkill, 'treatment vs baseline'],
  [forcingSkill, baselineSkill, 'forcing vs baseline'],
]) {
  if (a === b) {
    fail(`${label}: the two ${SKILL_REL} files are IDENTICAL, so those arms are not distinct`);
  }
}

console.log(`[OK] all three arms carry a DISTINCT ${SKILL_REL} (baseline, treatment, forcing pairwise different)`);
console.log(`[OK] source tree ${path.relative(repoRoot, SOURCE_DIR)} untouched: ${before.size} files read, 0 written`);
