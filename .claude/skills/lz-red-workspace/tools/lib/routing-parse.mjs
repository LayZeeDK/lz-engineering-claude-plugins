// Single source of truth for parsing this plugin's red-green-refactor CLASSIFIER SURFACES into
// (condition -> destination) pairs, so a routing verdict can be DERIVED from a parsed table rather
// than matched with a presence needle (D-15). Consumed by tools/check-rgr-routing.mjs and by
// tools/check-rgr-routing.selftest.mjs, which is why the parse lives here and not inside the
// checker: the selftest drives these exports over in-memory fixtures while the real gate reads the
// shipped tree.
//
// WHY A PARSED TABLE. quick-260803-53q finding F-1 MEASURED the ceiling of the presence needle it
// shipped: reverting both routing sites to sibling-blind text while keeping a RENAMED heading left
// the 125-check battery GREEN. A needle whose subject can be renamed out from under it cannot hold
// routing semantics. Here the heading is an INPUT to the parse, so a rename makes sectionBody return
// null, which is a FAILURE with an attributable label -- the exact inverse of F-1, where the heading
// was the assertion.
//
// THE THREE STAGES.
//   1. Locate, fail closed. sectionBody(text, surface.heading). `null` means the heading is absent
//      (or the file was unreadable and the caller handed us ""), and `null` is a FAILURE -- never a
//      skip, never a `continue`. The caller reads its files with try/catch -> "" (the TD-02 idiom)
//      and never gates a read on a file-existence probe, so exactly one report() fires per surface
//      per run (D-17). The checker's own header names the probe API it refuses, by design; this lib
//      keeps the token out of its text so a token grep over the lib stays clean.
//   2. Split into branches, then whitespace-flatten EACH branch. Flattening at BRANCH scope, not at
//      file scope, is what makes a multi-word needle wrap-proof without loosening anything else --
//      the structural form of check-red-references.mjs's per-entry `wholeText` opt-in, whose own
//      comment warns that a blanket whole-text flip would loosen every one of its ~100 per-line
//      topics (Pitfall 2).
//   3. Emit one record per branch: { surfaceId, branchId, conditionText, destinations,
//      keysOnTestState, isResidual, isBareCatchAll }.
//
// COVERAGE BOUNDARY. These exports describe what the AUTHORED text says. They say nothing about
// whether a model ROUTES correctly -- that is the metered eval's claim (CLS-05), not this parser's.
//
// Nothing here throws. Every function returns plain data, or { ok, why, branches } when a parse can
// fail. Node builtins only (in fact none -- only the sibling lib import).
//   imported by .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
import { sectionBody } from "./section-body.mjs";

// The three shipped skill slugs, in a fixed order that does NOT decide destination order -- the
// order emitted by destinationsIn is first-affirmed-occurrence order in the branch text.
const SKILL_NAMES = Object.freeze(["lz-red", "lz-tpp", "lz-refactor"]);

// ---------------------------------------------------------------------------------------------
// The eleven classifier surfaces, AS DATA.
//
// kind:         "router"    -- decides which skill owns the request.
//               "mode-gate" -- decides coach vs reference mode WITHIN one skill. It names no
//                              destination by design, and D-03 still forbids it from keying on test
//                              state, which is why mode gates are in this table at all.
// parseMode:    "lettered"  -- numbered item 1 of a coach procedure, split into a./b./c. branches.
//               "sentences" -- prose, split on sentence boundaries.
// owner:        the skill whose file the surface lives in ("plugin" for the plugin-wide reference).
// variantScope: "all"       -- present in every placement variant.
//               "variant-a" -- present in the tracked tree only.
//
// VARIANT FLIP CONTRACT (D-24). The tracked tree IS variant A. The three `variant-a` entries are the
// per-skill narrative sections; they exist in variant A and in variant B, and variant C collapses
// them into one shared table. Nothing in this gate depends on a metered run: the surface set below
// describes the TRACKED tree, and only an owner-approved A/B that selects variant B or C changes
// these three entries. No placement variant is selected inside Phase 22.
//
// HISTORY, no longer live: `beck-seam`'s heading was authored in 22-04, and during the
// instrument-first wave this entry was one of the DELIBERATE RED baselines because the file still
// carried the older two-way heading. That baseline is CLOSED. The file now carries
// `## The seam across the three steps` (beck-tdd-by-example.md:68), matching the entry below
// exactly, and the gate reports beck-seam PASS on the scan floor, the catch-all check and the
// single-axis check. Do not "repair" this entry -- it is already correct.
export const ROUTING_SURFACES = Object.freeze(
  [
    {
      id: "refactor-step1",
      file: "plugins/lz-tdd/skills/lz-refactor/SKILL.md",
      heading: "Coach decision procedure",
      kind: "router",
      owner: "lz-refactor",
      parseMode: "lettered",
      variantScope: "all",
    },
    {
      id: "refactor-modes",
      file: "plugins/lz-tdd/skills/lz-refactor/SKILL.md",
      heading: "Two modes",
      kind: "mode-gate",
      owner: "lz-refactor",
      parseMode: "sentences",
      variantScope: "all",
    },
    {
      id: "refactor-narrative",
      file: "plugins/lz-tdd/skills/lz-refactor/SKILL.md",
      heading: "Refactoring vs the red step (lz-red) and the green step (lz-tpp)",
      kind: "router",
      owner: "lz-refactor",
      parseMode: "sentences",
      variantScope: "variant-a",
    },
    {
      id: "red-step1",
      file: "plugins/lz-tdd/skills/lz-red/SKILL.md",
      heading: "Coach decision procedure",
      kind: "router",
      owner: "lz-red",
      parseMode: "lettered",
      variantScope: "all",
    },
    {
      id: "red-modes",
      file: "plugins/lz-tdd/skills/lz-red/SKILL.md",
      heading: "Two modes",
      kind: "mode-gate",
      owner: "lz-red",
      parseMode: "sentences",
      variantScope: "all",
    },
    {
      id: "red-narrative",
      file: "plugins/lz-tdd/skills/lz-red/SKILL.md",
      heading: "RED vs the green step (lz-tpp) and the refactor step (lz-refactor)",
      kind: "router",
      owner: "lz-red",
      parseMode: "sentences",
      variantScope: "variant-a",
    },
    {
      id: "tpp-step1",
      file: "plugins/lz-tdd/skills/lz-tpp/SKILL.md",
      heading: "Coach decision procedure",
      kind: "router",
      owner: "lz-tpp",
      parseMode: "lettered",
      variantScope: "all",
    },
    {
      id: "tpp-modes",
      file: "plugins/lz-tdd/skills/lz-tpp/SKILL.md",
      heading: "Two modes",
      kind: "mode-gate",
      owner: "lz-tpp",
      parseMode: "sentences",
      variantScope: "all",
    },
    {
      id: "tpp-narrative",
      file: "plugins/lz-tdd/skills/lz-tpp/SKILL.md",
      heading: "The green step vs the red step (lz-red) and the refactor step (lz-refactor)",
      kind: "router",
      owner: "lz-tpp",
      parseMode: "sentences",
      variantScope: "variant-a",
    },
    {
      id: "laws-classify",
      file: "plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md",
      heading: "The Three Laws spine and classify-first",
      kind: "router",
      owner: "lz-red",
      parseMode: "sentences",
      variantScope: "all",
    },
    {
      id: "beck-seam",
      file: "plugins/lz-tdd/references/beck-tdd-by-example.md",
      heading: "The seam across the three steps",
      kind: "router",
      owner: "plugin",
      parseMode: "sentences",
      variantScope: "all",
    },
  ].map((s) => Object.freeze(s))
);

// ---------------------------------------------------------------------------------------------
// The test-state predicate set, AS DATA (D-03).
//
// Every token pairs a STATE word with a CLAIM about the code or the suite, never a bare adverb.
// That is deliberate and it is the lesson selfcheck-red.mjs's STATE_CLAIM_TOKENS comment records:
// the ASK itself legitimately contains state words ("make this failing test pass" IS the request),
// so a bare `test pass` / `failing` token would fire on the ask and the guard would be measuring the
// wrong axis. What D-03 forbids is a branch that decides OWNERSHIP from the suite's pass/fail state.
//
// Seeded from the MEASURED live sites plus their obvious neighbours, so the set is drivable in both
// directions from day one: the tests-are-green gate in lz-refactor's `## Two modes`, the
// failing-red-test-plus-current-code gate in lz-tpp's `## Two modes`, the all-prior-tests-green
// precondition in lz-tpp step 1, the already-passing-code phrasing every current catch-all uses, and
// the nothing-failing-yet / tests-already-pass / has-a-smell family.
//
// COUPLED TO THE CORPUS: `nothing failing yet` is in here, so no branch may use that phrase as a
// routing condition. rgr-cases.json therefore keeps it OUT of case c4's matchTokens and binds c4 on
// the ASK ("add a new behavior") instead. Adding it to a case's matchTokens would make the gate
// self-contradictory -- unsatisfiable by construction.
export const TEST_STATE_TOKENS = Object.freeze([
  "tests are green",
  "tests are all green",
  "the tests already pass",
  "tests already pass",
  "all prior tests green",
  "all prior tests are green",
  "a failing (red) test plus",
  "a failing red test plus",
  "already-passing code",
  "already passing code",
  "code whose tests already pass",
  "nothing failing yet",
  "nothing is failing yet",
  // The SEMANTIC variant of the two above. Added after an unprimed review found it live in TWO
  // shipped descriptions (lz-red, lz-refactor) while `[cls-03] description single-axis` reported
  // banned=[] on both -- the wording is a member of this set by meaning and was not a member by
  // literal, so the guard passed a live D-03 violation on the one surface the skill selector reads.
  // Both directions were measured before the widening: keysOnTestState returned [] on the shipped
  // wording and ["nothing is failing yet"] on the token-list variant.
  "no test is failing yet",
  "no tests are failing",
  "has a smell",
  "the bar is green",
  "once the bar is green",
  "the suite is green",
]);

// ---------------------------------------------------------------------------------------------
// The declared residual terminal (D-01).
//
// BOTH halves are required: the branch must say the request is not a red-green-refactor-loop request
// AND say that no skill in the loop owns it. Requiring both is the whole point -- a branch that
// merely FORGOT to name an owner must FAIL as an unowned branch rather than pass itself off as the
// declared residual. Recognition is therefore by an explicit no-owner MARKER, never by the ABSENCE
// of a skill name.
//
// Expressed as two lookaheads in one RegExp so it stays a single exported RegExp while still
// requiring two separate phrases. Both phrases tolerate any run of whitespace, which costs nothing
// on already-flattened branch text and keeps the export usable on raw text too.
const NOT_LOOP_REQUEST = "not\\s+a\\s+red-green-refactor(?:-|\\s+)loop\\s+request";
const NO_SKILL_OWNS = "no\\s+skill\\s+in\\s+(?:this|the)\\s+loop\\s+owns";

export const RESIDUAL_MARKER_RE = new RegExp(
  `(?=[\\s\\S]*${NOT_LOOP_REQUEST})(?=[\\s\\S]*${NO_SKILL_OWNS})`,
  "i"
);

// A bare residual CONDITION: the otherwise / else / in-every-other-case family. In the TARGET shape
// each branch carries exactly one condition, so matching this family means the branch's condition IS
// the residual; that is the reading, and the regex stays a plain dumb family match because dumb is
// what keeps it mutation-sensitive.
export const CATCHALL_CONDITION_RE =
  /\botherwise\b|\belse\b|\bin\s+(?:every|all|any)\s+other\s+cases?\b|\bfailing\s+(?:all|any)\s+of\s+(?:those|these|the\s+above)\b/i;

// ---------------------------------------------------------------------------------------------
// Matchers.
// ---------------------------------------------------------------------------------------------

// Match a tracked BARE skill name ("lz-red") in text. Boundary-anchored on both sides so "lz-red"
// does not match "lz-redux" or "lz-red-extra"; the boundary class excludes "-" because the names
// contain one. This is run-e2e.mjs's matchesSkillName contract, written with lookarounds rather than
// a consuming character class for one reason: a consuming boundary swallows the character AFTER the
// match, so a global scan cannot enumerate two adjacent occurrences ("lz-red lz-red"). The
// zero-width form is semantically identical at the string edges (a lookbehind at index 0 succeeds
// exactly where `^` did) and it lets destinationsIn walk every occurrence.
const skillNameRe = (name, flags) => {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`(?<![a-z0-9-])${esc}(?![a-z0-9-])`, flags);
};

export const matchesSkillName = (text, name) => skillNameRe(name, "i").test(String(text));

// Clause-scoped, BIDIRECTIONAL negation awareness, ported from grade-run.mjs's occursAffirmed.
// Essential here rather than optional: the classifier prose NAMES all three skills, and most
// mentions sit inside EXCLUSION clauses ("Do NOT use it to ... use lz-tpp instead"). A bare
// includes() would count an exclusion as a destination, which IS the F-1 ceiling.
// ponytail: punctuation + conjunction + hedge heuristics, not a parser. Proven in grade-run's
// selfcheck and re-proven here over fixtures; upgrade to a real clause splitter only if an authored
// branch is provably mis-scored.
const NEG =
  /\b(?:not|no|never|neither|nor|without|isn't|aren't|wasn't|weren't|doesn't|don't|didn't|cannot|n't)\b/i;
const CONTRAST = /\b(?:but|however|rather|instead|whereas|while|though|although|yet)\b/gi;
const FWD_BOUNDARY =
  /\b(?:and|or|but|however|rather|instead|whereas|while|though|although|yet|because|since|so|plus)\b/i;
const HEDGE =
  /\b(?:might|may|could|would)\s+(?:guess|think|assume|suppose|expect|imagine|say|be\s+tempted)\b|\bat\s+first(?:\s+glance|\s+blush)?\b|\binitially\b|\bnaively\b|\bon\s+first\s+read\b|\btempting\s+to\s+(?:say|think|guess|assume)\b/i;
const CONTRAST_FWD = /\b(?:but|however|actually|instead|rather|whereas|yet|in\s+fact|really)\b/i;

const clauseBefore = (text, idx) => {
  let start = idx;

  while (start > 0 && !".,;:!?\n".includes(text[start - 1])) {
    start--;
  }

  let clause = text.slice(start, idx);
  const cm = [...clause.matchAll(CONTRAST)];

  if (cm.length) {
    const last = cm[cm.length - 1];
    clause = clause.slice(last.index + last[0].length);
  }

  return clause;
};

const clauseAfter = (text, end) => {
  let stop = end;

  while (stop < text.length && !".,;:!?\n".includes(text[stop])) {
    stop++;
  }

  let clause = text.slice(end, stop);
  const fm = clause.search(FWD_BOUNDARY);

  if (fm >= 0) {
    clause = clause.slice(0, fm);
  }

  return clause;
};

const sentenceAround = (text, idx, end) => {
  let s = idx;

  while (s > 0 && !".!?\n".includes(text[s - 1])) {
    s--;
  }

  let e = end;

  while (e < text.length && !".!?\n".includes(text[e])) {
    e++;
  }

  return { before: text.slice(s, idx), after: text.slice(end, e) };
};

const hedgedContrastive = (text, idx, end) => {
  const { before, after } = sentenceAround(text, idx, end);

  return HEDGE.test(before) && CONTRAST_FWD.test(after);
};

// Index of the first AFFIRMED occurrence of `name` in `text`, or -1. Affirmed = present, negated in
// neither direction, and not a hedged-then-retracted hypothetical.
const firstAffirmedIndex = (text, name) => {
  const re = skillNameRe(name, "gi");
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
};

// The ORDERED array of skill names the branch AFFIRMS as destinations, in first-affirmed-occurrence
// order. Order is load-bearing: D-02's two-hop branch routes to lz-red and THEN lz-tpp, so the
// destination of a branch is an ordered array, never a single name.
//
// DELIBERATE NON-FEATURE: there is NO self-reference resolution. "continue here", "this skill" and
// "this skill's work" do NOT resolve to the owning slug, and they must not be made to. A literal
// parser is what makes a renamed heading (mutation 4) and a silently self-owning branch BOTH
// detectable; teaching the parser to resolve "this skill" would hand back exactly the slack the
// presence needle had. The literal-slug requirement therefore lives on the AUTHORED content -- waves
// 22-03 and 22-04 state it as a rule, including for the self-owning branch. Do not "fix" this.
//
// Consequence, and it is an EXPECTED part of the asserted-RED baseline rather than a parser bug:
// today's shipped self-owning branches use the house self-reference form, so they parse to zero
// destinations for their own owner.
export const destinationsIn = (branchText) => {
  const text = String(branchText == null ? "" : branchText);
  const hits = [];

  for (const name of SKILL_NAMES) {
    const idx = firstAffirmedIndex(text, name);

    if (idx >= 0) {
      hits.push({ name, idx });
    }
  }

  return hits.sort((a, b) => a.idx - b.idx).map((h) => h.name);
};

// The tokens from `tokens` that appear in `conditionText`, case-insensitively. PURE, and exported so
// it can be driven in BOTH directions -- the selftest feeds it a live-shaped test-state gate
// (must match) AND an ask-only condition (must not).
//
// Empty and whitespace-only tokens are dropped rather than matched: "" is a substring of every
// string, so one blank entry would make the guard claim to have caught everything.
export const keysOnTestState = (conditionText, tokens = TEST_STATE_TOKENS) => {
  const lowered = String(conditionText == null ? "" : conditionText).toLowerCase();

  return (Array.isArray(tokens) ? tokens : [])
    .filter((t) => typeof t === "string" && t.trim() !== "")
    .filter((t) => lowered.includes(t.toLowerCase()));
};

// The folded YAML `description:` block, joined with single spaces and trimmed, or null when the
// key is absent. Used to measure each shipped description against the 1,536-char per-entry listing
// cap so D-06's rewording budget is ASSERTED, not assumed.
export const foldedDescription = (text) => {
  const lines = String(text == null ? "" : text).split("\n");
  const start = lines.findIndex((l) => /^description:\s*>-?\s*$/.test(l));

  if (start === -1) {
    return null;
  }

  const body = [];

  for (let i = start + 1; i < lines.length; i++) {
    if (!/^\s+\S/.test(lines[i])) {
      break;
    }

    body.push(lines[i].trim());
  }

  return body.join(" ").trim();
};

// Prose between the H1 title and the first `## ` heading, or null when no H1 line is found. This is
// the "intro paragraph" blind spot: every ROUTING_SURFACES entry anchors to a `## ` heading (Stage 1
// above), so text here is outside all eleven parsed surfaces. This is exactly where the review that
// opened this phase found lz-refactor's two-hop BLOCKER (the intro named only the second hop) and
// lz-red's stale "restructuring passing code" vocabulary -- both invisible to the routing gate until
// an unprimed human review caught them by reading the file, never by running the checker. Added by
// gap-closure follow-up after 22-08-SUMMARY.md recorded, in its own words, that "every gap this plan
// closes sits OUTSIDE the 11 surfaces check-rgr-routing.mjs parses, so the gate is structurally blind
// to all of them."
export const introBody = (text) => {
  const raw = String(text == null ? "" : text);
  const afterH1 = raw.split(/^#[ \t]+.+$/m);

  if (afterH1.length < 2) {
    return null;
  }

  return afterH1[1].split(/^##[ \t]+/m)[0];
};

// ---------------------------------------------------------------------------------------------
// The parse.
// ---------------------------------------------------------------------------------------------

const flatten = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();

// Text of top-level numbered item `n` from a coach-procedure body, or null. Anchored at column zero
// so an indented lettered sub-item or a nested bullet can never be mistaken for a new item.
const numberedItem = (body, n) => {
  const parts = body.split(/^(\d+)\.[ \t]+/m);

  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i] === String(n)) {
      return parts[i + 1];
    }
  }

  return null;
};

// Item 1 split into its a./b./c. sub-items. When no lettered sub-item exists the whole item is ONE
// branch -- the degenerate shape of today's tree, where a single prose blob carries several
// conditions at once. That degenerate branch is exactly what the assertions then judge; it must not
// be silently discarded.
const letteredChunks = (body) => {
  const item = numberedItem(body, 1);

  if (item === null) {
    return [];
  }

  const parts = item.split(/^[ \t]*([a-z])\.[ \t]+/m);

  if (parts.length < 3) {
    return [{ id: "1", text: item }];
  }

  const out = [];

  for (let i = 1; i < parts.length; i += 2) {
    out.push({ id: `1${parts[i]}`, text: parts[i + 1] });
  }

  return out;
};

// The LEAD-IN prose of numbered item 1 -- everything before the first `a.` sub-item -- flattened.
// Returns null when item 1 is absent, and "" when item 1 has no lettered sub-items (the degenerate
// shape letteredChunks already returns whole, so there is no separate lead-in to judge).
//
// WHY THIS EXISTS, and why it is NOT folded into letteredChunks. The loop above starts at i = 1 and
// therefore DISCARDS parts[0], which is exactly this lead-in. An unprimed review found the literal
// banned token `all prior tests green` living there in lz-tpp step 1, one sentence after the same
// step forbids that axis -- invisible to all eleven parsed surfaces. The TEST_STATE_TOKENS seed
// comment above had even named that site as a source, so the token was listed for a location the
// parser could never reach.
//
// This is the SAME SHAPE as the intro-prose hole Phase 22 closed (prose above the first `## `
// heading, outside every surface). Closing that one did not close this one: there, the blind region
// was above the first heading; here, it is before the first lettered branch.
//
// Deliberately a separate surface rather than an extra BRANCH: the exhaustiveness, at-most-one and
// bare-catch-all assertions all judge routing branches, and a lead-in is not a branch -- feeding it
// in would make a non-branch answerable for owning corpus cases. introBody set the precedent of a
// dedicated surface with a dedicated single-axis check; this follows it.
// Takes the FULL file text plus the surface heading, mirroring introBody's shape, so the caller
// needs no access to sectionBody. `null` is UNREACHABLE (heading absent or item 1 absent) and is a
// FAILURE for the caller to report, never a skip -- same contract as parseRoutingBranches.
export const step1LeadIn = (text, heading) => {
  const body = sectionBody(String(text == null ? "" : text), heading);

  if (body === null) {
    return null;
  }

  const item = numberedItem(body, 1);

  if (item === null) {
    return null;
  }

  const parts = item.split(/^[ \t]*([a-z])\.[ \t]+/m);

  if (parts.length < 3) {
    return "";
  }

  return flatten(parts[0]);
};

// Flatten the whole section, then split on sentence boundaries.
// ponytail: punctuation-boundary split, not a sentence tokenizer. A markdown link target
// ("(references/smells.md)") has no whitespace after its period so it does not split, and an
// abbreviation would merely merge two fragments -- which cannot turn a FAIL into a PASS, because
// every assertion here is "does a branch exist that ...". Upgrade only if a merged fragment is shown
// to mask a real defect.
const sentenceChunks = (body) => {
  const flat = flatten(body);

  if (flat === "") {
    return [];
  }

  return flat.split(/(?<=[.!?])\s+/).map((text, i) => ({ id: `s${i + 1}`, text }));
};

// Parse ONE surface into branches. Returns { ok, why, branches } and never throws.
//
// `ok: false` is a FAILURE for the caller to report against this surface's id -- never a skip. The
// three ways it happens are all attributable: the caller handed us "" (unreadable file), the heading
// is absent (a rename -- the F-1 closure), or the section parsed to zero branches.
export const parseRoutingBranches = (text, surface) => {
  const raw = String(text == null ? "" : text);
  const body = sectionBody(raw, surface.heading);

  if (body === null) {
    const why =
      raw.trim() === ""
        ? `surface text is empty -- unreadable file or empty document, so heading "${surface.heading}" is unreachable`
        : `heading absent -- no "## ${surface.heading}" line in this file`;

    return { ok: false, why, branches: [] };
  }

  const chunks = surface.parseMode === "lettered" ? letteredChunks(body) : sentenceChunks(body);
  const branches = [];

  for (const chunk of chunks) {
    const conditionText = flatten(chunk.text);

    if (conditionText === "") {
      continue;
    }

    const destinations = destinationsIn(conditionText);
    const isResidual = RESIDUAL_MARKER_RE.test(conditionText);

    // Sentence-split ROUTERS drop fragments that neither affirm a skill name nor declare the
    // residual: prose sections carry lead-ins and pointers that are not branches. The filter is
    // scoped to routers on purpose -- a mode-gate names no destination BY DESIGN, so filtering it
    // would leave zero branches and make the single-axis assertion vacuous on precisely the two
    // gates D-03 names. Lettered items are structurally delimited, so they are never filtered.
    if (
      surface.kind === "router" &&
      surface.parseMode === "sentences" &&
      destinations.length === 0 &&
      !isResidual
    ) {
      continue;
    }

    branches.push({
      surfaceId: surface.id,
      branchId: chunk.id,
      conditionText,
      destinations,
      // The matched tokens, not a boolean, so the report can NAME what it caught.
      keysOnTestState: keysOnTestState(conditionText),
      isResidual,
      // A bare catch-all terminal (D-01): an otherwise-conditioned branch that is NOT the declared
      // residual. The owner-naming half of the obvious three-part predicate is deliberately NOT
      // required, and that is a correction rather than a loosening: today's four shipped catch-alls
      // say "otherwise ... is this skill's work" in the house SELF-REFERENCE form, which a
      // literal-slug parser cannot see as the owner (and must not learn to -- see destinationsIn).
      // Requiring the owner slug would therefore make this check un-failable against exactly the
      // branches it exists to catch: the guard-that-cannot-fail class. In the TARGET shape the
      // residual terminal DOES match RESIDUAL_MARKER_RE and every positive branch carries a
      // positive condition, so this stays GREEN on the shape waves 22-03/22-04 author.
      isBareCatchAll: CATCHALL_CONDITION_RE.test(conditionText) && !isResidual,
    });
  }

  if (branches.length === 0) {
    return {
      ok: false,
      why: `section "${surface.heading}" parsed to zero branches (parseMode ${surface.parseMode})`,
      branches: [],
    };
  }

  return { ok: true, why: "", branches };
};
