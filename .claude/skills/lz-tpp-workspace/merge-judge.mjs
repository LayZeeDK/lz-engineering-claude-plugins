#!/usr/bin/env node
// Fail-closed LLM-judge MERGE + pre-aggregate completeness GATE for lz-tpp BEHAVIOR evals (EVAL-02).
//
// grade-run.mjs is a deterministic PRE-FILTER: it scores the objective checks and emits every
// nuanced expectation as passed:null in a grading.PRELIMINARY.json with judge_required:[texts].
// It STRUCTURALLY refuses to write a final grading.json while judge items remain. This script is
// the second half of the flow -- it turns a preliminary + the LLM judge's verdicts into the final
// grading.json that aggregate_benchmark.py reads, and it guards the aggregate boundary.
//
// The LLM judging itself is NOT done here (it is an agent step -- skill-creator agents/grader.md --
// spawned per run in the EVAL-02 runner). That step reads the coach transcript + the judge_required
// questions and writes judge-verdicts.json. This script only CONSUMES those verdicts, so the merge
// stays deterministic and testable.
//
// Modes:
//   --merge --preliminary <grading.preliminary.json> --verdicts <judge-verdicts.json> --out <grading.json>
//       Resolve judge_required, recompute summary over ALL expectations, write final grading.json.
//       Refuses (writes nothing, exits 3) unless EVERY judge_required text has exactly one verdict
//       with a strict boolean `passed`; refuses unknown/duplicate verdict texts; refuses if any
//       expectation would remain passed:null; refuses a preliminary that is already final.
//
//   --verify <iteration-dir>
//       Pre-aggregate GATE. Walks the same run dirs aggregate_benchmark.py globs (eval-*/<config>/run-*)
//       and ERRORS (exit 1) if ANY run dir lacks a final grading.json -- i.e. missing, still
//       preliminary, still has judge_required, or still has a passed:null expectation. This is what
//       stops aggregate from SILENTLY skipping an unmerged run (aggregate only prints a warning and
//       drops it from the denominator -- a scored-only false pass). Run this BEFORE aggregate; a
//       non-zero exit means "do not aggregate".
//
//   --selfcheck
//
// judge-verdicts.json shape (array, or { "verdicts": [...] }):
//   [ { "text": "<one of the judge_required questions, verbatim>", "passed": true|false, "evidence": "..." } ]
//
// Final grading.json shape stays exactly what aggregate_benchmark.py + the viewer read:
//   { expectations:[{text,passed,evidence}], summary:{passed,failed,total,pass_rate},
//     preliminary:false, judge_required:[] }

import fs from "node:fs";
import path from "node:path";

class MergeError extends Error {}

function recomputeSummary(expectations) {
  const passed = expectations.filter((e) => e.passed === true).length;
  const total = expectations.length;

  return { passed, failed: total - passed, total, pass_rate: total ? passed / total : 0 };
}

// Pure: preliminary object + verdicts array -> final grading object. Throws MergeError on any refusal.
function mergeVerdicts(prelim, verdicts) {
  if (!prelim || typeof prelim !== "object" || !Array.isArray(prelim.expectations)) {
    throw new MergeError("preliminary is not a valid grading object (missing expectations[])");
  }

  const required = Array.isArray(prelim.judge_required) ? prelim.judge_required : [];

  if (prelim.preliminary !== true || required.length === 0) {
    throw new MergeError("preliminary is already final (preliminary!=true or judge_required is empty) -- nothing to merge");
  }

  if (new Set(required).size !== required.length) {
    throw new MergeError("judge_required contains duplicate texts -- cannot match verdicts unambiguously");
  }

  const list = Array.isArray(verdicts) ? verdicts : Array.isArray(verdicts && verdicts.verdicts) ? verdicts.verdicts : null;

  if (!list) {
    throw new MergeError("verdicts is not an array (expected [{text,passed,evidence}] or {verdicts:[...]})");
  }

  const byText = new Map();

  for (const v of list) {
    if (!v || typeof v.text !== "string") {
      throw new MergeError("a verdict is missing a string `text`");
    }

    if (typeof v.passed !== "boolean") {
      throw new MergeError(`verdict for ${JSON.stringify(v.text)} has non-boolean passed (${JSON.stringify(v.passed)}) -- the judge must decide true/false`);
    }

    if (!required.includes(v.text)) {
      throw new MergeError(`verdict text not in judge_required (unknown/hallucinated): ${JSON.stringify(v.text)}`);
    }

    if (byText.has(v.text)) {
      throw new MergeError(`duplicate verdict for text: ${JSON.stringify(v.text)}`);
    }

    byText.set(v.text, v);
  }

  const missing = required.filter((t) => !byText.has(t));

  if (missing.length > 0) {
    throw new MergeError(`judge_required items with no verdict: ${missing.map((t) => JSON.stringify(t)).join(", ")}`);
  }

  const expectations = prelim.expectations.map((e) => {
    if (e.passed !== null) {
      return e;
    }

    const v = byText.get(e.text);

    if (!v) {
      throw new MergeError(`no verdict matched the passed:null expectation ${JSON.stringify(e.text)}`);
    }

    return { text: e.text, passed: v.passed, evidence: typeof v.evidence === "string" && v.evidence ? `LLM judge: ${v.evidence}` : "LLM judge: (no rationale provided)" };
  });

  const stillNull = expectations.filter((e) => e.passed === null);

  if (stillNull.length > 0) {
    throw new MergeError(`${stillNull.length} expectation(s) still passed:null after merge -- refusing to emit a final grading.json`);
  }

  const merged = { expectations, summary: recomputeSummary(expectations), preliminary: false, judge_required: [] };

  return merged;
}

// Pure: assess whether a parsed grading.json is a FINAL, aggregate-safe result.
function assessRunFinal(grading) {
  if (grading === null) {
    return { ok: false, reason: "grading.json not found (unmerged or ungraded run)" };
  }

  if (typeof grading !== "object" || !Array.isArray(grading.expectations)) {
    return { ok: false, reason: "grading.json is malformed (missing expectations[])" };
  }

  if (grading.preliminary === true) {
    return { ok: false, reason: "grading.json is still marked preliminary:true (judge merge not run)" };
  }

  if (Array.isArray(grading.judge_required) && grading.judge_required.length > 0) {
    return { ok: false, reason: `grading.json still has ${grading.judge_required.length} unresolved judge_required item(s)` };
  }

  const nulls = grading.expectations.filter((e) => e.passed === null).length;

  if (nulls > 0) {
    return { ok: false, reason: `grading.json has ${nulls} expectation(s) with passed:null` };
  }

  return { ok: true, reason: "" };
}

const isDir = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

// Mirror aggregate_benchmark.py globbing: <iter>[/runs]/eval-*/<config>/run-*
function collectRunDirs(iterationDir) {
  const runsDir = path.join(iterationDir, "runs");
  const searchDir = isDir(runsDir) ? runsDir : iterationDir;
  const runDirs = [];

  if (!isDir(searchDir)) {
    return runDirs;
  }

  for (const evalName of fs.readdirSync(searchDir)) {
    if (!evalName.startsWith("eval-")) {
      continue;
    }

    const evalDir = path.join(searchDir, evalName);

    if (!isDir(evalDir)) {
      continue;
    }

    for (const cfgName of fs.readdirSync(evalDir)) {
      const cfgDir = path.join(evalDir, cfgName);

      if (!isDir(cfgDir)) {
        continue;
      }

      const runs = fs.readdirSync(cfgDir).filter((r) => r.startsWith("run-") && isDir(path.join(cfgDir, r)));

      if (runs.length === 0) {
        continue; // not a config dir (e.g. inputs/outputs)
      }

      for (const r of runs) {
        runDirs.push(path.join(cfgDir, r));
      }
    }
  }

  return runDirs;
}

function readJsonOrNull(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function verify(iterationDir) {
  if (!isDir(iterationDir)) {
    console.error(`VERIFY ERROR: iteration dir not found: ${iterationDir}`);
    process.exit(1);
  }

  const runDirs = collectRunDirs(iterationDir);

  if (runDirs.length === 0) {
    console.error(`VERIFY ERROR: no eval-*/<config>/run-* dirs under ${iterationDir} -- nothing to aggregate`);
    process.exit(1);
  }

  const failures = [];

  for (const runDir of runDirs) {
    const gradingPath = path.join(runDir, "grading.json");
    const prelimPath = path.join(runDir, "grading.preliminary.json");

    if (!fs.existsSync(gradingPath)) {
      const reason = fs.existsSync(prelimPath) ? "only grading.preliminary.json present (LLM-judge merge not run)" : "grading.json not found (ungraded run)";
      failures.push({ runDir, reason });
      continue;
    }

    const grading = readJsonOrNull(gradingPath);

    if (grading === null) {
      failures.push({ runDir, reason: "grading.json is not valid JSON" });
      continue;
    }

    const a = assessRunFinal(grading);

    if (!a.ok) {
      failures.push({ runDir, reason: a.reason });
    }
  }

  if (failures.length > 0) {
    console.error(`VERIFY FAILED: ${failures.length}/${runDirs.length} run dir(s) are not aggregate-safe (do NOT run aggregate):`);

    for (const f of failures) {
      console.error(`  - ${f.runDir}: ${f.reason}`);
    }

    process.exit(1);
  }

  console.log(`VERIFY OK: all ${runDirs.length} run dir(s) have a final grading.json (preliminary:false, judge_required:[], no passed:null)`);
}

function selfcheck() {
  let ok = true;
  const assert = (cond, msg) => {
    if (!cond) {
      ok = false;
      console.error("SELFCHECK FAIL:", msg);
    }
  };
  const throws = (fn, rx, msg) => {
    try {
      fn();
      assert(false, `${msg} (expected a MergeError, none thrown)`);
    } catch (e) {
      assert(e instanceof MergeError && rx.test(e.message), `${msg} (got: ${e.message})`);
    }
  };

  // A representative preliminary: 1 scored pass + 2 judge nulls (shape grade-run.mjs emits).
  const prelim = () => ({
    expectations: [
      { text: "Names (a -> b)", passed: true, evidence: "present" },
      { text: "Q1 nuance", passed: null, evidence: "LLM-JUDGE REQUIRED" },
      { text: "Q2 nuance", passed: null, evidence: "LLM-JUDGE REQUIRED" },
    ],
    summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 },
    preliminary: true,
    judge_required: ["Q1 nuance", "Q2 nuance"],
  });

  // Happy path: both judge items resolved -> final over ALL 3 expectations.
  const merged = mergeVerdicts(prelim(), [
    { text: "Q1 nuance", passed: true, evidence: "line 4" },
    { text: "Q2 nuance", passed: false, evidence: "did the opposite" },
  ]);
  assert(merged.preliminary === false, "merge sets preliminary:false");
  assert(merged.judge_required.length === 0, "merge clears judge_required");
  assert(merged.expectations.every((e) => e.passed !== null), "no passed:null remains after merge");
  assert(merged.summary.total === 3, "summary recomputed over ALL expectations (not just scored)");
  assert(merged.summary.passed === 2 && merged.summary.failed === 1, "summary counts merged verdicts (2 pass / 1 fail)");
  assert(Math.abs(merged.summary.pass_rate - 2 / 3) < 1e-9, "pass_rate = 2/3 over all expectations");
  assert(/LLM judge: line 4/.test(merged.expectations[1].evidence), "verdict evidence carried into expectation");

  // A run that fully passes only when the judge agrees on everything.
  const allPass = mergeVerdicts(prelim(), [
    { text: "Q1 nuance", passed: true, evidence: "ok" },
    { text: "Q2 nuance", passed: true, evidence: "ok" },
  ]);
  assert(allPass.summary.pass_rate === 1, "all-pass run gets pass_rate 1.0 only after judge agrees (Pass@k input)");

  // Refusals -- fail-closed, write nothing.
  throws(() => mergeVerdicts(prelim(), [{ text: "Q1 nuance", passed: true }]), /no verdict/i, "refuse when a judge item has no verdict");
  throws(() => mergeVerdicts(prelim(), [
    { text: "Q1 nuance", passed: true },
    { text: "Q2 nuance", passed: null },
  ]), /non-boolean passed/i, "refuse a non-boolean (null) verdict -- judge must decide");
  throws(() => mergeVerdicts(prelim(), [
    { text: "Q1 nuance", passed: true },
    { text: "Q2 nuance", passed: true },
    { text: "made-up question", passed: true },
  ]), /unknown\/hallucinated/i, "refuse an unknown/hallucinated verdict text");
  throws(() => mergeVerdicts(prelim(), [
    { text: "Q1 nuance", passed: true },
    { text: "Q1 nuance", passed: false },
  ]), /duplicate verdict/i, "refuse duplicate verdicts for one text");

  const already = { expectations: [{ text: "x", passed: true, evidence: "" }], summary: { passed: 1, failed: 0, total: 1, pass_rate: 1 }, preliminary: false, judge_required: [] };
  throws(() => mergeVerdicts(already, []), /already final/i, "refuse to merge an already-final grading.json");

  // assessRunFinal -- the pre-aggregate gate's core predicate.
  assert(assessRunFinal(null).ok === false, "gate: missing grading.json is an ERROR, not a skip");
  assert(/not found/i.test(assessRunFinal(null).reason), "gate: names the not-found condition");
  assert(assessRunFinal(prelim()).ok === false, "gate: a preliminary:true grading.json is not aggregate-safe");
  assert(assessRunFinal({ expectations: [{ text: "x", passed: true }], preliminary: false, judge_required: ["still-open"] }).ok === false, "gate: leftover judge_required is not aggregate-safe");
  assert(assessRunFinal({ expectations: [{ text: "x", passed: null }], preliminary: false, judge_required: [] }).ok === false, "gate: a passed:null expectation is not aggregate-safe");
  assert(assessRunFinal(merged).ok === true, "gate: a fully-merged grading.json is aggregate-safe");

  console.log(ok ? "SELFCHECK OK" : "SELFCHECK FAILED");
  process.exit(ok ? 0 : 1);
}

function parseArgs(argv) {
  const a = {};

  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];

    if (k === "--selfcheck" || k === "--merge") {
      a[k.slice(2)] = true;
    } else if (k.startsWith("--") && k.includes("=")) {
      const idx = k.indexOf("=");
      a[k.slice(2, idx)] = k.slice(idx + 1);
    } else if (k.startsWith("--")) {
      a[k.slice(2)] = argv[++i];
    }
  }

  return a;
}

function runMerge(args) {
  if (!args.preliminary || !args.verdicts || !args.out) {
    console.error("usage: node merge-judge.mjs --merge --preliminary <grading.preliminary.json> --verdicts <judge-verdicts.json> --out <grading.json>");
    process.exit(2);
  }

  let prelim;
  let verdicts;

  try {
    prelim = JSON.parse(fs.readFileSync(args.preliminary, "utf8"));
  } catch (e) {
    console.error(`cannot read/parse --preliminary ${args.preliminary}: ${e.message}`);
    process.exit(2);
  }

  try {
    verdicts = JSON.parse(fs.readFileSync(args.verdicts, "utf8"));
  } catch (e) {
    console.error(`cannot read/parse --verdicts ${args.verdicts}: ${e.message}`);
    process.exit(2);
  }

  let merged;

  try {
    merged = mergeVerdicts(prelim, verdicts);
  } catch (e) {
    if (e instanceof MergeError) {
      console.error(`MERGE REFUSED (fail-closed, nothing written): ${e.message}`);
      process.exit(3);
    }

    throw e;
  }

  try {
    fs.writeFileSync(args.out, JSON.stringify(merged, null, 2) + "\n");
  } catch (e) {
    console.error(`cannot write ${args.out}: ${e.message}`);
    process.exit(2);
  }

  const s = merged.summary;
  console.log(`merged eval -> ${args.out}: ${s.passed}/${s.total} expectations pass (pass_rate ${s.pass_rate.toFixed(3)}); judge items resolved, preliminary cleared`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfcheck) {
    selfcheck();

    return;
  }

  if (args.verify) {
    verify(args.verify);

    return;
  }

  if (args.merge) {
    runMerge(args);

    return;
  }

  console.error("usage: node merge-judge.mjs (--merge ... | --verify <iteration-dir> | --selfcheck)");
  process.exit(2);
}

main();
