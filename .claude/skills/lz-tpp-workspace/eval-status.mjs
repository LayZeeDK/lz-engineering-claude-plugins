#!/usr/bin/env node
// Resume/status map for EVAL-02 behavior runs. Shows, per target scenario/config/run, which
// durable artifacts exist -- so an interrupted run resumes by re-spawning ONLY the runs missing a
// transcript. A completed run (transcript on disk) is never lost: metrics re-derive from the
// scratch dir, grading re-derives from the transcript. Usage:
//   node eval-status.mjs <iteration-dir> [--evals eval-2-...,eval-3-...] [--runs 3]
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const iter = args[0];

if (!iter || !fs.existsSync(iter)) {
  console.error("usage: node eval-status.mjs <iteration-dir> [--evals slugA,slugB] [--runs N]");
  process.exit(2);
}

const evalsArg = (() => {
  const i = args.indexOf("--evals");
  return i >= 0 ? args[i + 1].split(",") : fs.readdirSync(iter).filter((d) => d.startsWith("eval-") && fs.statSync(path.join(iter, d)).isDirectory());
})();
const runsExpected = (() => {
  const i = args.indexOf("--runs");
  return i >= 0 ? Number(args[i + 1]) : 3;
})();

const exists = (p) => fs.existsSync(p);
const nonEmpty = (p) => {
  try {
    return fs.statSync(p).size > 0;
  } catch {
    return false;
  }
};

let done = 0;
let partial = 0;
let missing = 0;

for (const slug of evalsArg) {
  console.log(`\n${slug}`);

  for (const cfg of ["with_skill", "without_skill"]) {
    for (let k = 1; k <= runsExpected; k++) {
      const run = path.join(iter, slug, cfg, `run-${k}`);
      const t = exists(path.join(run, "outputs", "transcript.md")) && nonEmpty(path.join(run, "outputs", "transcript.md"));
      const tim = exists(path.join(run, "timing.json"));
      const met = exists(path.join(run, "metrics.json"));
      const gFinal = exists(path.join(run, "grading.json"));
      const gPrelim = exists(path.join(run, "grading.preliminary.json"));

      let state;

      if (!t) {
        state = "MISSING (respawn)";
        missing++;
      } else if (gFinal) {
        state = "DONE (final grading.json)";
        done++;
      } else {
        state = `PARTIAL [transcript=Y timing=${tim ? "Y" : "n"} metrics=${met ? "Y" : "n"} grading=${gFinal ? "final" : gPrelim ? "preliminary" : "n"}] -- recoverable from transcript`;
        partial++;
      }

      console.log(`  ${cfg}/run-${k}: ${state}`);
    }
  }
}

const total = done + partial + missing;
console.log(`\nSUMMARY: ${done} done, ${partial} partial(recoverable), ${missing} missing/to-run  (of ${total} target runs)`);
console.log(missing === 0 && partial === 0 ? "ALL TARGET RUNS COMPLETE" : "resume: transcripts persist on disk; re-spawn only MISSING runs, then grade/merge the rest");
