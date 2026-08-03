#!/usr/bin/env node
// Semantic routing gate over the plugin's red-green-refactor classifier surfaces (Phase 22,
// CLS-01..CLS-04). Three assertions, every one of them DERIVED from a parsed
// (condition -> destination) table rather than from token presence:
//   (a) exhaustive   -- every case in tools/rgr-cases.json lands on a NAMED owner, and no router
//                       surface keeps a bare "otherwise ... is this skill" terminal (D-01).
//   (b) at-most-one  -- no case is claimed for ITSELF by more than one of the three step-1
//                       procedures (D-02, SC2's literal wording).
//   (c) single-axis  -- no branch in ANY surface, router or mode-selection gate alike, keys on test
//                       state; all key on the ask (D-03).
// Plus two same-file citation checks and a per-skill description budget check. All are HARD
// failures (non-zero exit). Node builtins only, plus the two local libs.
//
// RED AGAINST TODAY'S TREE BY DESIGN -- this is the instrument-first baseline, NOT a failure, and it
// is modelled on check-red-references.mjs's own Wave-0 baseline wording. The classifier that turns
// this gate GREEN is authored in waves 22-03 and 22-04. Concretely RED today because: the beck-seam
// surface still carries its stale two-way heading, so its post-repair heading is absent; four router
// surfaces still end in a bare catch-all terminal; two mode gates plus lz-tpp step 1 still key on
// test state; no branch covers the post-green "what now?" case; and the QUESTION/COMMAND paragraph
// still carries no heading. Do NOT edit shipped Markdown to make this pass, and do NOT weaken an
// assertion to make it pass. The description budget check is the one part GREEN today, on purpose --
// it is a live budget guard for the wave-2 rewording, not a baseline to flip.
//
// COVERAGE BOUNDARY, stated because conflating the two is a recorded failure mode on this repo. This
// gate proves that the AUTHORED classifier is exhaustive, disjoint and single-axis OVER THE CORPUS.
// It does NOT prove that a model ROUTES correctly -- that claim belongs to the metered placement
// eval (CLS-05), which is owner-approval-gated and does not run here. A GREEN verdict from this file
// is a floor, never an acceptance verdict: this phase EXISTS because a 125-check battery went GREEN
// while the classifier was non-exhaustive, and the reviewer measured that ceiling by reverting both
// routing sites while keeping a renamed heading.
//
// FAIL-CLOSED CONTRACT (D-17). Every surface file is read with try/catch -> "", and deliberately NOT
// gated on an existsSync probe -- unlike the SEAM-02 block in check-red-references.mjs, whose own
// header condemns an existsSync-gated post-loop block as a fully silent vacuous pass. An
// emit-nothing path would also make a count-style roster gate fire on the COUNT rather than on the
// guard that found something. The empty string has no heading, so sectionBody returns null, so the
// parse returns ok:false and report() runs EXACTLY ONCE for that surface every run. A null section
// body is never a skip and never a `continue`. The scan floor and corpus floor are the paired
// anti-vacuity checks: an empty surface list or an empty corpus FAILS instead of reading as clean.
//
// This file is a SIBLING of check-red-references.mjs, never an extension of it (D-16). That file
// stays byte-unchanged so its hand-maintained emitted-check arithmetic and its new-label roster are
// not perturbed; its SEAM-02 and TD-02 presence guards stay exactly as they are, because they cover
// a zero-occurrence regression this semantic gate does not replace. This file predicts no check
// count of its own -- the floors above are what make it non-vacuous.
//
// ponytail: the corpus binds to branches STRUCTURALLY -- a case is covered when some branch's
// flattened condition contains every one of that case's ask-word matchTokens and names the expected
// owner first. That is deterministic, legible in the report, and mutation-sensitive. Its ceiling: it
// is a token-containment test, not semantic matching, so a branch could in principle contain the
// ask-words while meaning something else. Upgrade path if that ever bites: move the binding to a
// parsed pipe-table of (condition -> owner) rows via lib/pipe-table.mjs, which is the shape a shared
// routing table would ship in. Do not upgrade to an LLM judge -- the judged claim is the eval's.
//   node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sectionBody } from "./lib/section-body.mjs";
import {
  ROUTING_SURFACES,
  destinationsIn,
  foldedDescription,
  parseRoutingBranches,
} from "./lib/routing-parse.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const CORPUS_PATH = path.join(here, "rgr-cases.json");
const LZ_REFACTOR_SKILL = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-refactor", "SKILL.md");

// Per-entry listing cap for a skill's folded description. Measured baseline today: lz-red 1233,
// lz-tpp 750, lz-refactor 1245 -- so this check is GREEN now and stays a LIVE budget guard after
// D-06's rewording names a second destination in lz-refactor's tightest-headroom description.
const DESCRIPTION_CHAR_CAP = 1536;
const SKILLS = Object.freeze(["lz-red", "lz-tpp", "lz-refactor"]);

// A behavior-change ask, as DATA. The sweep rule cites a step-1 rule in order to EXCLUDE behavior
// changes from a sweep, so "the citation resolves" means every skill the citation names really is a
// destination of some step-1 branch whose condition is about changing behavior.
const BEHAVIOR_CHANGE_ASK_TOKENS = Object.freeze([
  "changing behavior",
  "change behavior",
  "add or change behavior",
  "add a new behavior",
  "failing test pass",
]);

// The heading 22-03 authors over today's unnamed QUESTION/COMMAND paragraph, and the exact string
// step 4's prose pointer must name so the cross-reference resolves.
const ANCHOR_HEADING = "QUESTION vs COMMAND intent routing";
const SWEEP_HEADING = "Whole-package / directory sweeps";
const PROCEDURE_HEADING = "Coach decision procedure";
const STEP1_CITATION_RE = /\(step\s*1\)/i;

let failures = 0;

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

// The fail-closed whole-file read. See the FAIL-CLOSED CONTRACT in the header: no existence probe,
// the empty string on any read failure, so every surface still gets exactly one report().
const readOrEmpty = (p) => {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
};

const flatten = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

// Corpus load. A malformed or unreadable corpus is an IO/usage error, not a check failure, so it
// exits 2 rather than 1 -- the operator needs to see that the instrument could not run at all.
let corpus;

try {
  corpus = JSON.parse(fs.readFileSync(CORPUS_PATH, "utf8"));
} catch (err) {
  console.log(`SUMMARY: RGR-ROUTING ERROR -- cannot read or parse ${path.relative(repoRoot, CORPUS_PATH)}: ${err.message}`);
  process.exit(2);
}

const CASES = Array.isArray(corpus && corpus.cases) ? corpus.cases : [];
// The three step-1 coach procedures: the router surfaces whose branches are lettered sub-items. The
// exhaustive and at-most-one assertions iterate these, which is why the corpus floor asserts there
// are three of them -- an empty set would make both assertions vacuous.
const STEP1_SURFACES = ROUTING_SURFACES.filter((s) => s.kind === "router" && s.parseMode === "lettered");
const ROUTER_SURFACES = ROUTING_SURFACES.filter((s) => s.kind === "router");

console.log("RGR routing gate (exhaustive + at-most-one + single-axis over a parsed routing table)");
console.log(`  surfaces: ${ROUTING_SURFACES.length} (${ROUTER_SURFACES.length} router, ${ROUTING_SURFACES.length - ROUTER_SURFACES.length} mode-gate)`);
console.log(`  corpus:   ${CASES.length} cases from ${path.relative(repoRoot, CORPUS_PATH)}`);
console.log("");

// ---------------------------------------------------------------------------------------------
// Parse every surface. One entry per ROUTING_SURFACES id, always present, even when the read or the
// parse failed -- that is what makes the per-surface reports below unconditional.
// ---------------------------------------------------------------------------------------------
const parsed = new Map();
const fileCache = new Map();

for (const surface of ROUTING_SURFACES) {
  const abs = path.join(repoRoot, ...surface.file.split("/"));

  if (!fileCache.has(abs)) {
    fileCache.set(abs, readOrEmpty(abs));
  }

  parsed.set(surface.id, parseRoutingBranches(fileCache.get(abs), surface));
}

const allBranches = [];

for (const surface of ROUTING_SURFACES) {
  allBranches.push(...parsed.get(surface.id).branches);
}

// ---------------------------------------------------------------------------------------------
// [cls] scan floor -- the D-17 canonical-location check, and the answer to a renamed heading.
// ---------------------------------------------------------------------------------------------
console.log("[cls] scan floor -- every declared surface parses to at least one branch");

for (const surface of ROUTING_SURFACES) {
  const result = parsed.get(surface.id);

  report(
    result.ok,
    `[cls] scan floor -- ${surface.id}`,
    result.ok
      ? `${result.branches.length} branch(es) from ${surface.file}`
      : `${result.why} (${surface.file})`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls] corpus floor -- the anti-vacuity control INSIDE the real gate. Every assertion below is
// quantified over the corpus and over the surface list; if either is empty, or a case carries no
// ask-words, the assertions would pass by having nothing to check.
// ---------------------------------------------------------------------------------------------
const tokenlessCases = CASES.filter(
  (c) => !Array.isArray(c.matchTokens) || c.matchTokens.filter((t) => typeof t === "string" && t.trim() !== "").length === 0
).map((c) => c.id);
const floorReasons = [];

if (CASES.length === 0) {
  floorReasons.push("corpus carries zero cases");
}

if (ROUTING_SURFACES.length === 0) {
  floorReasons.push("surface list is empty");
}

if (STEP1_SURFACES.length !== 3) {
  floorReasons.push(`expected 3 step-1 router surfaces, found ${STEP1_SURFACES.length}`);
}

if (tokenlessCases.length > 0) {
  floorReasons.push(`case(s) with no usable matchTokens: ${tokenlessCases.join(", ")}`);
}

report(
  floorReasons.length === 0,
  "[cls] corpus floor -- cases loaded with non-empty matchTokens over a non-empty surface list",
  floorReasons.length === 0
    ? `${CASES.length} cases, ${ROUTING_SURFACES.length} surfaces, ${STEP1_SURFACES.length} step-1 procedures`
    : floorReasons.join("; ")
);

console.log("");

// ---------------------------------------------------------------------------------------------
// Coverage predicates.
// ---------------------------------------------------------------------------------------------

// A branch COVERS a case when its flattened condition contains every one of the case's ask-words.
// Structural containment, deliberately (see the ponytail note in the header).
const covers = (branch, kase) => {
  const cond = branch.conditionText.toLowerCase();

  return kase.matchTokens
    .filter((t) => typeof t === "string" && t.trim() !== "")
    .every((t) => cond.includes(t.toLowerCase()));
};

// A branch OWNS a case when it covers it and routes it to the expected owner FIRST. When the case
// declares a second hop the destination list must be exactly that ordered pair -- D-02's two-hop
// rule is an ORDER claim, so an unordered or single-name match must not satisfy it.
const owns = (branch, kase) => {
  if (!covers(branch, kase)) {
    return false;
  }

  if (kase.expectedSecondHop) {
    return (
      branch.destinations.length === 2 &&
      branch.destinations[0] === kase.expectedOwner &&
      branch.destinations[1] === kase.expectedSecondHop
    );
  }

  return branch.destinations[0] === kase.expectedOwner;
};

// The declared residual terminal claims NOTHING: it must carry the explicit no-owner marker AND
// affirm zero destinations. Recognition is never by the ABSENCE of a skill name, so a branch that
// merely forgot to name an owner cannot pass itself off as the residual (D-01).
const isDeclaredResidual = (branch) => branch.isResidual && branch.destinations.length === 0;

const step1Branches = [];

for (const surface of STEP1_SURFACES) {
  step1Branches.push(...parsed.get(surface.id).branches);
}

// ---------------------------------------------------------------------------------------------
// [cls-01] exhaustive -- every case has a named owner (or IS the declared residual).
// ---------------------------------------------------------------------------------------------
console.log("[cls-01] exhaustive -- every corpus case lands on a named owner");

for (const kase of CASES) {
  const residualCase = kase.expectedOwner === "NONE";
  const hits = residualCase
    ? step1Branches.filter(isDeclaredResidual)
    : step1Branches.filter((b) => owns(b, kase));
  const want = residualCase
    ? "a declared residual terminal claiming no owner"
    : kase.expectedSecondHop
      ? `${kase.expectedOwner} then ${kase.expectedSecondHop} (ordered)`
      : kase.expectedOwner;

  report(
    hits.length > 0,
    `[cls-01] exhaustive -- ${kase.id} has a named owner`,
    hits.length > 0
      ? `${want} via ${hits.map((b) => `${b.surfaceId}#${b.branchId}`).join(", ")}`
      : `no step-1 branch routes ${kase.id} to ${want}; tokens [${kase.matchTokens.join(" | ")}]`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-01] no bare catch-all terminal -- the shape D-01 removes.
// ---------------------------------------------------------------------------------------------
console.log("[cls-01] no bare catch-all terminal -- no router keeps an otherwise-is-this-skill branch");

for (const surface of ROUTER_SURFACES) {
  const offenders = parsed.get(surface.id).branches.filter((b) => b.isBareCatchAll);

  report(
    offenders.length === 0,
    `[cls-01] no bare catch-all terminal -- ${surface.id}`,
    offenders.length === 0
      ? ""
      : `bare residual condition without the explicit no-owner marker at ${offenders.map((b) => `#${b.branchId}`).join(", ")}`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-02] at-most-one -- no case is claimed for ITSELF by two step-1 procedures.
// ---------------------------------------------------------------------------------------------
console.log("[cls-02] at-most-one -- no case is self-claimed by two step-1 procedures");

for (const kase of CASES) {
  const claimants = STEP1_SURFACES.filter((surface) =>
    parsed
      .get(surface.id)
      .branches.some((b) => covers(b, kase) && b.destinations[0] === surface.owner)
  ).map((s) => s.id);

  report(
    claimants.length <= 1,
    `[cls-02] at-most-one -- ${kase.id} claimed by at most one step-1 procedure`,
    claimants.length <= 1
      ? claimants.length === 1
        ? `claimed by ${claimants[0]}`
        : "claimed by no procedure for itself"
      : `claimed for itself by ${claimants.length} procedures: ${claimants.join(", ")}`
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls-03] single-axis -- routers AND mode-selection gates alike (D-03).
//
// A surface whose parse failed has zero branches, so this check -- and the catch-all check above --
// pass for it vacuously. That is deliberate and not a hole: the scan floor is the ONE assertion that
// reports unconditionally per surface every run, so a broken read already produces exactly one
// attributable failure there. Re-reporting the same broken read under two more labels would triple
// the noise and obscure WHICH surface is broken. The consequence to keep in mind when reading a
// delta: taking a surface file away can leave the total failure COUNT flat, because the new
// scan-floor failure arrives as this surface's branch-level failures go vacuous. Read the label set,
// not the count.
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] single-axis -- no branch keys on test state");

for (const surface of ROUTING_SURFACES) {
  const offenders = parsed.get(surface.id).branches.filter((b) => b.keysOnTestState.length > 0);

  report(
    offenders.length === 0,
    `[cls-03] single-axis -- ${surface.id} has no test-state-keyed branch`,
    offenders.length === 0
      ? `${parsed.get(surface.id).branches.length} branch(es) key on the ask only`
      : offenders
          .map((b) => `#${b.branchId} keys on [${b.keysOnTestState.join(" | ")}]`)
          .join("; ")
  );
}

console.log("");

// ---------------------------------------------------------------------------------------------
// Same-file citation checks on lz-refactor/SKILL.md (D-03's third site and D-07's anchor).
// ---------------------------------------------------------------------------------------------
console.log("[cls-03] citations resolve inside lz-refactor/SKILL.md");

const refactorText = readOrEmpty(LZ_REFACTOR_SKILL);
const sweepBody = sectionBody(refactorText, SWEEP_HEADING);
const refactorStep1 = parsed.get("refactor-step1");
const behaviorChangeDestinations = new Set();

for (const branch of refactorStep1.branches) {
  const cond = branch.conditionText.toLowerCase();

  if (BEHAVIOR_CHANGE_ASK_TOKENS.some((t) => cond.includes(t))) {
    for (const name of branch.destinations) {
      behaviorChangeDestinations.add(name);
    }
  }
}

if (sweepBody === null) {
  report(false, "[cls-03] sweep-rule citation resolves", `heading absent -- no "## ${SWEEP_HEADING}" section`);
} else {
  const citing = flatten(sweepBody)
    .split(/(?<=[.!?])\s+/)
    .filter((s) => STEP1_CITATION_RE.test(s));
  const cited = new Set();

  for (const sentence of citing) {
    for (const name of destinationsIn(sentence)) {
      cited.add(name);
    }
  }

  const unresolved = [...cited].filter((name) => !behaviorChangeDestinations.has(name));

  report(
    citing.length > 0 && unresolved.length === 0,
    "[cls-03] sweep-rule citation resolves",
    citing.length === 0
      ? `no sweep sentence carries a "(step 1)" citation, so the rule it cites cannot be checked`
      : unresolved.length === 0
        ? `cites [${[...cited].join(", ")}], each a step-1 behavior-change destination`
        : `cites [${unresolved.join(", ")}], which step 1 does not route a behavior-change ask to`
  );
}

const anchorBody = sectionBody(refactorText, ANCHOR_HEADING);
const procedureBody = sectionBody(refactorText, PROCEDURE_HEADING);
// Section-scoped rather than item-4-scoped on purpose: the pointer lives in step 4 today, and moving
// it to another step of the SAME procedure is not the defect this closes (a dangling cross-reference
// is). The anchor heading itself sits OUTSIDE this section body -- sectionBody stops at the next
// `## ` -- so the prose mention cannot be satisfied by the heading it points at.
const pointerNamesAnchor = procedureBody !== null && flatten(procedureBody).includes(ANCHOR_HEADING);
const anchorReasons = [];

if (anchorBody === null) {
  anchorReasons.push(`no "## ${ANCHOR_HEADING}" heading in lz-refactor/SKILL.md`);
}

if (!pointerNamesAnchor) {
  anchorReasons.push(`the coach procedure's prose pointer does not name "${ANCHOR_HEADING}" verbatim`);
}

report(
  anchorReasons.length === 0,
  "[cls-03] QUESTION/COMMAND anchor resolves",
  anchorReasons.length === 0 ? "heading present and named verbatim by the procedure" : anchorReasons.join("; ")
);

console.log("");

// ---------------------------------------------------------------------------------------------
// [cls] description char cap -- D-06's rewording budget, ASSERTED rather than assumed.
// ---------------------------------------------------------------------------------------------
console.log(`[cls] description char cap -- each folded description within ${DESCRIPTION_CHAR_CAP} chars`);

for (const skill of SKILLS) {
  const text = readOrEmpty(path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md"));
  const folded = foldedDescription(text);

  if (folded === null) {
    report(false, `[cls] description char cap -- ${skill}`, "no folded description block found");
    continue;
  }

  report(
    folded.length <= DESCRIPTION_CHAR_CAP,
    `[cls] description char cap -- ${skill}`,
    `${folded.length} chars, ${DESCRIPTION_CHAR_CAP - folded.length} of headroom`
  );
}

console.log("");

if (failures === 0) {
  console.log(
    `SUMMARY: RGR-ROUTING GREEN -- ${CASES.length} corpus cases exhaustive and at-most-one over ${STEP1_SURFACES.length} step-1 procedures, no bare catch-all terminal, no test-state key in any of ${ROUTING_SURFACES.length} surfaces, citations resolve, descriptions within the ${DESCRIPTION_CHAR_CAP}-char cap`
  );
  process.exit(0);
}

console.log(`SUMMARY: RGR-ROUTING RED -- ${failures} hard failure(s)`);
process.exit(1);
