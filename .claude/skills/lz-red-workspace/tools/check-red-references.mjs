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
      // Phase-18 slice (filled this phase; LAW / SEAM backing rows + access tiers).
      { label: "Three Laws backing row", re: /three laws/i },
      { label: "lz-tpp seam backing row", re: /seam|handoff/i },
      // DEL-5 fix (5): the new taxonomy reference is backed like every other recommendation.
      { label: "[j9m] test-double taxonomy backing row", re: /test-double-taxonomy\.md/ },
      // DEL-7e: the retagged criterion rests on the failure-versus-error boundary (Fowler), which the
      // superseded Clean Code Ch. 9 row could not carry -- that chapter contradicts the criterion.
      { label: "[j9m] failure-vs-error boundary row", re: /failure|error boundary/i },
      // [wev] G16: the title of the owned Beck essay that establishes the kanban-cycle surface. This
      // gates the one fix in the revision that closes a SHIPPED self-contradiction -- the same file
      // asserting both that the owned surface was NOT established and that Beck is one of four owned
      // sources citing it. An untiered provenance claim slipping through unnoticed is the exact
      // defect class the revision exists to correct, so it gets a machine lock rather than trust.
      // The essay TITLE, never the book title: the D-05 honesty gate below fails any row whose
      // Source cites the book with a tier beginning `Owned`.
      { label: "[wev G16] kanban-cycle essay named as the owned surface", re: /TDD is Kanban for Code/i },
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
      // G8: citing the Boundaries talk without a delivery IS the defect -- the two deliveries differ
      // on exactly the point the row asserts, so findings cannot transfer between them.
      { label: "[wev G8] Bernhardt row names a specific delivery", re: /\b(PyCon|SCNA)\b/i },
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

const report = (ok, label, detail) => {
  if (!ok) {
    failures++;
  }

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
// Scope: every .md under the lz-red references tree, plus the three shipped SKILL.md routers. All
// three TAXONOMY COPIES are EXCLUDED -- there the word is the document's own subject matter and
// appears twenty-seven times per copy by design.
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

const bareQualifierTargets = [
  ...collectMarkdown(REFERENCES).filter((file) => path.basename(file) !== TAXONOMY_BASENAME),
  ...["lz-red", "lz-refactor", "lz-tpp"].map((skill) =>
    path.join(repoRoot, "plugins", "lz-tdd", "skills", skill, "SKILL.md")
  ),
];
const bareQualifierHits = [];

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

console.log("");

if (failures === 0) {
  console.log(`SUMMARY: RED-REFS GREEN -- ${filesPresent}/${FILES.length} lz-red surfaces authored (SKILL.md coach procedure + SEL/STR/NAME/ASRT/RTR/VIT/ANTI references + the test-double taxonomy) with topics + required ts fences + cross-links, no scaffold leak, no stale Phase-18 markers, the red criterion consistent across every surface that restates it, taxonomy byte-identical in all three skills, SEAM-02 lz-tpp reverse pointers present, D-05 honesty gate holds`);
  process.exit(0);
}

console.log(`SUMMARY: RED-REFS RED -- ${filesPresent}/${FILES.length} surfaces present, ${failures} check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)`);
process.exit(1);
