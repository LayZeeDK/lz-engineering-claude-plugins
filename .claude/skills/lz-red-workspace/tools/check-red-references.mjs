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
// TWELVE FILES entries as of quick-260728-j9m: the eleven above plus test-double-taxonomy.md, the
// cross-author test-double vocabulary map. That entry sets requireFence: false on purpose -- the
// taxonomy is prose and pipe tables only, so it never enters the tsc extractor's fence gate and the
// lz-red tree's fence count is unchanged by it.
//
// Additions in quick-260728-j9m, every one PURELY ADDITIVE (no pre-existing topic, flag or gate was
// weakened, loosened or removed):
//   - `absent` now accepts EITHER a single guard object (as before) or an ARRAY of them, so one file
//     can carry several no-stale-text guards. The DEL-7 contradiction sweep needs three of them.
//   - An OPTIONAL per-entry `scaffoldExempt` array filters SCAFFOLD_RES for that entry only. It is
//     set on the taxonomy entry ALONE, to /\bplaceholder\b/i, because that word is a REGISTERED
//     ALIAS in the source taxonomy this document maps -- a domain term there, not a draft marker.
//     Same precedent as lib/scaffold-phrases.mjs keeping TODO uppercase-only so a `todos` domain
//     example never false-fails. The shared phrase list is deliberately NOT edited: the lz-refactor
//     battery imports it too, and this exemption must not reach any other file.
//   - A post-loop sha256 BYTE-IDENTITY gate: test-double-taxonomy.md ships as three copies (lz-red,
//     lz-tpp, lz-refactor), one per skill because a bundled reference is scoped to its own skill
//     directory. Duplication is safe only while the copies cannot drift, so the digests must agree.
//   - Every gate added by that task carries a leading `[j9m] ` in its LABEL, so the new RED baseline
//     is mechanically separable from the eleven pre-existing surfaces. No pre-existing label changed.
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
//   - G1-G5, G11, G12 are taxonomy `absent` guards; G6-G10 and G13 taxonomy positive topics; G14 and
//     G15 net-new SEMANTIC guards on the lz-red SKILL.md worked example (the entry already had an
//     absent guard -- what it lacked was any guard on the example, which is why stale contradicting
//     text passed at 12/12); G16 a principle-backing.md positive topic; G17 a net-new post-loop
//     bare-qualifier gate. The taxonomy label constant below belongs to the sha256 byte-identity
//     gate, NOT to any coinage gate, and was deliberately left alone.
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
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { SCAFFOLD_RES } from "./lib/scaffold-phrases.mjs";
import { findBookCitedAsOwned } from "./lib/provenance-honesty.mjs";
import { ROW_SCOPED_GUARDS, COUNT_GUARDS, RETIRED_LABELS } from "./lib/row-guards.mjs";

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
    ],
    deferral: null,
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
  {
    // NET-NEW (quick-260728-j9m): the cross-author test-double vocabulary map, shipped as three
    // byte-identical copies (the digests are gated post-loop). requireFence is FALSE by house rule --
    // this document is prose and pipe tables only, so it never enters the tsc extractor's fence gate.
    // scaffoldExempt carries the ONE narrow exemption: /\bplaceholder\b/i is a registered alias in the
    // source taxonomy this document maps, so here it is a domain term the document MUST name, not a
    // draft marker. The exemption is scoped to this entry and lib/scaffold-phrases.mjs is untouched.
    name: "test-double-taxonomy.md",
    requireFence: false,
    labelPrefix: "[j9m] ",
    scaffoldExempt: [/\bplaceholder\b/i],
    topics: [
      { label: "[j9m] table of contents", re: /table of contents/i },
      { label: "[j9m] lifetime axis", re: /lifetime/i },
      { label: "[j9m] bare-stub collision headline", re: /collision/i },
      { label: "[j9m] defines-vs-uses column", re: /\bdefines\b/i },
      { label: "[j9m] Self Shunt disclosure model", re: /self shunt/i },
      { label: "[j9m] Saboteur polarity caveat", re: /saboteur/i },
      { label: "[j9m] Overspecified Software citation", re: /overspecified software/i },
      { label: "[j9m] Cooper false-friend caveat", re: /false friend/i },
      { label: "[j9m] degraded-scan confidence caveat", re: /degraded scan/i },
      { label: "[j9m] appendices not exhaustive", re: /not exhaustive/i },
      { label: "[j9m] authority is per cell", re: /per cell|per-cell/i },
      { label: "[j9m] Meszaros scoped as a reference frame, not the spine", re: /reference frame/i },
      { label: "[j9m] inherited disagreement named", re: /inherited/i },
      { label: "[j9m] no declared precedence for the TDD content sources", re: /no declared precedence/i },
      // [wev] Positive topics G6-G10 and G13. Each is a CONTRACT on the revised document's wording,
      // and each FAILED at baseline because the target wording did not exist yet.
      // G6: the axis count as a word plus the word axes, which the section-1 heading must carry.
      { label: "[wev G6] three-axis count named", re: /three axes/i },
      // G7: the never-assert-an-empty-cell doctrine must be STATED, not merely obeyed, so the guard
      // stays falsifiable even when every cell happens to be populated.
      { label: "[wev G7] never-assert-an-empty-cell doctrine stated", re: /\bnever asserts\b/i },
      // [2ig] The SIXTH file-scoped topic removed here: `[wev G8] Bernhardt row names a specific
      // delivery` (/\b(PyCon|SCNA)\b/i). TWO Sources bullets name a delivery, so the ROW's delivery
      // name could be stripped with the guard still green. Replaced by `bernhardtDeliveryNamed` in the
      // post-loop [2ig] block, which asserts the ROW's own Source cell.
      // G9: the compound adjective for the version qualifier in the closing tier block.
      { label: "[wev G9] tier assertions are version-bound", re: /version-bound/i },
      // G10: what an automatic transcript can garble -- the medium qualifier and its absence-claim
      // corollary both turn on it.
      { label: "[wev G10] transcript mistranscription named", re: /mistranscri/i },
      // G13: the INDEPENDENCE claim that replaces the deleted seniority argument. The bare word
      // `independent` is VACUOUS as a needle -- the document already says twelve independent sources
      // -- so the needle is the two-word phrase for two vocabularies that collided without either
      // author citing the other.
      { label: "[wev G13] independent vocabularies, no seniority claim", re: /independent vocabularies/i },
      // [2ig] TEN positive topics, one per content addition this task makes, so each is RED until
      // authored. MEASURED: every needle below has ZERO occurrences in the pre-edit document, which is
      // what makes them RED-at-baseline rather than decoration.
      // The count attributed to the FIGURE instead of to the author as his own framing -- the defect
      // class this remediation exists to remove, repeated at nine sites.
      { label: "[2ig] five-kind count attributed to the hierarchy figure", re: /hierarchy figure/i },
      // The caveat a coach needs most: his PROSE states four, by folding two members into one bullet.
      { label: "[2ig] prose states four by folding two members", re: /prose states four/i },
      // The enumeration itself is machine-checked by `fiveKindsEnumerated` below; this topic gates the
      // sentence that says WHAT the five are a reading of.
      { label: "[2ig] the five kinds enumerated as direct subtypes", re: /direct subtypes/i },
      // The Defines-or-uses repair: a NAMING citation and a MEANING citation are different asks.
      { label: "[2ig] naming citation versus meaning citation", re: /naming citation/i },
      // The one mis-levelled cell. The ROW-scoped assertion is `temporaryTestStubStatesRelationship`;
      // this topic gates the AXIS nuance that makes the relationship informative.
      { label: "[2ig] Temporary Test Stub relationship on the lifecycle axis", re: /lifecycle axis/i },
      // Both absence claims must name the scope actually swept AND the unread remainder.
      { label: "[2ig] contested-word absence hedged to the swept scope", re: /not swept/i },
      { label: "[2ig] numeral absence hedged to the parts read end to end", re: /read end to end/i },
      // The POSITIVE finding, which is stronger evidence than the bare absence: a source that
      // articulates the CONCEPT and still never reaches for the word.
      { label: "[2ig] positive remote-variant finding across an address space", re: /address space/i },
      // The redirected near-miss warning. HOOK, never METHOD: `[wev G11]` is a live absent guard on the
      // do-nothing-METHOD phrasing, a term measured to occur nowhere in the corpus, so writing this
      // passage with the wrong noun trips that guard and reintroduces the phrasing it exists to keep out.
      { label: "[2ig] do-nothing hook is the real near-miss trap", re: /do-nothing hook/i },
      // The qualifier the dependent marks NON-OPTIONAL and the taxonomy currently drops.
      { label: "[2ig] non-optional kanban qualifier carried", re: /one position among several/i },
    ],
    // [wev] The taxonomy entry carried NO absent guard at all before this task -- only positive
    // topics, which is how a self-falsifying claim, a fabricated mapping and a relative
    // self-reference all shipped at full GREEN. G1-G5, G11 and G12 close that.
    absent: [
      // G1: the invented two-word term. Removed, not softened.
      { label: "[wev G1] no invented term", re: /signature skeleton/i },
      // G2: the self-falsifying claim that a cell is named by no author, which the document's own
      // table falsified with five populated rows.
      { label: "[wev G2] no empty-cell assertion", re: /no author names/i },
      // G3: skill-relative self-reference. This machine-enforces the byte-identity rule: the file is
      // byte-identical across three skills, so a relative reference resolves differently in each
      // copy. Explicit naming of a specific skill stays legal; only the relative form is banned.
      { label: "[wev G3] no skill-relative self-reference", re: /\bthis skill\b/i },
      // G4: the word describing the fabricated mapping's audit status. There is no mapping to audit.
      { label: "[wev G4] no unaudited-mapping caveat", re: /\bunaudited\b/i },
      // G5: the carve-out that exempted one cell from the degraded-scan caveat -- precisely the
      // fabricated cell, so the carve-out inverted the actual reliability.
      { label: "[wev G5] no degraded-scan carve-out", re: /other than the Beck cell/i },
      // G11: the Metz term that occurs nowhere in the twenty-one-file corpus.
      { label: "[wev G11] no non-occurring Metz term", re: /do-nothing method/i },
      // G12: the SUPERSEDED two-axis wording, one needle over both the axis-count phrase and the
      // four-cell phrase. LOAD-BEARING: topics are file-scoped and match anywhere, so G6 alone is
      // satisfied by the new prose appearing while the old heading, the old anchor and the four-cell
      // sentence all still stand -- a document asserting BOTH axis counts, at full GREEN. The needle
      // deliberately does not catch the legitimate new phrasing about all four COMBINATIONS of the
      // first and second axes; combinations are not cells.
      { label: "[wev G12] no superseded two-axis or four-cell wording", re: /two[ -]axes|four cells/i },
      // [2ig] SIX absent guards, one per banned wording. All six are RED-at-baseline; if one already
      // passes, its needle is wrong. Every needle below was VERIFIED single-line-matchable against the
      // CURRENT wrap, because `absent` guards run through the per-line loop and cannot use the
      // whitespace-flattening that lib/row-guards.mjs mandates for its own multi-word needles. That
      // hazard is live and already bit this checker once (see the narrowing comment on the
      // anti-patterns guard). The deliberate-negative needle is the sharp case: the phrase DELIBERATE
      // NEGATIVE itself WRAPS across two lines, so no needle over that phrase could ever match, and the
      // needle is instead the inference's discriminating tail, which sits wholly on one line.
      //
      // The set-scoped emptiness form, at the hard rule's own legalising clause AND at the bullet using
      // it. The previous round rewrote the rule to BLESS a scoped wording; that is not a fix, so the
      // rule must state the prohibition and carry no clause legalising a scoped form.
      { label: "[2ig] no set-scoped emptiness assertion", re: /no source in this set populates/i },
      // The INTENT inference that a blank column is deliberate rather than an oversight. The blank-column
      // FACT stays; only the inference goes.
      { label: "[2ig] no deliberate-negative intent inference", re: /rather than an oversight/i },
      // The universal quantifier over candidate names, falsified by a non-colliding candidate.
      { label: "[2ig] no every-available-name universal quantifier", re: /Every available name/i },
      // The POSSESSIVE five-kinds attribution. SCOPE, stated honestly: this needle catches the four
      // possessive-determiner occurrences (`his`, `its`, and the explicit-name possessive), which are the
      // unambiguous violations. The five NON-possessive occurrences are covered instead by the pinned
      // site count in `fiveKindsEnumerated` and by the figure-attribution topic above -- NOT by this
      // needle. It deliberately does NOT catch the figure-attributed replacement, which keeps the numeral.
      { label: "[2ig] no possessive five-kinds attribution", re: /((\bhis|\bits)\s+|Meszaros'\s+)five kinds\b/i },
      // The two-appendix count. That book has THREE appendices, and naming one of them separately in the
      // same breath implies it is not an appendix.
      { label: "[2ig] no two-appendix count", re: /both appendices/i },
      // The only-OCCURRENCE phrasing. It is the only SENSE; there are three occurrences of it.
      { label: "[2ig] no only-occurrence skeleton phrasing", re: /only `skeleton`/i },
      // [gap] The CHRONOLOGY / SENIORITY ban, which the [2ig] round was required to enforce and did
      // not: the banned construction survived AND no guard existed to forbid it, so the battery went
      // 173/173 GREEN over it. The standing rule admits no form of chronology, seniority or ordering
      // between two authors' usages.
      //
      // SINGLE-TOKEN STEMS ONLY, and that is a MECHANISM constraint rather than a preference. `absent`
      // guards run through the per-line loop, so a multi-word needle is defeated by a wrap at the
      // ~100-column margin -- the hazard recorded on the anti-patterns guard above, and again on the
      // [2ig] set. A stem cannot wrap. The four MULTI-WORD constructions therefore live in the [gap]
      // post-loop block, which flattens whitespace first.
      //
      // `lineage` is DELIBERATELY NOT a needle, and the omission is reported rather than silent: this
      // document's own **Lineage.** block names which authors lz-red's DOCTRINE descends from, which is
      // a statement about doctrinal ancestry and not a temporal or seniority relation between two
      // authors' usages. Adding the needle would false-fail prose that must stay, so it is narrowed out
      // instead (measured: two legitimate occurrences).
      { label: "[gap] no chronology or seniority token", re: /postdat|predat|antedat|seniorit/i },
    ],
    deferral: null,
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

  for (const topic of spec.topics) {
    const hit = lines.some((line) => topic.re.test(line));
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

// SEAM-02 (D-09): the reverse pointers in the SHIPPED lz-tpp skill. The red-green-refactor seam is
// fully wired only when lz-tpp/SKILL.md points BACK at BOTH siblings -- lz-red (the red step) AND
// lz-refactor (the refactor step), added in one edit. Reads a path OUTSIDE the lz-red references
// tree, so it is a standalone post-loop block (mirrors the D-05 honesty-gate idiom). RED now: the
// shipped lz-tpp skill carries no cross-skill pointer section yet.
const lzTppSkillPath = path.join(repoRoot, "plugins", "lz-tdd", "skills", "lz-tpp", "SKILL.md");

if (fs.existsSync(lzTppSkillPath)) {
  const lzTppText = fs.readFileSync(lzTppSkillPath, "utf8");
  const bothPointers = /lz-red/.test(lzTppText) && /lz-refactor/.test(lzTppText);

  report(
    bothPointers,
    "lz-tpp/SKILL.md: SEAM-02 reverse pointers (lz-red AND lz-refactor)",
    bothPointers ? "" : "lz-tpp skill missing one or both reverse pointers"
  );
}

// [j9m] Byte-identity gate. test-double-taxonomy.md ships as THREE copies -- one per skill -- because
// a bundled reference is scoped to its own skill directory: no cross-skill ../ path, no symlink, and
// no plugin-root shared dir. That duplication is only safe while the copies cannot silently diverge,
// so sha256 must agree across all three. A standalone post-loop block (the D-05 honesty-gate and
// SEAM-02 idiom) because it reads paths OUTSIDE the lz-red references tree. FAILs loud and BY NAME on
// a missing copy rather than passing vacuously on the two that happen to exist.
const TAXONOMY_LABEL = "[j9m] test-double-taxonomy.md byte-identical across all three skills";
const taxonomyCopies = ["lz-red", "lz-tpp", "lz-refactor"].map((skill) => ({
  skill,
  file: path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "references", "test-double-taxonomy.md"),
}));
const missingCopies = taxonomyCopies.filter(({ file }) => !fs.existsSync(file));

if (missingCopies.length > 0) {
  report(false, TAXONOMY_LABEL, `copy MISSING for: ${missingCopies.map(({ skill }) => skill).join(", ")}`);
} else {
  const digests = taxonomyCopies.map(({ skill, file }) => ({
    skill,
    digest: createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
  }));
  const identical = digests.every(({ digest }) => digest === digests[0].digest);

  report(
    identical,
    TAXONOMY_LABEL,
    identical
      ? `sha256 ${digests[0].digest.slice(0, 12)} in all three`
      : `digests DIVERGED -- ${digests.map(({ skill, digest }) => `${skill}=${digest.slice(0, 12)}`).join(", ")}`
  );
}

// [wev] G17 BARE-QUALIFIER GATE. The taxonomy's own hard rule -- never use the contested word
// unqualified, say production-side or collaborator-side -- was enforced by NOTHING, so a regression
// was silent, and three of the six violations live at baseline were introduced by the very merge
// under review. A standalone post-loop block (the D-05 / SEAM-02 / byte-identity idiom) because it
// reads a whole tree plus paths outside the lz-red references dir.
//
// Scope: every .md under the lz-red references tree, PLUS the two SIBLING reference trees (lz-tpp and
// lz-refactor), plus the three shipped SKILL.md routers. All three TAXONOMY COPIES are EXCLUDED --
// there the word is the document's own subject matter and appears many times per copy by design.
//
// [2ig] The two sibling trees are the WIDENING half of a two-part fix. The taxonomy claimed the hard
// rule was machine-enforced outside itself while this gate walked only ONE of the three reference
// trees, so the claim was false for two thirds of the shipped surface. Widening alone is not enough --
// this gate lives in the lz-red development workspace, OUTSIDE the plugin, and is not shipped, so no
// installed copy carries it however wide the scope. The taxonomy's own wording is narrowed to say that;
// shipping either half alone leaves the claim false. MEASURED at widening time: ZERO new hits across
// both added trees, and the taxonomy-basename exclusion already covers their copies.
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
const BARE_QUALIFIER_LABEL = "[wev G17] no bare unqualified contested word outside the taxonomy";
const TAXONOMY_BASENAME = "test-double-taxonomy.md";

const collectMarkdown = (dir) => {
  const found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...collectMarkdown(full));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      found.push(full);
    }
  }

  return found;
};

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
  ...referenceTreeFiles.filter((file) => path.basename(file) !== TAXONOMY_BASENAME),
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

// [2ig] ROW-SCOPED and COUNT guards, from lib/row-guards.mjs. Post-loop because they need PARSED CELLS
// rather than a line match, and because two of them read across files. Each returns `{ ok, why }` and
// maps onto exactly ONE report call, so the roster arithmetic below stays legible.
//
// A MISSING file yields "" here, and EVERY guard FAILS on "" -- proven by the anti-vacuity control in
// tools/row-guards.selftest.mjs. That is DELIBERATELY unlike the existsSync-gated D-05 and SEAM-02
// blocks above, which emit NOTHING at all if their file vanishes (a fully silent vacuous pass that the
// roster gate exists partly to catch).
const readOrEmpty = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const taxonomyText = readOrEmpty(path.join(REFERENCES, TAXONOMY_BASENAME));
const backingText = readOrEmpty(principleBackingPath);

const TWO_IG_GUARDS = [
  // Seven ROW-SCOPED guards. Six replace a file-scoped needle removed from FILES above; the Temporary
  // Test Stub one is net-new. Each keys on a FULL row name, never a bare word that could collide.
  {
    label: `${TAXONOMY_BASENAME}: [2ig] Bernhardt row names a specific delivery`,
    run: () => ROW_SCOPED_GUARDS.bernhardtDeliveryNamed(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] Temporary Test Stub row states its relationship`,
    run: () => ROW_SCOPED_GUARDS.temporaryTestStubStatesRelationship(taxonomyText),
  },
  {
    label: "principle-backing.md: [2ig] failure-versus-error boundary ROW backed",
    run: () => ROW_SCOPED_GUARDS.failureVsErrorRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] classify-first seam ROW backed with the canonical tier",
    run: () => ROW_SCOPED_GUARDS.seamRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] test-double taxonomy ROW backed",
    run: () => ROW_SCOPED_GUARDS.taxonomyRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] Three Laws spine ROW backed",
    run: () => ROW_SCOPED_GUARDS.threeLawsRowBacked(backingText),
  },
  {
    label: "principle-backing.md: [2ig] kanban-cycle essay named IN THE ROW",
    run: () => ROW_SCOPED_GUARDS.kanbanEssayNamedInRow(backingText),
  },
  // Nine COUNT guards. Each derives its total from an authoritative list on the page (or from the axes)
  // and asserts BOTH the stated number WORD and the number of SITES stating it. The site count is the
  // load-bearing half: without it, DELETING a stated total passes silently.
  {
    label: `${TAXONOMY_BASENAME}: [2ig] mapped-source count re-derived`,
    run: () => COUNT_GUARDS.twelveSources(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] cell count re-derived from the axes`,
    run: () => COUNT_GUARDS.eightCellsFromAxes(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] axis count re-derived`,
    run: () => COUNT_GUARDS.threeAxes(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] cell row count re-derived`,
    run: () => COUNT_GUARDS.sixRowsInCell(taxonomyText),
  },
  // ONE report even though it scans BOTH files: the count is restated in the dependent's taxonomy row,
  // so both sites belong to one claim. Emitting one report per file would make the measured total 173.
  {
    label: "[2ig] owned-source count re-derived across both files",
    run: () => COUNT_GUARDS.fourOwnedSourcesName(taxonomyText, backingText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] kinds count re-derived from the enumeration`,
    run: () => COUNT_GUARDS.fiveKindsEnumerated(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] closing-qualifier count re-derived`,
    run: () => COUNT_GUARDS.threeFurtherQualifiers(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] ambiguity survey counts re-derived`,
    run: () => COUNT_GUARDS.ambiguitySurveyCount(taxonomyText),
  },
  {
    label: `${TAXONOMY_BASENAME}: [2ig] no empty data cell in the per-author table`,
    run: () => COUNT_GUARDS.noEmptyDataCell(taxonomyText),
  },
];

for (const guard of TWO_IG_GUARDS) {
  const { ok: guardOk, why } = guard.run();

  report(guardOk, guard.label, guardOk ? "" : why);
}

// [gap] CHRONOLOGY PHRASE GATE -- the WRAP-PROOF half of the ban whose single-token half sits in the
// taxonomy's `absent` set above. These four constructions each establish a temporal or precedence
// relation in MORE THAN ONE WORD, and not one of them can be narrowed to a single token without
// false-failing legitimate prose: `precedence` alone is a live domain word here (the section-2
// Precedence block, plus a pinned no-declared-precedence topic), while `vocabulary` and `first` are far
// too common. So the per-line `absent` set cannot express them -- a wrap at the ~100-column margin
// defeats any multi-word needle there. They run against WHITESPACE-FLATTENED text instead, which is the
// FLATTEN BEFORE MATCHING invariant lib/row-guards.mjs already states for its own multi-word needles.
// A standalone post-loop block on the G17 precedent: G17 is likewise a prose-absence gate the per-file
// loop cannot express.
//
// SCOPED TO THE lz-red COPY ALONE, and that is sufficient rather than lazy: the sha256 byte-identity
// gate above already forces all three copies equal, so a banned phrase cannot survive in a sibling copy
// while this one is clean.
//
// The EMPTY-TEXT leg is an anti-vacuity control, not defensive noise: `readOrEmpty` yields "" for a
// missing file, and an absence gate over "" would report PASS forever -- the wev R1 defect class.
const CHRONOLOGY_PHRASES = [/came\s+first/i, /older\s+vocabulary/i, /earlier\s+vocabulary/i, /takes\s+precedence/i];
const CHRONOLOGY_LABEL = `${TAXONOMY_BASENAME}: [gap] no chronology or seniority phrase (wrap-proof)`;
const flatTaxonomy = taxonomyText.replace(/\s+/g, " ");
const chronologyHits = CHRONOLOGY_PHRASES.filter((re) => re.test(flatTaxonomy)).map((re) => String(re));

if (taxonomyText === "") {
  report(false, CHRONOLOGY_LABEL, "the taxonomy read as EMPTY, so this gate checked nothing");
} else {
  report(
    chronologyHits.length === 0,
    CHRONOLOGY_LABEL,
    chronologyHits.length === 0 ? "" : `banned construction still present (matches ${chronologyHits.join(", ")})`
  );
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
// existsSync-gated post-loop block that silently emits nothing -- the D-05 honesty gate and the SEAM-02
// block both do exactly that today if their file vanishes, a fully silent vacuous pass.
//
// WHAT IT DOES NOT CATCH, and nobody may mistake this gate for sufficient: a guard WEAKENED IN PLACE
// leaves the count unchanged. Only the selftest evasion proofs cover that. A bare count is also blind to
// a SHORT SWAP that happens to balance, which is why the label-set assertions below exist and why
// tools/row-guards.selftest.mjs asserts the exported guard NAME set independently.
const EXPECTED_CHECKS = 174;
const ROSTER_LABEL = "[2ig] roster integrity: exact emitted-check count";

// Every label the [2ig] and [gap] rounds ADD, composed exactly as emitted (`<filename>: <label>` inside
// the FILES loop, verbatim for a post-loop block). Hand-maintained alongside EXPECTED_CHECKS for the same
// reason: a short swap that balances the count still fails here. The roster label itself is absent from
// this list -- it has not been emitted yet at the moment it is checked.
const NEW_LABELS = [
  `${TAXONOMY_BASENAME}: [2ig] five-kind count attributed to the hierarchy figure`,
  `${TAXONOMY_BASENAME}: [2ig] prose states four by folding two members`,
  `${TAXONOMY_BASENAME}: [2ig] the five kinds enumerated as direct subtypes`,
  `${TAXONOMY_BASENAME}: [2ig] naming citation versus meaning citation`,
  `${TAXONOMY_BASENAME}: [2ig] Temporary Test Stub relationship on the lifecycle axis`,
  `${TAXONOMY_BASENAME}: [2ig] contested-word absence hedged to the swept scope`,
  `${TAXONOMY_BASENAME}: [2ig] numeral absence hedged to the parts read end to end`,
  `${TAXONOMY_BASENAME}: [2ig] positive remote-variant finding across an address space`,
  `${TAXONOMY_BASENAME}: [2ig] do-nothing hook is the real near-miss trap`,
  `${TAXONOMY_BASENAME}: [2ig] non-optional kanban qualifier carried`,
  `${TAXONOMY_BASENAME}: [2ig] no set-scoped emptiness assertion`,
  `${TAXONOMY_BASENAME}: [2ig] no deliberate-negative intent inference`,
  `${TAXONOMY_BASENAME}: [2ig] no every-available-name universal quantifier`,
  `${TAXONOMY_BASENAME}: [2ig] no possessive five-kinds attribution`,
  `${TAXONOMY_BASENAME}: [2ig] no two-appendix count`,
  `${TAXONOMY_BASENAME}: [2ig] no only-occurrence skeleton phrasing`,
  ...TWO_IG_GUARDS.map((guard) => guard.label),
  // [gap] The two halves of the chronology ban. Both listed BY NAME, not just counted: the count alone
  // cannot see one half being dropped while something else is added.
  `${TAXONOMY_BASENAME}: [gap] no chronology or seniority token`,
  CHRONOLOGY_LABEL,
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
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} lz-red surfaces authored (SKILL.md coach procedure + SEL/STR/NAME/ASRT/RTR/VIT/ANTI references + the test-double taxonomy) with topics + required ts fences + cross-links, no scaffold leak, no stale Phase-18 markers, the red criterion consistent across every surface that restates it, taxonomy byte-identical in all three skills, SEAM-02 lz-tpp reverse pointers present, D-05 honesty gate holds`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} surfaces present, ${failures} check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)`);
process.exit(1);
