#!/usr/bin/env node
// Phase-18 content-completeness gate for the lz-red SKILL.md coach procedure + the RED references
// (extended in place from the Phase-16 SEL/STR/NAME core gate and the Phase-17 ASRT/RTR/VIT/ANTI
// slices; D-13 instrument-first, extend-in-place, no sibling checker). A mirror of check-backing.mjs
// (per-file topic-token presence + SUMMARY + process.exit(0|1), accumulate-then-exit, run from
// anywhere), with these additions over the bare template: a PER-FILE `requireFence` flag (>= 1
// tsc-strict ts fence, borrowed from check-catalog's fence idiom); a `requireNonIgnoreFence` flag (a
// BARE ts fence only, so a coverage-skipping ts-ignore fence cannot satisfy VIT-02); a per-entry
// `dir` base override (SKILL.md sits at the skill root, not under references/); an `absent`
// no-stale-marker guard (the D-14 inverse of `deferral`); filename-presence cross-link tokens folded
// into `topics`; and a post-loop SEAM-02 block reading the shipped lz-tpp/SKILL.md.
//
// Eleven FILES entries: the SKILL.md router (dir-override entry -- coach-procedure tokens + a
// non-ignore ts fence + a no-stale-marker guard) plus the ten lz-red references. The four co-edited
// Phase-18 slices (three-laws-and-test-selection, test-structure-and-assertions,
// vitest-typescript-mechanics, principle-backing) had their must-REMAIN Phase-18 deferral guards
// FLIPPED to positive content topics + an `absent: /Phase 18/i` no-stale-marker guard; every
// Phase-16/17 topic is kept as the regression floor.
//
// ELEVEN FILES entries as of quick-260729-lc9. A twelfth was added by quick-260728-j9m for the
// cross-author test-double vocabulary map and is now REMOVED, together with the sha256 byte-identity
// gate that policed its three per-skill copies: that material is scoped to development-time reference
// only, so it no longer ships in any skill and the shipped tree carries no copy of it.
//
// THE FORWARD CONSTRAINT, recorded here because it is the reason the gate was deleted rather than
// narrowed: if a future milestone needs this material inside the plugin, it goes in as ONE plugin-wide
// shared reference, never as byte-identical per-skill copies. Narrowing the digest gate to a single copy
// would have made its predicate vacuous on a one-element array -- the guard-that-cannot-fail class this
// file's own header condemns -- so it is deleted outright. Guard N3 below now enforces the absence
// positively, which is what makes the constraint machine-checked instead of prose-checked.
//
// Surviving additions from quick-260728-j9m, both still PURELY ADDITIVE:
//   - `absent` accepts EITHER a single guard object or an ARRAY of them, so one file can carry several
//     no-stale-text guards, each independently reported under its own label.
//   - An OPTIONAL per-entry `scaffoldExempt` array filters SCAFFOLD_RES for that entry only, for a file
//     where one of those words is a genuine domain term rather than a draft marker. No entry sets it
//     today; the shared phrase list in lib/scaffold-phrases.mjs stays untouched, because the
//     lz-refactor battery imports it too and an exemption must never reach another file.
//
// Revised in quick-260728-wev, again extended IN PLACE (no sibling checker). That task's acceptance
// gate found the instrument itself defective, so the instrument was fixed FIRST and every new guard
// was demonstrated to FAIL against the unmodified tree before any content was edited; the per-guard
// evidence is recorded in 260728-wev-RED-BASELINE.md. THREE stale topics were removed and SEVENTEEN
// guards (G1-G17) added:
//   - R1, the `/\bcoined\b/i` topic. Its needle OUTLIVED ITS SUBJECT: two unrelated occurrences about
//     Meszaros coining the umbrella term keep it PASSing after the coinage it policed is gone. A
//     guard that cannot fail is worse than no guard, so it is removed rather than narrowed.
//   - R2, the `/unaudited/i` topic. Its subject -- the fabricated cross-reference mapping caveat --
//     is deleted, and it cannot coexist with the G4 absent guard that replaces it.
//   - R3, the `/vintage/i` topic. The MIRROR of R1: a SUBJECT DELETED FROM UNDER A NEEDLE, which
//     produces a false FAIL. Its sole occurrence was the opening line of the seniority block the
//     revision deletes, so it would have flipped PASS to FAIL and blocked the phase. Both are the
//     same coupling bug -- a positive topic silently depending on prose another change may move.
//   - G1-G5, G11, G12 and G6-G10, G13 all read the vocabulary map and RETIRED with it in
//     quick-260729-lc9; G14 and G15 net-new SEMANTIC guards on the lz-red SKILL.md worked example (the
//     entry already had an absent guard -- what it lacked was any guard on the example, which is why
//     stale contradicting text passed at 12/12); G16 a principle-backing.md positive topic; G17 a
//     net-new post-loop bare-qualifier gate, which SURVIVES with a widened scope and a renamed label.
//
// Extended again by the 260729-2ig GAP CLOSURE, TWO checks, both purely additive. The [2ig] round was
// required to ban chronology / seniority / ordering constructions and to build the guard forbidding
// them; the requirement was missing from that round's CONTEXT.md, so neither happened and the battery
// went 173/173 GREEN over a surviving one. The ban is split across TWO mechanisms because its needles
// come in two shapes:
//   - `[gap] no chronology or seniority token` -- an `absent` entry on the taxonomy carrying the
//     SINGLE-TOKEN stems. Per line, which is safe here precisely because a stem cannot wrap.
//   - `[gap] no chronology or seniority phrase (wrap-proof)` -- a post-loop block carrying the four
//     MULTI-WORD constructions against whitespace-flattened text, because no per-line needle over them
//     can match once the phrase wraps, and none narrows to a single token without false-failing live
//     prose. EXPECTED_CHECKS moves 172 -> 174; see the arithmetic note there.
//
// RED against the current placeholder / un-filled Phase-18 slices BY DESIGN -- this is the
// instrument-first Wave-0 Nyquist baseline, NOT a failure. The tsc extractor is GREEN-on-empty (it
// compiles whatever fences exist), so it cannot be the content-completeness signal; THIS checker is.
// The SKILL.md placeholder trips /\bplaceholder\b/i, carries no bare ts fence, and still carries the
// deferral marker; the four co-edited slices still carry their `/Phase 18/i` marker; and lz-tpp has
// no reverse pointers yet -- so the gate is RED now and flips GREEN only when later waves author the
// coach procedure + a tsc-strict Vitest fence, fill the four slices, remove every deferral marker,
// and add both lz-tpp reverse pointers. The Phase-17.1 D-05 honesty gate stays intact.
//   node .claude/skills/lz-red-workspace/tools/check-red-references.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { findBookCitedAsOwned } from "./lib/provenance-honesty.mjs";
import { ROW_SCOPED_GUARDS, RETIRED_LABELS } from "./lib/row-guards.mjs";
import { scanTables, findLinkTargets } from "./lib/pipe-table.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
// tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const REFERENCES = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red", "references");
// The lz-red skill ROOT (parent of references/). The SKILL.md FILES entry resolves against it via a
// per-entry `dir` override, since the checker otherwise reads only references/ (Pitfall 2).
const SKILL_ROOT = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-red");

// One entry per lz-red RED reference (subdir names include the `testing-stance/` segment, joined
// under REFERENCES). topics = content-present line patterns (present once the slice is authored),
// including filename-presence tokens for the required cross-links / cross-references. requireFence =
// assert >= 1 tsc-strict ts fence for that file (VIT-02 "examples throughout"; false for nav-only /
// prose-only files the tsc extractor skips or that carry no example). deferral = a must-REMAIN
// later-phase marker for a CO-EDITED stub, so a wave fills only its own slice. absent = the inverse
// of deferral (D-14 no-stale-marker guard): FAILS if the pattern is still PRESENT, so once a slice
// is filled its `/Phase 18/i` deferral artifact must be gone. The needle is `/Phase 18/i` ONLY --
// LAW-0 / SEAM-0 legitimately remain as requirement refs (LAW-01 / SEAM-01) in filled content.
// requireNonIgnoreFence = assert >= 1 BARE ts fence (exactly ```ts / ```typescript) the tsc extractor
// actually compiles; unlike requireFence's looser TS_FENCE_RE a ```ts ignore fence does NOT satisfy
// it (VIT-02 real coverage). dir = optional per-entry base dir (defaults to REFERENCES); the SKILL.md
// entry sets it to the skill root so the checker reaches the router at the tree root.
// absent accepts a single guard object OR an array of them (j9m): the DEL-7 sweep needs several
// no-stale-text guards on one file, and an array keeps them independently reported and named.
// scaffoldExempt = optional array of SCAFFOLD_RES patterns to skip FOR THIS ENTRY ONLY, for a file
// where one of those words is a genuine domain term rather than a draft marker.
// labelPrefix = optional string prepended to this entry's AUTO-GENERATED labels (exists / fence /
// scaffold), so a wholly NEW surface can be attributed as new work the same way its hand-written
// topic labels are. Defaults to "" and is unset on all eleven pre-existing entries, whose reported
// labels are therefore byte-unchanged.
const FILES = [
  {
    name: "three-laws-and-test-selection.md",
    requireFence: true,
    topics: [
      { label: "running test list", re: /test list/i },
      { label: "one small/single step", re: /one (small |single )?step/i },
      { label: "degenerate / starter case", re: /degenerate|starter|empty|zero|null/i },
      { label: "triangulation (test-selection facet)", re: /triangulat/i },
      { label: "lz-tpp GREEN firewall reference", re: /lz-tpp/i },
      // Phase-18 spine slice (filled this phase; LAW-01, SEAM-01).
      { label: "Three Laws spine present", re: /three laws|law 1|law 2|law 3/i },
      { label: "classify-first framing", re: /classify/i },
      // DEL-7a: Law 2 sizes the TEST; the hand-forward bar is a different question. The two must be
      // disambiguated here as well as in SKILL.md, since this file states Law 2 at length.
      {
        label: "[j9m] Law 2 sizes the test, not the hand-forward bar",
        re: /hand forward|hand it forward|sizes the test/i,
      },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    name: "test-structure-and-assertions.md",
    requireFence: true,
    topics: [
      // STR slice (Phase 16, kept -- regression floor).
      { label: "arrange-act-assert", re: /arrange-act-assert/i },
      { label: "given-when-then", re: /given-when-then/i },
      { label: "assert-first", re: /assert-first/i },
      { label: "evident test data", re: /evident (test )?data/i },
      { label: "one concept per test", re: /one concept/i },
      // ASRT slice (Phase 17, filled this milestone).
      { label: "four pillars", re: /four pillars/i },
      { label: "resistance to refactoring", re: /resistance to refactoring/i },
      { label: "F.I.R.S.T. properties", re: /F\.I\.R\.S\.T\./ },
      { label: "observable behavior", re: /observable behavior/i },
      { label: "communication-based selection", re: /communication-based/i },
      // ASRT-02 spine (ROADMAP SC1): the assertions slice points at the three stance leaves.
      { label: "links functional-core.md", re: /functional-core\.md/ },
      { label: "links message-matrix.md", re: /message-matrix\.md/ },
      { label: "links seams-and-legacy.md", re: /seams-and-legacy\.md/ },
      // Phase-18 slice (filled this phase; LAW-02 leans on the owned F.I.R.S.T. row).
      { label: "F.I.R.S.T. red-step baseline", re: /red-step baseline/i },
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    name: "naming.md",
    requireFence: true,
    topics: [
      { label: "should-naming primary convention", re: /\bshould\b/i },
      { label: "behavior-oriented naming", re: /behavior/i },
      { label: "Osherove three-part alternative", re: /osherove|three-part/i },
      { label: "match the house naming stance", re: /match.*(house|stance)/i },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/README.md",
    requireFence: false,
    topics: [
      { label: "detection signal", re: /detection signal/i },
      { label: "route table", re: /route table/i },
      { label: "links functional-core.md", re: /functional-core\.md/ },
      { label: "links message-matrix.md", re: /message-matrix\.md/ },
      { label: "links seams-and-legacy.md", re: /seams-and-legacy\.md/ },
    ],
    deferral: null,
  },
  {
    name: "testing-stance/functional-core.md",
    requireFence: true,
    topics: [
      { label: "functional core", re: /functional core/i },
      { label: "imperative shell", re: /imperative shell/i },
      { label: "value-based/output-based assert", re: /value-based|output-based/i },
      { label: "no doubles in the core", re: /no (test )?doubles?/i },
    ],
    deferral: null,
    // [lc9] N6. The label word `Mock rule` heads bullets whose own bodies say "double", which is the
    // umbrella term. A Mock Object is one specific kind of double -- the kind that carries the
    // expectation itself -- so labelling a no-double rule after it names the wrong artifact. Same needle
    // as N5 on message-matrix.md; the two files are swept together and each is reported on its own file.
    absent: { label: "[lc9] no Mock rule label", re: /Mock rule/i },
  },
  {
    name: "testing-stance/message-matrix.md",
    requireFence: true,
    topics: [
      { label: "incoming query", re: /incoming query/i },
      { label: "incoming command", re: /incoming command/i },
      { label: "outgoing command", re: /outgoing command/i },
      { label: "outgoing query", re: /outgoing query/i },
      { label: "expect-to-send warranted double", re: /expect[ -]to[ -]send|expect to send/i },
      // [lc9] N4. The outgoing-command example records a call and inspects it afterwards, which is a
      // Test Spy. A Mock Object is reserved for a double that CARRIES THE EXPECTATION ITSELF, so the
      // example must name the artifact it actually demonstrates.
      { label: "[lc9] Test Spy named for the record-then-inspect double", re: /test spy/i },
    ],
    deferral: null,
    // [lc9] N5. See N6 on functional-core.md for why the label word is wrong.
    absent: { label: "[lc9] no Mock rule label", re: /Mock rule/i },
  },
  {
    name: "testing-stance/seams-and-legacy.md",
    requireFence: false,
    topics: [
      { label: "seam", re: /\bseam/i },
      { label: "characterization", re: /characterization/i },
      { label: "sequencing", re: /sequenc/i },
      // RTR-01 cross-link presence guard (check-backing cross-link idiom): cross-linked, not copied.
      { label: "cross-link refactoring-without-tests.md", re: /refactoring-without-tests\.md/ },
    ],
    deferral: null,
  },
  {
    name: "vitest-typescript-mechanics.md",
    requireFence: true,
    topics: [
      { label: "it.todo running test list", re: /it\.todo|test\.todo/ },
      { label: "test.each/it.each triangulation", re: /test\.each|it\.each/ },
      { label: "vi.* restraint", re: /restraint/i },
      { label: "watch loop", re: /watch/i },
      { label: "fails for the right reason", re: /right reason|AssertionError/ },
      { label: "ADV forward-pointer", re: /ADV-0|expectTypeOf|fast-check/ },
      // Cross-reference filename-presence tokens for the leaf's outbound links.
      { label: "cross-ref anti-patterns.md", re: /anti-patterns\.md/ },
      { label: "cross-ref message-matrix.md", re: /message-matrix\.md/ },
      // Phase-18 slice (filled this phase; ties the red-bar mechanic to the LAW-02 procedure step).
      { label: "fail-for-the-right-reason procedure step", re: /procedure step|law-02|law 2/i },
      // DEL-7b/7c/7f: the criterion restated correctly on the mechanics surface. `collection` is the
      // measured boundary (only a missing MODULE fails at collection); the not-implemented throw is a
      // valid-but-blunter red; and the divergence from this project's own stricter gate is recorded.
      { label: "[j9m] collection vs act-line failure", re: /collection/i },
      { label: "[j9m] not-implemented throw is a valid red", re: /not-implemented|not implemented/i },
      { label: "[j9m] instrument divergence recorded", re: /stricter than/i },
    ],
    absent: [
      { label: "no stale deferral marker", re: /Phase 18/i },
      // DEL-7c: MEASURED FALSE on the pinned toolchain (vitest 4.1.10, tsc 6.0.3) -- a missing named
      // export and a bare undeclared identifier both throw AT THE ACT LINE, so the body DID run.
      { label: "[j9m] no false never-reached-the-assertion claim", re: /never reached its assertion/i },
      // DEL-7b: an unresolved name is not a broken harness; reserve that verdict for collection.
      { label: "[j9m] no bare broken-harness verdict on an unresolved name", re: /broken harness/i },
    ],
  },
  {
    name: "anti-patterns.md",
    requireFence: false,
    topics: [
      { label: "over-mock/test-per-class", re: /over-mock|test-per-class/i },
      { label: "private methods", re: /private method/i },
      { label: "multiple unrelated assertions", re: /unrelated assert|multiple.*assert/i },
      { label: "passes immediately / no red", re: /passes immediately|never.?red|no red/i },
      { label: "snapshot as thinking", re: /snapshot/i },
      { label: "slow / order-dependent", re: /order-dependent|slow test/i },
      { label: "listen to the tests", re: /listen to the tests/i },
      { label: "GOOS counterpoint", re: /goos|counterpoint/i },
      { label: "Test Desiderata", re: /desiderata/i },
      { label: "tradeoff/heuristic lens", re: /tradeoff|heuristic/i },
      // DEL-7b: anti-pattern 4's recognizer must acknowledge the characterization carve-out, or the
      // skill's own legacy stance is condemned by its own gate (a pin is green by construction).
      { label: "[j9m] false-green carve-out names characterization", re: /characterization/i },
    ],
    deferral: null,
    // DEL-7: the fail-for-the-right-reason procedure ships in THIS change, so the marker deferring it
    // to a later phase is now wrong.
    // NEEDLE NARROWED from the specified `/in a later phase/i`: absent guards are evaluated PER LINE,
    // and the live marker wraps ("... in a" / "later phase)."), so the longer phrase can never match
    // and the guard would report PASS while the stale text is fully present. `/later phase/i` matches
    // the wrapped tail and is the file's only occurrence, so it gates the removal for real.
    absent: { label: "[j9m] no stale later-phase marker", re: /later phase/i },
  },
  {
    name: "principle-backing.md",
    requireFence: false,
    topics: [
      { label: "owned/oracle-verified tier", re: /oracle-verified/i },
      { label: "no-oracle tier", re: /no-oracle/i },
      { label: ">= 1 recommendation link", re: /\]\([^)]+\.md/ },
      { label: "named Phase-17 source (Khorikov)", re: /Khorikov/i },
      // [2ig] FIVE file-scoped topics REMOVED here, each REPLACED by a row-scoped guard in the
      // post-loop [2ig] block below. Every one of them named a specific table ROW in its own label
      // while its needle matched anywhere in the file, so the row could be deleted outright and the
      // guard still reported PASS. Measured decoy counts, worst first:
      //   `lz-tpp seam backing row` (/seam|handoff/i)                 -> 6 decoy prose lines
      //   `[j9m] failure-vs-error boundary row` (/failure|error .../i) -> 5 decoy prose lines
      //   `[j9m] test-double taxonomy backing row`                    -> 1 decoy prose cross-link
      //   `Three Laws backing row` (/three laws/i)                    -> 1 decoy section lead-in
      //   `[wev G16] kanban-cycle essay ...`                           -> 1 decoy prose bullet
      // Their replacements assert the ROW's own cell (and, for the seam row, the CANONICAL tier string
      // rather than a bare non-empty tier, which on this table could never fail). Removal-and-
      // replacement pairings are recorded in 260729-2ig-RED-BASELINE.md so no guard was silently
      // dropped, and the six retired labels are asserted ABSENT by the roster gate.
    ],
    absent: { label: "no stale deferral marker", re: /Phase 18/i },
  },
  {
    // NET-NEW (D-13, Pitfall 2): the SKILL.md coach procedure sits at the skill ROOT, so it resolves
    // via the `dir` override (the checker reads references/ only by default). requireNonIgnoreFence
    // demands a BARE ts fence the tsc extractor compiles (VIT-02), not a skipped `ts ignore` fence.
    name: "SKILL.md",
    dir: SKILL_ROOT,
    requireNonIgnoreFence: true,
    topics: [
      { label: "classify-first", re: /classify/i },
      { label: "Three Laws spine", re: /three laws|law 1|law 2|law 3/i },
      { label: "stance routing step", re: /route|routing/i },
      { label: "house test idiom", re: /house .*idiom|test idiom|idiom/i },
      { label: "natural-language override", re: /override|plain language|stance preference/i },
      { label: "fail for the right reason", re: /right reason|AssertionError/ },
      { label: "forward lz-tpp handoff", re: /lz-tpp/i },
      // DEL-7b: the four-tier red hierarchy on the router. An assertion failure is the SHARPEST red,
      // a not-implemented throw is a valid but BLUNTER one, a collection or build failure is a
      // PREREQUISITE to clear rather than the red you hand forward, and the CHARACTERIZATION test is
      // carved out of the false-green rule because it is green by construction.
      { label: "[j9m] valid but blunter red", re: /blunter/i },
      { label: "[j9m] prerequisite to clear", re: /prerequisite/i },
      { label: "[j9m] characterization carve-out", re: /characterization/i },
      // [lc9] N9. The side-qualification rule must live IN the coach procedure, not in an appendix. The
      // needle is REGION-SCOPED for exactly that reason: it requires the phrase to occur BEFORE the
      // `## Reference material` heading, which is the stable key that closes the `## Coach decision
      // procedure` slice. A file-wide needle would be satisfied by an appendix placement, which is the
      // placement this guard's own label says is wrong -- the "needle outlives its subject" class.
      //
      // This needle spans a newline, so it is the one topic in this file that opts into the whole-text
      // matcher above. Measured through the real evaluator, three ways: absent -> FAIL, rule in the
      // coach procedure -> PASS, rule ONLY in the appendix -> FAIL.
      {
        label: "[lc9] side-qualification rule inline in the coach procedure",
        re: /which side they mean[\s\S]*?\n## Reference material/i,
        wholeText: true,
      },
    ],
    // [wev] G14 and G15 are the entry's first SEMANTIC guards on the worked example. The entry
    // already carried an absent guard (the stale-marker one below); what it lacked was any guard on
    // the example itself, which is why stale contradicting text and a latent false green both passed
    // at 12/12.
    absent: [
      { label: "no stale deferral marker", re: /Phase 18/i },
      // G14: the trailing clause of the fenced comment that denied what step 5 sanctions. The
      // CORRECT sibling clause in the prose lead-in -- about a compile error -- differs by two words
      // and is deliberately NOT caught by this needle.
      { label: "[wev G14] worked example does not deny the not-implemented throw", re: /not a missing symbol/i },
      // G15: the exact bare return statement of the example's wrong body, semicolon included. The
      // semicolon matters: a real implementation begins with the same two words followed by an
      // operator, and must not trip the guard.
      { label: "[wev G15] worked-example body is not the identity return", re: /^\s*return total;\s*$/ },
    ],
  },
];

// File-level assertion (per-file via requireFence): at least one tsc-strict TypeScript fence
// (check-catalog fence idiom). A reliable RED-until-authored content signal for the example-bearing
// slices that the GREEN-on-empty tsc extractor cannot itself provide (VIT-02: >= 1 Vitest example).
const TS_FENCE_RE = /```(ts|typescript)\b/;

// A NON-ignore ts fence-open: the info string is EXACTLY `ts` or `typescript` (CommonMark allows up
// to three leading spaces), end-of-line right after the language token. Unlike TS_FENCE_RE -- whose
// `\b` sits before a space, so it also matches a coverage-skipping ```ts ignore fence that
// extract-samples.mjs silently skips -- this requires a BARE fence the tsc extractor actually
// compiles, so VIT-02 gets real tsc --strict coverage (Pitfall 3).
const NON_IGNORE_TS_FENCE_RE = /^\s{0,3}```(ts|typescript)\s*$/m;

let failures = 0;
// [2ig] Roster instrumentation. `emitted` and `emittedLabels` are maintained INSIDE the single report()
// funnel, so every check -- loop, post-loop block, or future addition -- is counted and named without
// any call site having to remember to. The roster gate below reads them.
let emitted = 0;
const emittedLabels = [];

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

  emitted++;
  emittedLabels.push(label);

  console.log(`  [${ok ? "PASS" : "FAIL"}] ${label}${detail ? " -- " + detail : ""}`);
};

console.log("lz-red Phase-18 coach-procedure + reference completeness check (RED-on-stubs by design)");
console.log(`  references dir: ${path.relative(repoRoot, REFERENCES)}`);
console.log("");

let filesPresent = 0;

for (const spec of FILES) {
  const filePath = path.join(spec.dir ?? REFERENCES, spec.name);
  // Auto-generated labels carry the entry's optional labelPrefix (unset, so empty, on all eleven
  // pre-existing entries) -- see the labelPrefix note above.
  const auto = (suffix) => `${spec.labelPrefix ?? ""}${spec.name}${suffix}`;

  if (!fs.existsSync(filePath)) {
    report(false, auto(" exists"), "not found");
    continue;
  }

  filesPresent++;
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  // [lc9] The `topics` matcher is PER LINE, because `lines` has already had every newline stripped by
  // the split above. A needle containing a newline can therefore never match any element of `lines` --
  // it is structurally unmatchable, RED even when the content is right. Guard N9 needs a REGION-scoped
  // needle (a phrase that must occur BEFORE a named heading), which is the first multi-line needle this
  // mechanism has ever carried, so the mechanism has to admit one.
  //
  // The opt-in is per entry and STRICTLY ADDITIVE: a topic that does not set it keeps the per-line path
  // byte-for-byte. It is set on N9 ALONE and must stay that way -- a blanket flip to whole-text would
  // loosen every one of the ~100 pre-existing per-line topics, since a multi-token needle would start
  // matching across a line break. The `absent` matcher below is per-line for the same reason and is
  // deliberately NOT given the same opt-in; no `absent` guard here carries a multi-line needle.
  for (const topic of spec.topics) {
    const hit = topic.wholeText ? topic.re.test(text) : lines.some((line) => topic.re.test(line));
    report(hit, `${spec.name}: ${topic.label}`, hit ? "" : "topic token absent");
  }

  if (spec.requireFence) {
    const hasFence = TS_FENCE_RE.test(text);
    report(hasFence, auto(": >= 1 ts fence"), hasFence ? "" : "no tsc-strict TypeScript fence yet");
  }

  if (spec.requireNonIgnoreFence) {
    const hasNonIgnoreFence = NON_IGNORE_TS_FENCE_RE.test(text);
    report(
      hasNonIgnoreFence,
      auto(": >= 1 non-ignore ts fence"),
      hasNonIgnoreFence ? "" : "no bare tsc-strict TypeScript fence yet (a `ts ignore` fence does not count)"
    );
  }

  // Per-entry scaffold exemptions (j9m): filter the SHARED phrase list for this entry only, never
  // edit it. An exempt pattern is one whose word is a genuine domain term in that specific document.
  const scaffoldExempt = spec.scaffoldExempt ?? [];
  const scaffoldRes = SCAFFOLD_RES.filter(
    (re) => !scaffoldExempt.some((exempt) => exempt.source === re.source && exempt.flags === re.flags)
  );
  const scaffold = scaffoldRes.find((re) => re.test(text));
  report(!scaffold, auto(": no scaffold phrase"), scaffold ? `matches ${scaffold}` : "");

  if (spec.deferral) {
    const kept = lines.some((line) => spec.deferral.re.test(line));
    report(kept, `${spec.name}: ${spec.deferral.label}`, kept ? "" : "later-phase deferral marker missing");
  }

  // Inverse of deferral (D-14): a filled slice must NOT keep its `/Phase 18/i` deferral artifact.
  // PASS only when NO line matches. Accepts a single guard or an ARRAY of them (j9m), so one file can
  // carry several no-stale-text guards and each is reported independently under its own label.
  if (spec.absent) {
    const absentGuards = Array.isArray(spec.absent) ? spec.absent : [spec.absent];

    for (const guard of absentGuards) {
      const present = lines.some((line) => guard.re.test(line));
      report(!present, `${spec.name}: ${guard.label}`, present ? `stale marker still present (matches ${guard.re})` : "");
    }
  }
}

// Phase-17.1 D-05 honesty gate: no principle-backing.md row may be tagged "Owned;
// oracle-verified ..." while its Source cell still cites Kent Beck, Test-Driven Development by
// Example (Access: book, summary-only, never gateable -- 17.1-CONTEXT.md D-05). Generic over the
// whole table so a future tier-cell flip that forgets to also fix the Source cell trips this, not
// just the six Beck rows re-tiered in Phase 17.1. See lib/provenance-honesty.mjs.
const principleBackingPath = path.join(REFERENCES, "principle-backing.md");

if (fs.existsSync(principleBackingPath)) {
  const bookOwnedViolations = findBookCitedAsOwned(fs.readFileSync(principleBackingPath, "utf8"));

  report(
    bookOwnedViolations.length === 0,
    "principle-backing.md: D-05 honesty gate (no Owned row cites the book)",
    bookOwnedViolations.length === 0 ? "" : `violating rows: ${bookOwnedViolations.join(", ")}`
  );
}

// [SCOPE 0.0.3] SEAM-02 reverse-pointer guard REMOVED, and the lz-tpp path constant with it. The guard
// MANDATED cross-skill pointer content inside plugins/lz-tdd/skills/lz-tpp/SKILL.md -- an ALREADY
// SHIPPED skill that the 0.0.3 lz-red milestone must not modify. That file has been reverted to its
// lz-tdd@0.0.2 state, so a guard requiring the 0.0.3 content is enforcing an out-of-scope change and
// cannot stay. This instrument may READ another skill's files, but it must not REQUIRE content this
// milestone is not allowed to put there. Reinstating the seam belongs to a later milestone that
// legitimately owns lz-tpp. Do NOT re-add it here.

// [wev] G17 BARE-QUALIFIER GATE. The hard rule -- never use the contested word unqualified, say
// production-side or collaborator-side -- was enforced by NOTHING, so a regression was silent, and
// three of the six violations live at baseline were introduced by the very merge under review. A
// standalone post-loop block (the D-05 / SEAM-02 idiom) because it reads a whole tree plus paths
// outside the lz-red references dir.
//
// Scope: every .md under the lz-red references tree, PLUS the two SIBLING reference trees (lz-tpp and
// lz-refactor), plus the three shipped SKILL.md routers. NOTHING is excluded.
//
// [lc9] The per-basename exclusion is DELETED, not narrowed to a vacuous one-element filter, and the
// deletion is SELF-ENFORCING: if that document is ever re-added to a shipped reference tree, this gate
// now fires loudly on it, because the word is its subject matter and occurs many times in it. That is
// the correct outcome under the owner constraint. Keeping a filter with nothing left to filter would
// preserve the retired mechanism's shape, which is exactly what the constraint forbids. Measured: the
// walked file count is unchanged by the deletion -- this gate never scanned those copies.
//
// [lc9] The LABEL is renamed with the scope it now has. It previously said "outside the taxonomy",
// which after that document leaves the tree names something there is nothing to be outside OF -- a
// stale claim in the instrument's OWN OUTPUT, which is the same class this task exists to close,
// pointed at the gate rather than at the prose.
//
// [2ig] The two sibling trees are the WIDENING half of a two-part fix. The claim that the hard rule
// was machine-enforced was false for two thirds of the shipped surface while this gate walked only ONE
// of the three reference trees. Widening alone is not enough -- this gate lives in the lz-red
// development workspace, OUTSIDE the plugin, and is not shipped, so no installed copy carries it
// however wide the scope. MEASURED at widening time: ZERO new hits across both added trees.
//
// Allowlist is exactly two forms and nothing else: an IMMEDIATELY PRECEDING canonical side
// qualifier, and the meta-mention form that quotes the word as a word. The capitalised bare form is
// deliberately NOT allowlisted -- it is canonicalised at the site instead.
//
// Fails CLOSED on an unreadable file, and reports every hit BY FILE AND LINE so a failure is
// actionable rather than a bare count.
const BARE_WORD_RE = /\b(stub|stubs|stubbed|stubbing)\b/gi;
const SIDE_QUALIFIED_RE = /(production|collaborator)-side\s+$/i;
const META_MENTION_RE = /\bthe word\s+[`'"]?$/i;
const BARE_QUALIFIER_LABEL = "[wev G17] no bare unqualified contested word in the shipped tree";

// [lc9] EVERY file, at any depth. Split out from collectMarkdown so ONE walk can serve both a
// markdown-only consumer and the no-copy gate, which must not be blind to an extension: `collectMarkdown`
// filtered on `.md`, so a taxonomy copy re-added as `.markdown` or `.txt` was invisible to a gate whose
// label says "no copy", unqualified. No second directory walker is introduced -- the .md list is derived
// from this one.
const collectFiles = (dir) => {
  const found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...collectFiles(full));
      continue;
    }

    if (entry.isFile()) {
      found.push(full);
    }
  }

  return found;
};

const collectMarkdown = (dir) => collectFiles(dir).filter((file) => file.endsWith(".md"));

// [2ig] All THREE reference trees now, not just lz-red's.
const SIBLING_REFERENCE_TREES = ["lz-red", "lz-tpp", "lz-refactor"].map((skill) =>
  path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "references")
);
const bareQualifierHits = [];
const referenceTreeFiles = [];

// A MISSING or unreadable tree is recorded as a hit, never filtered away: an existsSync FILTER would
// silently narrow the scope back down and hand this gate a vacuous pass -- which is the whole defect
// the widening exists to close.
for (const dir of SIBLING_REFERENCE_TREES) {
  try {
    referenceTreeFiles.push(...collectMarkdown(dir));
  } catch (err) {
    bareQualifierHits.push(`${path.relative(repoRoot, dir)}: TREE UNREADABLE (${err.code ?? err.message})`);
  }
}

const bareQualifierTargets = [
  ...referenceTreeFiles,
  ...["lz-red", "lz-refactor", "lz-tpp"].map((skill) =>
    path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md")
  ),
];

for (const file of bareQualifierTargets) {
  const shown = path.relative(repoRoot, file);
  let bareText;

  try {
    bareText = fs.readFileSync(file, "utf8");
  } catch (err) {
    bareQualifierHits.push(`${shown}: UNREADABLE (${err.code ?? err.message})`);
    continue;
  }

  bareText.split(/\r?\n/).forEach((line, index) => {
    BARE_WORD_RE.lastIndex = 0;
    let match;

    while ((match = BARE_WORD_RE.exec(line)) !== null) {
      const before = line.slice(0, match.index);

      if (SIDE_QUALIFIED_RE.test(before) || META_MENTION_RE.test(before)) {
        continue;
      }

      bareQualifierHits.push(`${shown}:${index + 1} (${match[0]})`);
    }
  });
}

report(
  bareQualifierHits.length === 0,
  BARE_QUALIFIER_LABEL,
  bareQualifierHits.length === 0 ? "" : `${bareQualifierHits.length} bare use(s): ${bareQualifierHits.join("; ")}`
);

// ===============================================================================================
// [lc9] FIVE post-loop gates. Three walk the whole shipped tree (N1 table shape, N2 link resolution,
// N3 no taxonomy copy), reusing the collectMarkdown helper above rather than adding a second directory
// walker; two are cross-file content gates (N7 attribution, N8 the inline rule in lz-tpp).
//
// GENERAL RULE FOR EVERY COMMENT BELOW: a number that a later commit in this same task set will change
// is a defect, not documentation. Write the invariant -- a zero, a direction, a reason -- or write
// nothing and let a guard derive it. The census totals for this tree move the moment the taxonomy
// copies are deleted, so none of them is recorded here.
//
// All three tree gates share ONE walk and ONE error record. A walk failure is recorded as a HIT for
// every gate that consumes it, never filtered away: an empty file list would otherwise hand each gate a
// vacuous pass, which is exactly the guard-that-cannot-fail class this file's own header condemns.
// ===============================================================================================
const PLUGINS_DIR = path.join(repoRoot, "plugins");
let pluginsAllFiles = [];
let pluginsMarkdown = [];
let pluginsWalkError = "";

try {
  // ONE walk, two views: the markdown subset for the shape and link gates, the full list for the no-copy
  // gate, which must see any extension.
  pluginsAllFiles = collectFiles(PLUGINS_DIR);
  pluginsMarkdown = pluginsAllFiles.filter((file) => file.endsWith(".md"));
} catch (err) {
  pluginsWalkError = `${path.relative(repoRoot, PLUGINS_DIR)}: TREE UNREADABLE (${err.code ?? err.message})`;
}

// [lc9] N1 TABLE SHAPE GATE. The GENERAL form of the mutation the narrow row-count repairs kept
// chasing: deleting a data cell TOGETHER WITH its pipe leaves a row that renders short in GFM and that
// parseRows silently SKIPS, so every row-scoped guard over that table quietly stops seeing the row.
// scanTables compares every row's cell count against the count its table's first row set.
//
// MEASURED at authoring time: 0 ragged rows across the shipped tree, so this gate is INVARIANT-GREEN
// from the start and its falsifiability proof is the fixture set in tools/row-guards.selftest.mjs --
// including the pipe-deletion case that must return exactly one offender -- not a baseline failure.
//
// ANTI-VACUITY, and it is load-bearing rather than defensive noise: scanTables is a pure function that
// CANNOT report an offender on empty text, because "no ragged tables" is true of an empty document. So a
// mistyped path would yield 0 files -> 0 offenders -> a permanent PASS. The gate therefore also FAILS
// when it saw no table at all, which is also how the nonzero magnitude of the scan gets asserted every
// run -- strictly better than writing a table count into this comment, where it would go stale.
//
// [lc9] SCOPE: the shipped tree PLUS the ONE archived planning copy of the departed document. That
// copy is a frozen inert record, so this is a hygiene floor rather than a regression surface -- but it
// still carries pipe tables, and a ragged row there is the same defect. The path is listed as one extra
// target alongside the tree walk and FAILS CLOSED if it is unreadable. Kept TEXTUALLY SEPARATE from
// G17's scope on purpose: the two gates walk different trees and must not share a constant.
const RAGGED_TABLE_LABEL = "[lc9] no ragged pipe table";
const ARCHIVED_RECORD = path.join(repoRoot, ".planning/research/test-double-taxonomy.md");
const raggedHits = pluginsWalkError === "" ? [] : [pluginsWalkError];
let tablesSeen = 0;

for (const file of [...pluginsMarkdown, ARCHIVED_RECORD]) {
  const shown = path.relative(repoRoot, file);
  let shapeText;

  try {
    shapeText = fs.readFileSync(file, "utf8");
  } catch (err) {
    raggedHits.push(`${shown}: UNREADABLE (${err.code ?? err.message})`);
    continue;
  }

  const { tables, offenders } = scanTables(shapeText);

  tablesSeen += tables;
  offenders.forEach((offender) => raggedHits.push(`${shown}: ${offender}`));
}

if (tablesSeen === 0) {
  raggedHits.push("NO TABLE WAS SCANNED, so this gate checked nothing");
}

report(
  raggedHits.length === 0,
  RAGGED_TABLE_LABEL,
  raggedHits.length === 0 ? "" : `${raggedHits.length} problem(s): ${raggedHits.join("; ")}`
);

// [lc9] N2 RELATIVE-LINK RESOLUTION GATE. A dead relative link is a whole failure class this battery
// did not carry at all, and removing a shipped reference creates several at once. Only a `relative`
// target is resolvable against a directory, so anchors, scheme URLs and root-absolute paths are skipped
// by KIND rather than by an allowlist.
//
// An allowlist was MEASURED unnecessary rather than forgotten, and only the ZEROES are recorded here
// because they are the load-bearing facts and they are invariant across the deletion: 0 external-scheme
// links, 0 absolute links, 0 reference-style link definitions, 0 links inside code fences. Those four
// zeroes are the whole reason no allowlist is needed. The link, file and anchor TOTALS are deliberately
// NOT written down -- every one of them moves when the taxonomy copies go.
//
// The fragment split is REQUIRED, not optional: the lz-refactor catalogs carry file-plus-fragment
// links, and resolving `foo.md#bar` as a path would report every one of them dead.
//
// ANTI-VACUITY: FAIL when no link was RESOLVED at all, for the same reason as N1 -- a document with no
// links has no dead links, so a mistyped path passes forever otherwise.
//
// The counter counts RESOLVED RELATIVE targets, NOT every link kind, and that distinction is the whole
// point of an anti-vacuity leg: it has to count the thing the gate ACTS ON, exactly as N1's `tablesSeen`
// counts the tables scanTables actually saw. Counting every kind was a live defect -- a tree of only
// anchors and scheme URLs, or a regression that stopped `linkKind` returning "relative", left the count
// positive and the gate GREEN having resolved nothing. MEASURED against an all-anchor fixture tree
// through the real gate: PASS before this fix, RED after.
//
// The KIND CLASSIFICATION is deliberately untouched. A target that is not an anchor, a `scheme:` or
// root-absolute IS relative and IS existsSync-checked -- which is why a plugin-wide shared reference is
// cited as INLINE CODE carrying a plugin-root variable path and never as a Markdown link: as a link it
// would classify relative and fail here, correctly.
const LINK_RESOLVES_LABEL = "[lc9] every relative markdown link in the shipped tree resolves";
const deadLinkHits = pluginsWalkError === "" ? [] : [pluginsWalkError];
let relativeLinksResolved = 0;

for (const file of pluginsMarkdown) {
  const shown = path.relative(repoRoot, file);
  let linkText;

  try {
    linkText = fs.readFileSync(file, "utf8");
  } catch (err) {
    deadLinkHits.push(`${shown}: UNREADABLE (${err.code ?? err.message})`);
    continue;
  }

  for (const target of findLinkTargets(linkText)) {
    if (target.kind !== "relative") {
      continue;
    }

    const [filePart] = target.raw.split("#");

    if (filePart === "") {
      continue;
    }

    // Counted HERE, after both skips, so the count equals the number of targets this gate actually
    // resolved against the disk. Incrementing before the kind filter counted work the gate never did.
    relativeLinksResolved++;

    if (!fs.existsSync(path.resolve(path.dirname(file), filePart))) {
      deadLinkHits.push(`${shown}:${target.line} -> ${target.raw}`);
    }
  }
}

if (relativeLinksResolved === 0) {
  deadLinkHits.push("NO RELATIVE LINK WAS RESOLVED, so this gate checked nothing");
}

report(
  deadLinkHits.length === 0,
  LINK_RESOLVES_LABEL,
  deadLinkHits.length === 0 ? "" : `${deadLinkHits.length} unresolved: ${deadLinkHits.join("; ")}`
);

// [lc9] N3 NO-COPY GATE. The owner constraint is that this material is used by lz-red only and must
// never ship again as byte-identical per-skill copies. That constraint was violated ONCE ALREADY and
// survived three consecutive acceptance reviews, for exactly one reason: nothing checked it. Prose
// cannot enforce a constraint; this gate can. FAILS BY NAME on every copy it finds.
//
// [lc9] Matched on the basename STEM over EVERY file, not on `test-double-taxonomy.md` over the markdown
// list. The label says "no copy" unqualified, and an extension is not a constraint: a copy re-added as
// `.markdown`, `.txt` or anything else satisfied the old needle while violating the rule the label states.
// MEASURED: a `.txt` copy planted under plugins/ passed this gate before the change and FAILS by name
// after it. The rule got STRICTER -- no carve-out was added and nothing was scoped away.
const TAXONOMY_COPY_STEM = "test-double-taxonomy";
const TAXONOMY_COPY_LABEL = "[lc9] no test-double taxonomy copy in the shipped tree";
const taxonomyCopyHits = pluginsWalkError === "" ? [] : [pluginsWalkError];

for (const file of pluginsAllFiles) {
  if (path.basename(file, path.extname(file)) === TAXONOMY_COPY_STEM) {
    taxonomyCopyHits.push(path.relative(repoRoot, file));
  }
}

report(
  taxonomyCopyHits.length === 0,
  TAXONOMY_COPY_LABEL,
  taxonomyCopyHits.length === 0 ? "" : `${taxonomyCopyHits.length} copy/copies: ${taxonomyCopyHits.join("; ")}`
);

// [lc9] N7 ATTRIBUTION GATE. Read strictly, the current clause names the school's PROPONENTS rather
// than its NAMERS. The label is Fowler's own contribution, and the counterpoint POSITION stays sourced
// where it already is. ONE report over TWO files, because it is one claim restated in a dependent --
// the same reasoning the owned-source count guard records for its own two-file shape.
const FOWLER_LABEL_LABEL = "[lc9] mockist label attributed to Fowler at both sites";
const FOWLER_LABEL_NEEDLE = "Fowler's label";
const fowlerLabelHits = [];

for (const name of ["anti-patterns.md", "principle-backing.md"]) {
  const file = path.join(REFERENCES, name);

  try {
    if (!fs.readFileSync(file, "utf8").includes(FOWLER_LABEL_NEEDLE)) {
      fowlerLabelHits.push(`${name}: attribution phrase absent`);
    }
  } catch (err) {
    fowlerLabelHits.push(`${name}: UNREADABLE (${err.code ?? err.message})`);
  }
}

report(
  fowlerLabelHits.length === 0,
  FOWLER_LABEL_LABEL,
  fowlerLabelHits.length === 0 ? "" : fowlerLabelHits.join("; ")
);

// [SCOPE 0.0.3] N8 inline-rule PRESENCE gate REMOVED, for the same reason as SEAM-02 above: it
// mandated the side-qualification rule inside the ALREADY SHIPPED lz-tpp router, which the 0.0.3
// milestone must not modify. What is LOST is real and worth stating plainly, because G17 is an ABSENCE
// gate: deleting the rule outright still satisfies G17, since absence of a bare contested word is
// exactly what deleting the rule produces. So the shipped tree is protected against the bare word
// REAPPEARING, but nothing now requires lz-tpp to CARRY the rule. That is the correct trade while
// lz-tpp is out of scope -- the alternative is enforcing content this milestone is forbidden to write.
// The rule belongs with the shared reference once the cross-author material is relocated to a
// plugin-wide reference. Do NOT re-add a presence mandate on another skill's file here.

// [2ig] ROW-SCOPED and COUNT guards, from lib/row-guards.mjs. Post-loop because they need PARSED CELLS
// rather than a line match, and because two of them read across files. Each returns `{ ok, why }` and
// maps onto exactly ONE report call, so the roster arithmetic below stays legible.
//
// A MISSING file yields "" here, and EVERY guard FAILS on "" -- proven by the anti-vacuity control in
// tools/row-guards.selftest.mjs. That is DELIBERATELY unlike the existsSync-gated D-05 and SEAM-02
// blocks above, which emit NOTHING at all if their file vanishes (a fully silent vacuous pass that the
// roster gate exists partly to catch).
const readOrEmpty = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const backingText = readOrEmpty(principleBackingPath);

// [lc9] FOUR row-scoped guards, down from seven plus nine count guards. The two guards keyed on rows of
// the departed document, and the guard asserting the backing row that LINKED to it, are RETIRED BY NAME
// in RETIRED_LABELS -- not retargeted at the archived copy. Retargeting was rejected for three reasons,
// recorded so the choice is not silently re-opened: a frozen archive has no regression surface, so a
// guard on it can only fail on a deliberate archive edit (the guard-that-cannot-fail class in a new
// costume); pointing shipped-skill checks at a planning artifact lets a planning-doc edit redden the
// skill gate, which is the wrong direction of coupling; and no .planning/ subdirectory survives a
// milestone close, so every retargeted guard would break at the next one.
const TWO_IG_GUARDS = [
  {
    label: "principle-backing.md: [2ig] failure-versus-error boundary ROW backed",
    run: () => ROW_SCOPED_GUARDS.failureVsErrorRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] classify-first seam ROW backed with the canonical tier",
    run: () => ROW_SCOPED_GUARDS.seamRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] Three Laws spine ROW backed",
    run: () => ROW_SCOPED_GUARDS.threeLawsRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] kanban-cycle essay named IN THE ROW",
    run: () => ROW_SCOPED_GUARDS.kanbanEssayNamedInRow(backingText),
  },
];

for (const guard of TWO_IG_GUARDS) {
  const { ok: guardOk, why } = guard.run();

  report(guardOk, guard.label, guardOk ? "" : why);
}

// [2ig] ROSTER INTEGRITY. The LAST report, and it snapshots the count BEFORE its own emission so the
// literal below equals the guard total and the arithmetic stays legible.
//
// EXPECTED_CHECKS is a HAND-MAINTAINED LITERAL, PREDICTED from the guard inventory in advance, never set
// from a post-hoc measurement. Deriving it by summing topics plus flags would be WRONG ON PURPOSE:
// deleting a guard would lower BOTH sides, making the gate unable to fail. A tolerance band would be
// just as wrong -- six removals against five additions lands inside any band. The prediction:
//
//   146 (baseline) - 6 (superseded file-scoped topics) + 7 (row-scoped) + 9 (count) + 6 (absent)
//   + 10 (positive topics) = 172
//
// Note the row-scoped swap is NOT net-zero: seven in for six out is +1. Only the six-for-six sub-swap
// cancels. If the measured count is not exactly 172, a guard was dropped or duplicated -- FIND WHICH
// before changing the literal.
//
// [gap] +2, so 174. The chronology ban is TWO checks because its needles come in two shapes and each
// shape needs a different mechanism: one `absent` entry for the single-token stems (per line, and a stem
// cannot wrap) plus one post-loop block for the four multi-word constructions (whitespace-flattened,
// because a per-line needle over them can never match once the phrase wraps). Leaving this literal at
// 172 would fail the whole battery on the roster gate rather than on the guard that found something,
// which is the wrong signal.
//
// WHAT THIS GATE CATCHES that nothing else does: a deleted `topics` or `absent` entry; `topics: []`
// (the loop emits nothing) and `absent: []` (truthy, so the presence check does not save you); and an
// existsSync-gated post-loop block that silently emits nothing -- the D-05 honesty gate does exactly
// that today if its file vanishes, a fully silent vacuous pass. (The SEAM-02 block shared this shape
// and has since been removed as out of scope; see the scope note above.)
//
// WHAT IT DOES NOT CATCH, and nobody may mistake this gate for sufficient: a guard WEAKENED IN PLACE
// leaves the count unchanged. Only the selftest evasion proofs cover that. A bare count is also blind to
// a SHORT SWAP that happens to balance, which is why the label-set assertions below exist and why
// tools/row-guards.selftest.mjs asserts the exported guard NAME set independently.
// [lc9] +9 additions and -58 RETIREMENTS, then -2 for the 0.0.3 SCOPE REVERT, so 123:
//
//   174 ([gap] baseline) + 9 ([lc9] additions) - 58 (retirements) - 2 (scope) = 123
//
// The 2 scope removals are SEAM-02 and the [lc9] N8 presence gate. Both MANDATED content inside the
// already-shipped lz-tpp skill, which the 0.0.3 lz-red milestone must not modify; that file was
// reverted to lz-tdd@0.0.2, so both guards were enforcing an out-of-scope change. See the scope notes
// at each removal site. Neither is in RETIRED_LABELS: that roster records the taxonomy retirements of
// this task, and mixing a scope removal into it would blur two different reasons for a guard's absence.
//
// The nine additions were made INSTRUMENT-FIRST, before any content edit and before the deletion, so
// each one's ability to fail was demonstrated against the unmodified tree rather than asserted
// afterwards; the per-guard evidence is in 260729-lc9-RED-BASELINE.md. Four are FILES-entry guards and
// five are post-loop blocks.
//
// The 58 retirements are the whole surface that read the departed document: its FILES entry (29 topics
// + 14 absent guards + 1 auto scaffold check = 44), the sha256 byte-identity gate, its two row-scoped
// guards, the backing row that LINKED to it, the nine count guards, and the chronology phrase gate.
// Every one is recorded BY NAME in RETIRED_LABELS, so the roster gate can tell a deliberate retirement
// from an accidental drop -- without that list the two are the same green run.
const EXPECTED_CHECKS = 123;
const ROSTER_LABEL = "[2ig] roster integrity: exact emitted-check count";

// Every label the surviving [2ig] round and the [lc9] round ADD, composed exactly as emitted
// (`<filename>: <label>` inside the FILES loop, verbatim for a post-loop block). Hand-maintained
// alongside EXPECTED_CHECKS for the same reason: a short swap that balances the count still fails here.
// The roster label itself is absent from this list -- it has not been emitted yet at the moment it is
// checked.
//
// [lc9] PRUNED to the survivors, and the composition is spelled out because it moved twice: the FOUR
// remaining row-scoped guard labels, plus the EIGHT surviving [lc9] additions (the ninth was the N8
// presence gate, removed with SEAM-02 by the 0.0.3 scope revert), plus the G17 label = 13. Every label
// removed from here is now recorded in RETIRED_LABELS instead, which is what turns a retirement into an
// assertion rather than an absence.
//
// G17's label is listed as a STRING LITERAL, deliberately NOT as the BARE_QUALIFIER_LABEL constant, and
// this is the one entry in the list that can catch a RENAME. A guard rename was invisible to all THREE
// roster legs -- the count nets to zero, the new label is absent from this list, and the old label is
// absent from RETIRED_LABELS -- which is how 59 labels vanished against 58 rostered. Listing the CONSTANT
// would not have closed it: the emission site pushes that same constant, so a rename moves both sides
// together and the leg stays green, a guard that cannot fail. Only a literal makes the rename an
// assertion. MEASURED: with G17's label value changed, the battery exits 0 before this entry and 1 after.
//
// Recorded so the true extent is not lost: 8 of these 13 entries are still rename-BLIND for exactly that
// reason -- the four `TWO_IG_GUARDS.map(...)` labels are derived from the guard objects that also carry
// them to the report call, and four more are referenced through their own constants below. Converting
// them needs one rename proof each and is out of scope here.
const NEW_LABELS = [
  ...TWO_IG_GUARDS.map((guard) => guard.label),
  "[wev G17] no bare unqualified contested word in the shipped tree",
  // [lc9] The eight surviving additions, composed EXACTLY as emitted. The FILES loop emits
  // `<entry name>: <label>`, so the two testing-stance labels carry that path segment; a post-loop label
  // is verbatim.
  "testing-stance/message-matrix.md: [lc9] Test Spy named for the record-then-inspect double",
  "testing-stance/message-matrix.md: [lc9] no Mock rule label",
  "testing-stance/functional-core.md: [lc9] no Mock rule label",
  "SKILL.md: [lc9] side-qualification rule inline in the coach procedure",
  RAGGED_TABLE_LABEL,
  LINK_RESOLVES_LABEL,
  TAXONOMY_COPY_LABEL,
  FOWLER_LABEL_LABEL,
];

const emittedBeforeRoster = emitted;
const missingNewLabels = NEW_LABELS.filter((label) => !emittedLabels.includes(label));
const survivingRetiredLabels = RETIRED_LABELS.filter((label) => emittedLabels.includes(label));
const rosterOk =
  emittedBeforeRoster === EXPECTED_CHECKS &&
  missingNewLabels.length === 0 &&
  survivingRetiredLabels.length === 0;
const rosterDetail = [
  emittedBeforeRoster === EXPECTED_CHECKS
    ? `${emittedBeforeRoster} checks, equal to the PREDICTED literal`
    : `emitted ${emittedBeforeRoster}, PREDICTED ${EXPECTED_CHECKS} -- a guard was dropped or duplicated`,
  missingNewLabels.length === 0
    ? `all ${NEW_LABELS.length} new labels present`
    : `MISSING new label(s): ${missingNewLabels.join("; ")}`,
  survivingRetiredLabels.length === 0
    ? `none of the ${RETIRED_LABELS.length} retired labels survive`
    : `RETIRED label(s) still emitted: ${survivingRetiredLabels.join("; ")}`,
].join("; ");

report(rosterOk, ROSTER_LABEL, rosterDetail);

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} lz-red surfaces authored (SKILL.md coach procedure + SEL/STR/NAME/ASRT/RTR/VIT/ANTI references) with topics + required ts fences + cross-links, no scaffold leak, no stale Phase-18 markers, the red criterion consistent across every surface that restates it, no ragged pipe table and no dead relative link anywhere in the shipped tree, no per-skill copy of the development-time vocabulary map, D-05 honesty gate holds`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} surfaces present, ${failures} check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)`);
process.exit(1);
