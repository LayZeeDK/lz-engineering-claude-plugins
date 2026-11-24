#!/usr/bin/env node
// grade-routing.mjs -- the D-12 ROUTING-CORRECTNESS grader for the D-08 placement A/B
// (+ an offline, zero-spend --selfcheck).
//
// The graded unit is ONE captured run's answer prose, and the metric is a single closed DESTINATION
// label -- which skill the answer designates as the owner of the request:
//
//   lz-red            the answer designates the red step
//   lz-tpp            the answer designates the green step
//   lz-refactor       the answer designates the refactor step
//   <a> -> <b>        an ORDERED handoff of two of the three (D-02's two-hop case)
//   NONE              the answer designates no skill in the loop (the declared residual, D-01 (d))
//
// pass == (the extracted label equals the case's expected label from tools/rgr-cases.json:
// expectedOwner, or the ordered pair expectedOwner -> expectedSecondHop when that field is set).
// NOTHING else passes. There is no partial credit, no phrase bonus and no second dimension.
//
// THE METRIC IS A DESTINATION, NEVER HOUSE VOCABULARY (D-12). This is not a stylistic preference: a
// deterministic phrase-set grader was run over coaching prose on this project once, and because it
// measured the skill's own wording as a proxy for correctness it systematically false-failed a
// baseline that was substantively right in different words -- inflating that round's headline by
// roughly threefold. A label has no vocabulary to reward. The one place a naive `includes()` would
// smuggle the same defect back in is destination EXTRACTION, because the classifier prose names all
// three skills and names most of them inside EXCLUSION clauses; see the comment at extractDestination.
//
// Three cardinality classes, kept apart on purpose because they carry different amounts of evidence:
//
//   exactly-one   one affirmed name -> resolved DETERMINISTICALLY against the expected label,
//                 except on the ordered two-hop case, where it goes to the judge (one name can
//                 never equal an ordered pair, so a deterministic verdict there could only FAIL)
//   multiple      two or more affirmed names -> ALWAYS unresolved, handed to a blind judge
//   zero          no affirmed name -> resolved deterministically ONLY on the residual case;
//                 unresolved on every other case
//
// `multiple` is never guessed because a CORRECT answer to the two-hop case names two skills
// legitimately while a hedging answer names three, and no mechanical rule separates "lz-red first,
// then lz-tpp" from "could be lz-red or lz-tpp". `zero` is not an automatic fail because a coaching
// answer that solves the developer's problem without naming any skill is substantively AMBIGUOUS,
// not wrong -- on the residual case it is exactly right, which is why that one case resolves.
//
// It is a POST-RUN pass over captured artifacts. It does NOT drive claude, it spends nothing, and it
// does not modify run-e2e.mjs. It fails CLOSED: an empty or sentinel answer, a non-zero run exit, an
// unreadable capture, a garbled or keyless meta.json, a case id absent from the corpus, or an
// unreadable heading source for the judge blinding all THROW rather than silently scoring. And it
// refuses to write a FINAL-looking grading artifact while any graded run is still unresolved -- the
// preliminary path guard, so an unresolved run cannot silently drop out of the numbers.
//
// The classifier logic is SHARED between the real gate (gradeRun) and --selfcheck (gradeFixture);
// only where the answer text and the meta come from differs.
//
// Provenance: the negation-aware affirmation test and the preliminary-output guard are ported from
// the sibling grade-run.mjs (its `occursAffirmed` and `finalOutPath`). They are COPIED, not imported:
// that file is structurally bound to the ten Phase-20 scenarios through a count-aligned rubric array
// whose alignment its own selfcheck enforces, so reusing it as a base would mean editing frozen
// Phase-20 evidence. Duplication across a workspace boundary is this repo's standing convention.
//
// Artifact shape is what merge-judge.mjs consumes UNCHANGED -- expectations[{text,passed,evidence}],
// summary, preliminary, judge_required[texts] -- plus three additive keys it ignores on input (`pass`,
// `routing`, `judge_inputs`). KNOWN BOUNDARY, stated rather than discovered later: merge-judge's
// OUTPUT is rebuilt from expectations alone, so those three keys do NOT survive a judge merge. The
// rollup step must re-derive `pass` from the merged expectations rather than expect it to persist.
//
// ponytail: one self-contained script, node builtins only, no framework and no config file. The
// deliberate simplification is that affirmation is punctuation/conjunction/hedge heuristics rather
// than a parser, and blinding is string replacement rather than semantic rewriting. Ceiling: a
// destination expressed with NO skill name at all is reported as `zero` and sent to a judge instead
// of being inferred. Upgrade only if a measured round shows a systematic mis-read.
//
// Usage:
//   node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck        # offline, zero spend
//   node .claude/skills/lz-red-workspace/grade-routing.mjs --run <runDir>     # grade one captured run
//   node .claude/skills/lz-red-workspace/grade-routing.mjs --suite <suiteDir> # grade every captured run
//   node .claude/skills/lz-red-workspace/grade-routing.mjs --run <runDir> --out <path>

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// .claude/skills/lz-red-workspace -> up three to the repo root.
const REPO_ROOT = path.resolve(HERE, '../../..');
const CORPUS_PATH = path.join(HERE, 'tools', 'rgr-cases.json');
const FIXTURE_DIR = path.join(HERE, 'fixtures-routing');
const SHIPPED_SKILLS_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd', 'skills');

// The closed label set. Order is the corpus's own reading order and is not significant.
const SKILL_LABELS = ['lz-red', 'lz-tpp', 'lz-refactor'];
const NONE_LABEL = 'NONE';
const HOP = ' -> ';
// run-e2e.mjs writes this exact sentinel when a run produced no result text. Treating it as prose
// would score a crashed run, so it is a fail-closed trigger rather than a zero-destination answer.
const NO_RESULT_SENTINEL = '(no result text captured)';
const GRADE_FILE = 'routing-grade.json';
const PRELIMINARY_GRADE_FILE = 'routing-grade.preliminary.json';

// ---- word-bounded, negation-aware name occurrence ---------------------------------------------

// The driver's boundary class, as lookarounds so a match index is the name's own index (the clause
// helpers below do arithmetic on it). Excluding '-' from the class is what refuses a LONGER name that
// merely starts with a tracked one: `lz-redux` and `lz-red-workspace` are not `lz-red`. The `i` flag
// makes the class case-insensitive too, so an upper-case neighbour is caught as well.
function nameReAll(name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`(?<![a-z0-9-])${esc}(?![a-z0-9-])`, 'gi');
}

// Whitespace-tolerant literal matcher for a longer phrase (used by the judge-blinding pass, where a
// section heading may have been re-wrapped by the model quoting it).
function phraseReAll(phrase) {
  const esc = phrase
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');

  return new RegExp(esc, 'gi');
}

// Clause-scoped, BIDIRECTIONAL negation awareness. Ported from grade-run.mjs. The classifier prose
// this grader reads is dense with contrastive phrasing -- "that is not this skill's job, use lz-tpp
// instead", "do NOT hand this to lz-refactor" -- and a bare regex test would credit the very skill
// the answer excluded.
const NEG = /\b(?:not|no|never|neither|nor|without|isn't|aren't|wasn't|weren't|doesn't|don't|didn't|cannot|n't)\b/i;
const CONTRAST = /\b(?:but|however|rather|instead|whereas|while|though|although|yet)\b/gi;
const FWD_BOUNDARY = /\b(?:and|or|but|however|rather|instead|whereas|while|though|although|yet|because|since|so|plus)\b/i;
const HEDGE = /\b(?:might|may|could|would)\s+(?:guess|think|assume|suppose|expect|imagine|say|be\s+tempted)\b|\bat\s+first(?:\s+glance|\s+blush)?\b|\binitially\b|\bnaively\b|\bon\s+first\s+read\b|\btempting\s+to\s+(?:say|think|guess|assume)\b/i;
const CONTRAST_FWD = /\b(?:but|however|actually|instead|rather|whereas|yet|in\s+fact|really)\b/i;

function clauseBefore(resp, idx) {
  let start = idx;

  while (start > 0 && !'.,;:!?\n'.includes(resp[start - 1])) {
    start--;
  }

  let clause = resp.slice(start, idx);
  const cm = [...clause.matchAll(CONTRAST)];

  if (cm.length) {
    const last = cm[cm.length - 1];
    clause = clause.slice(last.index + last[0].length);
  }

  return clause;
}

function clauseAfter(resp, end) {
  let stop = end;

  while (stop < resp.length && !'.,;:!?\n'.includes(resp[stop])) {
    stop++;
  }

  let clause = resp.slice(end, stop);
  const fm = clause.search(FWD_BOUNDARY);

  if (fm >= 0) {
    clause = clause.slice(0, fm);
  }

  return clause;
}

function sentenceAround(resp, idx, end) {
  let s = idx;

  while (s > 0 && !'.!?\n'.includes(resp[s - 1])) {
    s--;
  }

  let e = end;

  while (e < resp.length && !'.!?\n'.includes(resp[e])) {
    e++;
  }

  return { before: resp.slice(s, idx), after: resp.slice(end, e) };
}

function hedgedContrastive(resp, idx, end) {
  const { before, after } = sentenceAround(resp, idx, end);

  return HEDGE.test(before) && CONTRAST_FWD.test(after);
}

// First index at which `name` occurs as a real CLAIM: present, negated in neither direction, and not
// a hedged-then-retracted hypothetical. Returns -1 when every occurrence is excluded.
function firstAffirmedIndex(text, name) {
  const re = nameReAll(name);
  let m;

  while ((m = re.exec(text)) !== null) {
    const idx = m.index;
    const end = idx + m[0].length;
    const negated = NEG.test(clauseBefore(text, idx)) || NEG.test(clauseAfter(text, end));

    if (!negated && !hedgedContrastive(text, idx, end)) {
      return idx;
    }

    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
  }

  return -1;
}

// ---- destination extraction --------------------------------------------------------------------

// Which of the three names the answer AFFIRMS as a destination, in first-occurrence order.
//
// This is the ONE place where a bare `text.includes('lz-tpp')` would recreate, inside the grader, the
// exact ceiling this phase exists to close: the guard it replaces was satisfied by an incidental
// mention. Every occurrence is filtered through the negation-aware affirmation test above, so an
// exclusion clause -- which is how a correct classifier answer talks about the two skills it is NOT
// handing the request to -- does not count as designating that skill. Order is preserved because
// D-02's two-hop destination is an ORDERED pair and "lz-red then lz-tpp" is not the same claim as
// "lz-tpp then lz-red".
export function extractDestination(answerText) {
  const text = String(answerText || '');
  const found = [];

  for (const name of SKILL_LABELS) {
    const idx = firstAffirmedIndex(text, name);

    if (idx >= 0) {
      found.push({ name, idx });
    }
  }

  found.sort((a, b) => a.idx - b.idx);
  const affirmed = found.map((f) => f.name);
  const cardinality = classifyCardinality(affirmed);
  let label = null;

  if (cardinality === 'exactly-one') {
    label = affirmed[0];
  } else if (cardinality === 'zero') {
    label = NONE_LABEL;
  } else if (affirmed.length === 2) {
    // Informational only. `multiple` NEVER resolves deterministically (see the header); the ordered
    // pair is carried so the evidence and the judge's context show WHAT was named in WHAT order.
    label = affirmed.join(HOP);
  }

  return { affirmed, cardinality, label };
}

export function classifyCardinality(affirmed) {
  const list = Array.isArray(affirmed) ? affirmed : [];

  if (list.length === 0) {
    return 'zero';
  }

  return list.length === 1 ? 'exactly-one' : 'multiple';
}

// ---- judge blinding ----------------------------------------------------------------------------

// Every arm in this A/B is skill-loaded and every arm carries byte-identical `description`
// frontmatter, so the coaching register does not identify the arm -- which is a genuine improvement
// over the prior behavior eval, whose judge could always spot the no-skill baseline. Two residual
// leaks remain, and both are closed HERE rather than asserted away:
//
//   path     variants B and C may cite the shared table by path or through the plugin-root variable;
//            variant A has no such file to cite, so a path is a giveaway
//   heading  variants A and B may recite a per-skill narrative heading that variant C deletes
//
// Each is replaced with a NEUTRAL PLACEHOLDER rather than deleted, so the judge can still see THAT
// the answer pointed at a file or a section without seeing WHICH -- deletion would silently change
// the answer's structure. The function reports which normalizations fired and how many times, so the
// writeup can state how much was stripped instead of claiming blindness.
//
// A heading is stripped whether or not it is quoted: reciting a full section heading in bare prose
// identifies the arm exactly as well as quoting it does. ACCEPTED TRADEOFF, named here because it is
// the one way this pass can cost information: the three narrative headings CONTAIN skill names, so an
// answer whose only destination signal is a recited heading reaches the judge with that signal gone.
// That is the intended ordering -- an answer that never designated an owner in its own prose has not
// designated one -- and the deterministic layer reads the RAW text, so extraction is unaffected.
const PLUGIN_ROOT_RE = /\$\{[A-Z_]*PLUGIN_ROOT\}[^\s)"'`,;]*/g;
const REFERENCE_PATH_RE = /[^\s)"'`,;]*references[\\/][A-Za-z0-9._-]+/g;
const PATH_PLACEHOLDER = '[reference path]';
const HEADING_PLACEHOLDER = '[section heading]';
// Below this length a "heading" is too generic to be arm-identifying and stripping it would be noise.
const MIN_HEADING_LENGTH = 6;

// The arm-identifying heading set is DERIVED from the tracked tree rather than hardcoded, so a
// rewording by whoever authors the routing content cannot silently stale it. Variant A is the tracked
// tree and variants B/C only remove or relocate sections, so A's heading set is the superset that
// contains every heading a leak could name. Fails CLOSED: an unreadable tree throws, because handing
// a judge an UNBLINDED answer is worse than stopping the grade.
export function shippedSectionHeadings(skillsDir = SHIPPED_SKILLS_DIR) {
  let entries;

  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch (err) {
    throw new Error(
      `grade-routing: cannot list ${skillsDir} to derive the judge-blinding heading set (fail closed): ${err.message}`,
    );
  }

  const headings = new Set();

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillMd = path.join(skillsDir, entry.name, 'SKILL.md');
    let raw;

    try {
      raw = fs.readFileSync(skillMd, 'utf8');
    } catch (err) {
      throw new Error(`grade-routing: cannot read ${skillMd} for the heading set (fail closed): ${err.message}`);
    }

    for (const line of raw.split('\n')) {
      const m = /^#{2,3}\s+(.+?)\s*$/.exec(line);

      if (m && m[1].length >= MIN_HEADING_LENGTH) {
        headings.add(m[1]);
      }
    }
  }

  if (headings.size === 0) {
    throw new Error(
      `grade-routing: derived ZERO section headings from ${skillsDir}; the judge-blinding pass would be ` +
        'vacuous and a leak would go unstripped (fail closed)',
    );
  }

  // Longest first, so a heading that is a prefix of another cannot mask it.
  return [...headings].sort((a, b) => b.length - a.length);
}

export function normalizeForJudge(answerText, headings) {
  const original = String(answerText || '');
  const headingList = Array.isArray(headings) ? headings : shippedSectionHeadings();
  const fired = [];
  let pathHits = 0;
  let headingHits = 0;
  let text = original;

  text = text.replace(PLUGIN_ROOT_RE, () => {
    pathHits += 1;

    return PATH_PLACEHOLDER;
  });
  text = text.replace(REFERENCE_PATH_RE, () => {
    pathHits += 1;

    return PATH_PLACEHOLDER;
  });

  for (const heading of headingList) {
    if (heading.length < MIN_HEADING_LENGTH) {
      continue;
    }

    text = text.replace(phraseReAll(heading), () => {
      headingHits += 1;

      return HEADING_PLACEHOLDER;
    });
  }

  if (pathHits > 0) {
    fired.push('reference-path');
  }

  if (headingHits > 0) {
    fired.push('section-heading');
  }

  return {
    text,
    fired,
    counts: { referencePath: pathHits, sectionHeading: headingHits },
    changed: text !== original,
  };
}

// ---- the corpus and the expected label ---------------------------------------------------------

function readJsonOrThrow(p, label) {
  let raw;

  try {
    raw = fs.readFileSync(p, 'utf8');
  } catch (err) {
    throw new Error(`grade-routing: cannot read ${label} ${p} (fail closed): ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`grade-routing: garbled ${label} ${p} (fail closed): ${err.message}`);
  }
}

export function loadCorpus(corpusPath = CORPUS_PATH) {
  const doc = readJsonOrThrow(corpusPath, 'rgr-cases.json');

  if (!doc || !Array.isArray(doc.cases) || doc.cases.length === 0) {
    throw new Error(`grade-routing: ${corpusPath} carries no cases[] (fail closed)`);
  }

  return doc.cases;
}

// The expected LABEL for a case: the ordered pair when a second hop is declared, else the single
// owner (which may be the residual NONE).
export function expectedLabelFor(caseSpec) {
  if (!caseSpec || typeof caseSpec.expectedOwner !== 'string') {
    throw new Error(`grade-routing: corpus case ${JSON.stringify(caseSpec && caseSpec.id)} has no expectedOwner (fail closed)`);
  }

  return caseSpec.expectedSecondHop ? caseSpec.expectedOwner + HOP + caseSpec.expectedSecondHop : caseSpec.expectedOwner;
}

// ---- the verdict router ------------------------------------------------------------------------

// The ONE question a blind judge is asked, per unresolved run. One dimension, one label, and
// deliberately no mention of what the expected label is -- that is what keeps the judge blind.
const JUDGE_QUESTION =
  'Which single skill, if any, does this answer designate as the owner of the request -- lz-red, ' +
  'lz-tpp, lz-refactor, an ordered handoff of two of them, or none of the three? Answer with the ' +
  'label only.';

// Unique per run, because merge-judge.mjs matches a verdict to an expectation by this exact string
// and refuses duplicates outright.
function expectationText(runKey) {
  return `${JUDGE_QUESTION} [run ${runKey}]`;
}

function runKeyOf(meta) {
  return `${meta.arm}/${meta.prompt_id}/run-${meta.run_idx}`;
}

// Fail-closed input validation. Every one of these would otherwise produce a plausible-looking score
// for a run nobody can interpret afterwards.
function assertGradeable(answerText, meta, label) {
  if (!meta || typeof meta !== 'object') {
    throw new Error(`grade-routing: ${label} has no meta object (fail closed)`);
  }

  for (const key of ['prompt_id', 'arm']) {
    if (typeof meta[key] !== 'string' || meta[key] === '') {
      throw new Error(`grade-routing: ${label} meta is missing a string '${key}' (fail closed)`);
    }
  }

  if (!Number.isInteger(meta.run_idx) || meta.run_idx < 1) {
    throw new Error(`grade-routing: ${label} meta has no positive integer 'run_idx' (fail closed)`);
  }

  if (typeof meta.routing_table_read !== 'boolean') {
    throw new Error(
      `grade-routing: ${label} meta has no boolean 'routing_table_read' -- it predates the retrieval ` +
        'instrumentation, so its read rate is unmeasurable and a pass rate cannot be read against it. ' +
        'Re-capture the run with the current run-e2e.mjs (fail closed)',
    );
  }

  const text = String(answerText || '');

  if (text.trim() === '') {
    throw new Error(`grade-routing: ${label} answer is empty (fail closed -- an empty answer is not a zero-destination answer)`);
  }

  if (text.trim() === NO_RESULT_SENTINEL) {
    throw new Error(
      `grade-routing: ${label} answer is run-e2e.mjs's no-result sentinel, so the run captured no ` +
        'model text at all (fail closed)',
    );
  }

  if (meta.exit_code !== undefined && meta.exit_code !== null && meta.exit_code !== 0) {
    throw new Error(
      `grade-routing: ${label} exited ${meta.exit_code}; a non-zero run is a tool error, not a graded ` +
        'answer (fail closed)',
    );
  }
}

// Grade ONE run. Shared by the real gate and --selfcheck; only where answerText/meta come from
// differs. Returns the per-run record the artifact is assembled from.
export function gradeOne(answerText, meta, caseSpec, { headings } = {}) {
  const runKey = runKeyOf(meta || {});
  assertGradeable(answerText, meta, runKey);
  const expected = expectedLabelFor(caseSpec);
  const destination = extractDestination(answerText);
  const normalized = normalizeForJudge(answerText, headings);
  const text = expectationText(runKey);
  let passed = null;
  let evidence = '';

  if (destination.cardinality === 'exactly-one' && !expected.includes(HOP)) {
    passed = destination.label === expected;
    evidence =
      `deterministic: the answer affirms exactly one destination (${destination.label}) and the case ` +
      `expects ${expected}`;
  } else if (destination.cardinality === 'exactly-one') {
    // No single label can equal an ordered pair, so resolving here could only FAIL -- and an answer
    // that names the correct first hop and describes the second without its slug is not wrong.
    evidence =
      `judge: the answer affirms one destination (${destination.label}) on an ordered two-hop case ` +
      `expecting ${expected}; a single name cannot be compared to an ordered pair mechanically`;
  } else if (destination.cardinality === 'zero') {
    if (expected === NONE_LABEL) {
      passed = true;
      evidence =
        'deterministic: the answer affirms no destination and this is the declared residual case, ' +
        'which expects NONE';
    } else {
      evidence =
        `judge: the answer affirms no destination but the case expects ${expected}; a coaching answer ` +
        'that solves the problem without naming a skill is ambiguous, not automatically wrong';
    }
  } else {
    evidence =
      `judge: the answer affirms ${destination.affirmed.length} destinations in order ` +
      `(${destination.affirmed.join(', ')}) and the case expects ${expected}; a legitimate ordered ` +
      'handoff and a hedge between alternatives are not mechanically separable';
  }

  return {
    runKey,
    expectation: { text, passed, evidence },
    routing: {
      case_id: meta.prompt_id,
      arm: meta.arm,
      run_idx: meta.run_idx,
      expected_label: expected,
      extracted_label: destination.label,
      cardinality: destination.cardinality,
      affirmed: destination.affirmed,
      routing_table_read: meta.routing_table_read,
      routing_table_read_path: meta.routing_table_read_path === undefined ? null : meta.routing_table_read_path,
      normalization_fired: normalized.fired,
      normalization_counts: normalized.counts,
    },
    // The judge's input, assembled here so the judge step never has to re-derive it and never sees
    // the expected label. `text` is the merge key merge-judge.mjs will match a verdict against.
    judgeInput:
      passed === null
        ? {
            text,
            question: JUDGE_QUESTION,
            labels: [...SKILL_LABELS, 'an ordered handoff of two of them', NONE_LABEL],
            normalized_answer: normalized.text,
            normalization_fired: normalized.fired,
            normalization_counts: normalized.counts,
          }
        : null,
  };
}

// ---- artifact assembly (fail-closed) -----------------------------------------------------------

// Never emit a FINAL-looking grading artifact while judge items remain. Same shape as the sibling
// grader's guard: the caller asks for a final path and gets a PRELIMINARY sibling instead, so an
// unresolved run cannot be mistaken for a scored one by anything downstream.
export function finalOutPath(outArg, judgeCount) {
  return judgeCount > 0 ? path.join(path.dirname(outArg), PRELIMINARY_GRADE_FILE) : outArg;
}

export function assembleArtifact(records) {
  const expectations = records.map((r) => r.expectation);
  const judgeRequired = expectations.filter((e) => e.passed === null).map((e) => e.text);
  const resolved = expectations.filter((e) => e.passed !== null);
  const passedCount = resolved.filter((e) => e.passed === true).length;
  const total = resolved.length;

  return {
    expectations,
    summary: { passed: passedCount, failed: total - passedCount, total, pass_rate: total ? passedCount / total : 0 },
    preliminary: judgeRequired.length > 0,
    judge_required: judgeRequired,
    // `pass` exists for the rollup walker, which joins a per-run meta.json with a per-run grade file
    // and requires a boolean. It is null while anything is unresolved, and the artifact is written to
    // the PRELIMINARY path in that case -- so a walker pointed at the final filename fails closed on
    // a missing file rather than tabulating an ungraded run.
    pass: judgeRequired.length > 0 ? null : expectations.every((e) => e.passed === true),
    routing: records.map((r) => r.routing),
    judge_inputs: records.map((r) => r.judgeInput).filter(Boolean),
  };
}

function writeArtifact(outArg, artifact) {
  const outPath = finalOutPath(outArg, artifact.judge_required.length);

  // Remove a stale FINAL artifact from a prior grading of the same run, so nothing downstream can
  // count it as a completed score after this pass decided a judge is needed.
  if (artifact.judge_required.length > 0 && fs.existsSync(outArg) && outArg !== outPath) {
    fs.rmSync(outArg);
  }

  fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2) + '\n');

  return outPath;
}

// ---- the real gate (post-run over captured artifacts) ------------------------------------------

function gradeRunDir(runDir, cases, headings) {
  const metaPath = path.join(runDir, 'meta.json');
  const answerPath = path.join(runDir, 'answer.md');
  const meta = readJsonOrThrow(metaPath, 'meta.json');
  let answerText;

  try {
    answerText = fs.readFileSync(answerPath, 'utf8');
  } catch (err) {
    throw new Error(`grade-routing: cannot read answer.md ${answerPath} (fail closed): ${err.message}`);
  }

  const caseSpec = cases.find((c) => c.id === meta.prompt_id);

  if (!caseSpec) {
    throw new Error(
      `grade-routing: run ${runDir} names case '${meta.prompt_id}', which is absent from the corpus ` +
        `(have ${cases.map((c) => c.id).join(', ')}) -- the prompts and the corpus have DIVERGED, which ` +
        'is a measurement error rather than a missing file (fail closed)',
    );
  }

  return gradeOne(answerText, meta, caseSpec, { headings });
}

function collectRunDirs(suiteDir) {
  const root = path.join(suiteDir, 'results', 'recommend');
  const runDirs = [];

  if (!fs.existsSync(root)) {
    return runDirs;
  }

  for (const arm of fs.readdirSync(root)) {
    const armDir = path.join(root, arm);

    if (!fs.statSync(armDir).isDirectory()) {
      continue;
    }

    for (const caseId of fs.readdirSync(armDir)) {
      const caseDir = path.join(armDir, caseId);

      if (!fs.statSync(caseDir).isDirectory()) {
        continue;
      }

      for (const run of fs.readdirSync(caseDir)) {
        const dir = path.join(caseDir, run);

        if (fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, 'meta.json'))) {
          runDirs.push(dir);
        }
      }
    }
  }

  return runDirs.sort();
}

// ---- offline selfcheck (zero spend) ------------------------------------------------------------

function runSelfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error(`grade-routing --selfcheck: FAIL -- ${msg}`);
    } else {
      console.log(`  [ok] ${msg}`);
    }
  };
  const assertThrows = (fn, msg) => {
    let threw = false;

    try {
      fn();
    } catch {
      threw = true;
    }

    assert(threw, msg);
  };

  const cases = loadCorpus();
  const fixtures = readJsonOrThrow(path.join(FIXTURE_DIR, 'fixtures.json'), 'fixtures.json');
  // A hermetic heading set: the selfcheck must not depend on the shipped tree's current wording, and
  // an empty or wrong list here would silently make the normalization legs vacuous.
  const headings = fixtures.judge_blinding_headings;
  assert(Array.isArray(headings) && headings.length > 0, `fixtures declare ${headings ? headings.length : 0} blinding heading(s)`);

  const byName = new Map();

  for (const f of fixtures.fixtures) {
    const answerPath = path.join(FIXTURE_DIR, 'answers', f.answer_file);
    byName.set(f.name, { ...f, answerText: fs.readFileSync(answerPath, 'utf8') });
  }

  const grade = (name) => {
    const f = byName.get(name);

    if (!f) {
      throw new Error(`selfcheck: no fixture named ${name}`);
    }

    const caseSpec = cases.find((c) => c.id === f.meta.prompt_id);

    return gradeOne(f.answerText, f.meta, caseSpec, { headings });
  };

  // 1. exactly-one resolves DETERMINISTICALLY and correctly.
  const correct = grade('single-correct');
  assert(correct.routing.cardinality === 'exactly-one', 'an answer naming one skill is cardinality exactly-one');
  assert(correct.expectation.passed === true, `exactly-one matching the expected label PASSES deterministically (${correct.routing.extracted_label})`);
  assert(correct.judgeInput === null, 'a deterministically resolved run sends nothing to the judge');

  // 2. exactly-one against the WRONG expected label FAILS deterministically -- same answer bytes,
  //    different case, so this proves the comparison is to the corpus and not to the text.
  const wrong = grade('single-wrong');
  assert(
    wrong.expectation.passed === false && wrong.routing.extracted_label === correct.routing.extracted_label,
    `the same answer FAILS deterministically against a case expecting ${wrong.routing.expected_label}`,
  );

  // 3. a skill named ONLY inside an exclusion clause is NOT counted as a destination. This is the
  //    load-bearing leg: without it the grader would reproduce the incidental-mention ceiling.
  const exclusion = grade('exclusion-clause');
  assert(
    exclusion.routing.cardinality === 'exactly-one' && exclusion.routing.extracted_label === 'lz-red',
    'a skill mentioned only in an exclusion clause is not affirmed (cardinality stays exactly-one)',
  );
  assert(exclusion.expectation.passed === true, 'the exclusion-clause answer still resolves to the correct destination');

  // 4. two names in order -> unresolved, never guessed.
  const twoHop = grade('two-hop');
  assert(twoHop.routing.cardinality === 'multiple', 'an answer naming two skills is cardinality multiple');
  assert(twoHop.expectation.passed === null, 'multiple is emitted as unresolved rather than guessed');
  assert(
    twoHop.routing.extracted_label === twoHop.routing.expected_label,
    `the ORDER is preserved, so the informational label reads ${twoHop.routing.extracted_label}`,
  );
  assert(twoHop.judgeInput !== null && twoHop.judgeInput.normalized_answer.length > 0, 'the unresolved run carries a judge input');
  assert(
    !JSON.stringify(twoHop.judgeInput).includes('expected'),
    'the judge input does NOT carry the expected label (the judge stays blind)',
  );

  // 4b. ONE name on the two-hop case -> unresolved. No single label can equal an ordered pair, so a
  //     deterministic comparison here could only ever FAIL, and an answer naming the correct first
  //     hop would score worse than one naming no skill at all.
  const oneHop = gradeOne(
    'Write the failing test first; that is the job of lz-red. Then make it pass with the smallest change.',
    { ...byName.get('two-hop').meta, run_idx: 2 },
    cases.find((c) => c.id === 'c4'),
    { headings },
  );
  assert(oneHop.routing.cardinality === 'exactly-one', 'a two-hop answer naming only the first hop is cardinality exactly-one');
  assert(oneHop.expectation.passed === null, 'exactly-one on the ordered two-hop case is unresolved, not a deterministic FAIL');

  // 5. zero names -> unresolved on a NON-residual case.
  const noName = grade('no-name-coaching');
  assert(noName.routing.cardinality === 'zero', 'an answer naming no skill is cardinality zero');
  assert(noName.expectation.passed === null, 'zero on a non-residual case is unresolved, not an automatic fail');

  // 6. zero names -> deterministic PASS on the residual case.
  const residual = grade('residual-declined');
  assert(residual.routing.expected_label === NONE_LABEL, 'the residual fixture targets the case expecting NONE');
  assert(residual.expectation.passed === true, 'zero on the residual case PASSES deterministically');

  // 7. a LONGER name that merely starts with a tracked name is refused.
  const longer = grade('longer-name');
  assert(
    longer.routing.affirmed.length === 0 && longer.routing.cardinality === 'zero',
    'a longer name starting with a tracked name affirms nothing (the boundary class refuses it)',
  );
  assert(!extractDestination('use lz-redux for state').affirmed.includes('lz-red'), 'lz-redux does not match lz-red');
  assert(!extractDestination('see .claude/skills/lz-red-workspace/x').affirmed.includes('lz-red'), 'lz-red-workspace does not match lz-red');
  assert(extractDestination('hand it to lz-red').affirmed.includes('lz-red'), 'positive control: a bare lz-red DOES match');

  // 8. fail-closed: an empty answer, the no-result sentinel, a non-zero exit, a pre-instrumentation
  //    meta, and a case id absent from the corpus all throw instead of scoring.
  assertThrows(() => grade('empty-answer'), 'the no-result sentinel answer throws rather than scoring');
  assertThrows(() => grade('tool-error'), 'a non-zero exit_code throws rather than scoring');
  assertThrows(() => {
    const f = byName.get('single-correct');
    const stale = { ...f.meta };
    delete stale.routing_table_read;
    gradeOne(f.answerText, stale, cases.find((c) => c.id === f.meta.prompt_id), { headings });
  }, 'a meta predating the retrieval instrumentation throws (its read rate is unmeasurable)');
  assertThrows(() => {
    const f = byName.get('single-correct');
    gradeOne(f.answerText, f.meta, { id: 'cX' }, { headings });
  }, 'a corpus case with no expectedOwner throws');
  assertThrows(() => gradeOne('  ', byName.get('single-correct').meta, cases[0], { headings }), 'a whitespace-only answer throws');

  // 9. normalizeForJudge strips BOTH leak kinds and REPORTS which fired.
  const leaky = grade('leaky-answer');
  assert(
    leaky.routing.normalization_fired.includes('reference-path') && leaky.routing.normalization_fired.includes('section-heading'),
    `both leak kinds fired and are reported (${leaky.routing.normalization_fired.join(', ')})`,
  );
  assert(
    leaky.routing.normalization_counts.referencePath > 0 && leaky.routing.normalization_counts.sectionHeading > 0,
    `the counts are reported, not just a boolean (path ${leaky.routing.normalization_counts.referencePath}, heading ${leaky.routing.normalization_counts.sectionHeading})`,
  );
  const leakyNorm = normalizeForJudge(byName.get('leaky-answer').answerText, headings);
  assert(!/rgr-routing\.md/i.test(leakyNorm.text), 'the shared table path is gone from the judge input');
  assert(!/PLUGIN_ROOT/.test(leakyNorm.text), 'the plugin-root variable is gone from the judge input');
  assert(!leakyNorm.text.includes(headings[0]), `the recited section heading is gone from the judge input (${headings[0]})`);
  assert(leakyNorm.text.includes(PATH_PLACEHOLDER) && leakyNorm.text.includes(HEADING_PLACEHOLDER), 'both leaks are replaced by neutral placeholders, not deleted');
  const clean = normalizeForJudge('hand it to lz-refactor once the bar is green', headings);
  assert(clean.fired.length === 0 && clean.changed === false, 'an answer with no leak reports NO normalization (the pass is not vacuous)');
  assert(clean.text.includes('lz-refactor'), 'normalization never strips a bare destination name');

  // 10. the grader REFUSES to write a final-looking artifact while any run is unresolved.
  const mixed = assembleArtifact([correct, twoHop]);
  assert(mixed.preliminary === true && mixed.judge_required.length === 1, 'a mixed batch is marked preliminary with the unresolved run listed');
  assert(mixed.pass === null, 'pass is null while anything is unresolved');
  assert(
    finalOutPath(path.join('x', GRADE_FILE), mixed.judge_required.length).endsWith(PRELIMINARY_GRADE_FILE),
    'judge items remaining -> the PRELIMINARY path, never the requested final one',
  );
  const allResolved = assembleArtifact([correct, residual]);
  assert(allResolved.preliminary === false && allResolved.judge_required.length === 0, 'a fully resolved batch is final');
  assert(allResolved.pass === true, 'pass is a boolean once every run resolved');
  assert(finalOutPath(path.join('x', GRADE_FILE), 0).endsWith(GRADE_FILE), 'no judge items -> the requested final path is honored');
  assert(new Set(mixed.expectations.map((e) => e.text)).size === mixed.expectations.length, 'expectation texts are UNIQUE per run (merge-judge refuses duplicates)');
  assert(
    mixed.expectations.every((e) => typeof e.text === 'string' && typeof e.evidence === 'string' && (typeof e.passed === 'boolean' || e.passed === null)),
    'the artifact shape is what merge-judge.mjs consumes: expectations[{text,passed,evidence}] + summary + preliminary + judge_required',
  );

  // 11. the retrieval fact is carried into the grade, per run.
  assert(
    typeof correct.routing.routing_table_read === 'boolean' && leaky.routing.routing_table_read === true,
    'each graded run carries the routing_table_read fact, so the read rate can be reported next to the pass rate',
  );

  console.log('');

  // The SUMMARY line must never read OK on a failing run. An unconditional success sentence is how a
  // report starts contradicting its own exit code, and this repo reads summary lines.
  if (ok) {
    console.log(
      `grade-routing --selfcheck: OK -- destination extraction (word-bounded + negation-aware), the three ` +
        `cardinality classes, deterministic pass/fail against the corpus, judge routing for multiple and ` +
        `zero, the longer-name refusal, five fail-closed paths, two-leak judge blinding with its firing ` +
        `report, the preliminary-path guard and the retrieval fact all verified over ${byName.size} ` +
        'hand-authored fixtures; zero spend.',
    );
  } else {
    console.error(
      `grade-routing --selfcheck: RED -- at least one assertion above failed over ${byName.size} fixtures. ` +
        'Do NOT grade a captured round with this grader until it is GREEN.',
    );
  }

  process.exit(ok ? 0 : 1);
}

// ---- main --------------------------------------------------------------------------------------

function argVal(argv, flag) {
  const i = argv.indexOf(flag);

  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null;
}

function main(argv) {
  if (argv.includes('--selfcheck')) {
    runSelfcheck();

    return;
  }

  const runArg = argVal(argv, '--run');
  const suiteArg = argVal(argv, '--suite');

  if (!runArg && !suiteArg) {
    console.error('usage: node grade-routing.mjs --selfcheck | --run <runDir> [--out <path>] | --suite <suiteDir>');
    process.exit(2);
  }

  const cases = loadCorpus();
  const headings = shippedSectionHeadings();

  if (runArg) {
    const record = gradeRunDir(runArg, cases, headings);
    const artifact = assembleArtifact([record]);
    const outPath = writeArtifact(argVal(argv, '--out') || path.join(runArg, GRADE_FILE), artifact);
    const state = artifact.preliminary ? 'PRELIMINARY -- needs a blind judge' : `pass=${artifact.pass}`;
    console.log(`graded ${record.runKey}: ${record.routing.extracted_label} vs expected ${record.routing.expected_label} [${state}] -> ${outPath}`);

    return;
  }

  const runDirs = collectRunDirs(suiteArg);

  if (!runDirs.length) {
    console.log(`no captured runs under ${path.join(suiteArg, 'results', 'recommend')} -- nothing to grade.`);

    return;
  }

  let judgeCount = 0;

  for (const dir of runDirs) {
    const record = gradeRunDir(dir, cases, headings);
    const artifact = assembleArtifact([record]);
    const outPath = writeArtifact(path.join(dir, GRADE_FILE), artifact);

    if (artifact.preliminary) {
      judgeCount += 1;
    }

    console.log(`  ${record.runKey}: ${record.routing.extracted_label} vs ${record.routing.expected_label} -> ${path.basename(outPath)}`);
  }

  console.log(
    `\ngraded ${runDirs.length} run(s); ${judgeCount} need a blind judge and were written to ` +
      `${PRELIMINARY_GRADE_FILE} rather than ${GRADE_FILE}. A rollup over ${GRADE_FILE} therefore fails ` +
      'closed on those runs instead of tabulating them.',
  );
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main(process.argv.slice(2));
}
