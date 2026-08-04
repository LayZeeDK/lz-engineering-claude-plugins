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
// THE HOUSE VOCABULARY IS NOW COVERED TOO. The `none of the above` / `none of (a) through (d)` family
// was added after an unprimed review EVADED this guard with it: every shipped terminal words itself
// "None of (a) through (d)", which the otherwise/else family never matched, so a terminal rewritten to
// claim the request for ITSELF in the house wording passed while the gate stayed GREEN. Measured
// across all EIGHT router surfaces before and after: the ONLY branches matching either family are the
// three real `1e` terminals, and they are not flagged, because `isBareCatchAll` is
// `CATCHALL_CONDITION_RE.test(cond) && !isResidual` and all three satisfy `isResidual`. So the
// widening has zero delta on the tracked tree, and it closes THAT ONE wording.
//
// NAMED CEILING -- this does NOT close the catch-all axis, and an earlier version of this comment
// wrongly claimed it "closes the evasion". The regex is a LITERAL FAMILY BLOCKLIST, exactly like
// TEST_STATE_TOKENS, so any unlisted phrasing walks through: a later review defeated it with "In all
// remaining cases the refactor step takes the request". Read a GREEN bare-catch-all result as "no
// LISTED catch-all wording is present", never as "no catch-all exists". A SECOND, independent hole
// lives in `isBareCatchAll`'s `&& !isResidual` conjunct -- a terminal can keep BOTH residual marker
// halves and still claim the request for itself in the house self-reference form, which
// `destinationsIn` deliberately does not resolve. Both are recorded as open in the quick-task
// deferred items rather than papered over here.
//
// The `none of` alternatives are ANCHORED rather than a loose `\bnone\s+of\b`. The loose form also
// measured clean today, but it would flag an ordinary future sentence such as "none of these smells
// applies, so route to lz-refactor" as a catch-all condition.
export const CATCHALL_CONDITION_RE =
  /\botherwise\b|\belse\b|\bin\s+(?:every|all|any)\s+other\s+cases?\b|\bfailing\s+(?:all|any)\s+of\s+(?:those|these|the\s+above)\b|\bnone\s+of\s+the\s+above\b|\bnone\s+of\s+\(?[a-z]\)?\s+through\b/i;

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

// Index of the first AFFIRMED occurrence of `re` in `text`, or -1. Affirmed = present, negated in
// neither direction, and not a hedged-then-retracted hypothetical.
//
// Takes a PRE-BUILT global RegExp rather than a skill name, so the same negation and hedge logic
// serves both consumers: destinationsIn passes a bare-slug matcher, selfClaimsIn passes a literal
// phrase matcher. Reusing it is not tidiness -- the tree contains "it is lz-tpp's job, not this
// skill's", so a self-claim scan without this bidirectional negation awareness would score that
// DECLINE as a claim. Must be global; the loop advances lastIndex.
const firstAffirmedIndex = (text, re) => {
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
    const idx = firstAffirmedIndex(text, skillNameRe(name, "gi"));

    if (idx >= 0) {
      hits.push({ name, idx });
    }
  }

  return hits.sort((a, b) => a.idx - b.idx).map((h) => h.name);
};

// ---------------------------------------------------------------------------------------------
// The SELF-CLAIM vocabulary (D-01, the second hole at isBareCatchAll).
//
// `destinationsIn` deliberately does not resolve "this skill" to the owning slug, and it must not
// start (see its DELIBERATE NON-FEATURE note). The cost of that choice is that a terminal can carry
// BOTH halves of the residual marker -- so `isResidual` is true and `isBareCatchAll` is suppressed --
// while the same sentence hands the request to itself in the house self-reference form. A review
// demonstrated it: "no skill in this loop owns it. In practice almost every request that mentions
// code at all lands here, and when it does, answer it here as part of this skill's own work and
// continue here." Zero literal slugs, both marker halves, and a total self-claim.
//
// So the claim is recognised WITHOUT teaching the parser to resolve self-reference: match the claim
// PHRASES directly, and only ever ask this of a branch already marked residual.
//
// Seeded from the forms this codebase's own comments name as the house self-reference vocabulary --
// "this skill", "this skill's work", "continue here" at destinationsIn, "is this skill's work" at
// isBareCatchAll -- plus the two here-anchored forms the demonstrated evasion used. The possessive
// "this skill's" is preferred over a bare "this skill" because the bare form appears live in an
// EXCLUSION ("it is lz-tpp's job, not this skill's", laws-classify #s13) where the claim is being
// denied; the possessive plus negation-awareness scores that correctly as no claim.
//
// NAMED CEILING, stated plainly because two sibling guards here learned it the hard way: this is a
// LITERAL FAMILY BLOCKLIST, exactly like TEST_STATE_TOKENS and CATCHALL_CONDITION_RE. An unlisted
// paraphrase walks through. Read a clean result as "no LISTED self-claim wording is present", never
// as "this terminal claims nothing". The evasion suite records that residual as a permanent ceiling
// rather than letting this comment imply a closure it does not have.
export const SELF_CLAIM_PHRASES = Object.freeze([
  "this skill's",
  "continue here",
  "answer it here",
  "here as part of",
  "handle it here",
]);

// Literal phrase matcher, whitespace-tolerant so it works on raw text as well as flattened branch
// text, and left-boundaried so "handle it here" cannot match inside a longer word.
const phraseRe = (phrase) => {
  const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");

  return new RegExp(`(?<![a-z0-9-])${esc}`, "gi");
};

// The self-claim phrases AFFIRMED in `branchText`, in list order. Returns the matched phrases rather
// than a boolean, so a report can NAME what it caught -- the keysOnTestState convention.
//
// Affirmation runs through firstAffirmedIndex, so a phrase inside a negated or hedged-and-retracted
// clause does not count. That is load-bearing rather than defensive: the live wording that would
// otherwise false-positive is already in the tree.
export const selfClaimsIn = (branchText, phrases = SELF_CLAIM_PHRASES) => {
  const text = String(branchText == null ? "" : branchText);

  return (Array.isArray(phrases) ? phrases : [])
    .filter((p) => typeof p === "string" && p.trim() !== "")
    .filter((p) => firstAffirmedIndex(text, phraseRe(p)) >= 0);
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
//
// IT MUST CONSUME THE WHOLE BLOCK SCALAR, and an earlier version did not. It stopped at the first
// line failing `/^\s+\S/`, i.e. at the first BLANK line -- but a blank line inside a YAML folded
// scalar is VALID and its content is part of the value. An unprimed review weaponised that twice:
//
//   * insert one blank line right after `description: >-` and the fold returns "" -- the gate then
//     printed `0 chars, 1536 of headroom` and `banned=[]` for a description that was fully intact
//     and carried a literal banned token. A vacuous pass on both description checks at once.
//   * insert a blank line mid-block and the fold returns a PREFIX -- measured 1128 chars against a
//     true value of 1870, i.e. 334 chars OVER the cap, reported as "408 of headroom".
//
// So the block now ends only where YAML says it ends: a line that is neither blank nor indented
// (the next mapping key, or the closing `---`). Blank lines are KEPT as part of the value, which is
// what YAML does, and they fold to a space here because every line is trimmed and space-joined.
//
// The empty result is returned as "" rather than null on purpose -- null means "no description key
// at all", and conflating the two is what let the vacuous case slip past the caller's null guard.
// Callers must additionally refuse an implausibly short fold; the gate does that with an explicit
// floor rather than trusting this function to distinguish absent from empty.
export const foldedDescription = (text) => {
  const lines = String(text == null ? "" : text).split("\n");
  const start = lines.findIndex((l) => /^description:\s*>-?\s*$/.test(l));

  if (start === -1) {
    return null;
  }

  const body = [];

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];

    // A blank line is INSIDE the scalar, so CONTINUE rather than break -- that is the whole repair.
    // It contributes no text of its own: YAML folds it to a paragraph break, and this function's
    // convention is single-space flattening. Emitting an empty entry here instead would join to a
    // DOUBLE space and inflate every measured length by one char per blank line -- caught by the
    // selftest's mid-block leg, which is why that leg exists.
    if (line.trim() === "") {
      continue;
    }

    // Any non-blank, non-indented line ends the block: the next key, or the `---` terminator.
    if (!/^\s/.test(line)) {
      break;
    }

    body.push(line.trim());
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

// ---------------------------------------------------------------------------------------------
// Corpus-binding predicates, and the ONE pair-level quantifier built from them.
//
// These lived in check-rgr-routing.mjs and were RESTATED by hand in the selftest. That restatement is
// how the selftest came to prove a discrimination the gate did not have: its `coveredBy` ran over ONE
// surface while the gate pooled three. The three leaf predicates had NOT drifted -- they were
// byte-identical -- so exporting only the leaves would have left the thing that actually drifted, the
// QUANTIFICATION, hand-written in both places. `routesCase` is therefore exported as well, and it is
// the single definition both the gate and the selftest call.
// ---------------------------------------------------------------------------------------------

// A branch COVERS a case when its flattened condition contains every one of the case's ask-words.
// Structural containment, deliberately.
export const covers = (branch, kase) => {
  const cond = branch.conditionText.toLowerCase();

  return kase.matchTokens
    .filter((t) => typeof t === "string" && t.trim() !== "")
    .every((t) => cond.includes(t.toLowerCase()));
};

// A branch OWNS a case when it covers it and its destination list is EXACTLY what the case declares.
// When the case declares a second hop that list must be exactly that ordered pair -- D-02's two-hop
// rule is an ORDER claim, so an unordered or single-name match must not satisfy it.
//
// THE SINGLE-HOP ARM CHECKS THE WHOLE LIST TOO, and an earlier version did not: it read only
// `destinations[0]`, so everything after the correct first name was unexamined. An unprimed review
// weaponised that by appending a CONTRADICTING second destination to lz-tpp step 1's own green-step
// branch -- "the green step is lz-tpp, so do not answer it here; hand the whole request over to
// lz-refactor" -- which routes c6 to the wrong skill while `destinations[0]` still reads `lz-tpp`.
// The gate stayed GREEN on a branch that had been turned into a handoff to a sibling.
//
// Length equality is the assertion, not a scan for contradicting names, because a single-hop case
// declares a COMPLETE destination list of one: any second name is either a contradiction or an
// undeclared hop, and both are the corpus's business to declare rather than the parser's to
// interpret. Both directions were MEASURED over all three step-1 surfaces x all eight owned cases
// before the change: zero verdict deltas on the tracked tree (every covering branch already affirms
// exactly one destination, and c4's two-hop branch affirms exactly two), so this tightens what the
// gate can catch without moving a single shipped verdict.
//
// This is also why c8's second ask is a NAMED SECOND STEP inside one skill's answer rather than a
// second routing hop (see its rationale in rgr-cases.json): a branch that literally affirmed a
// sibling slug there would now have to declare that hop in the corpus.
export const owns = (branch, kase) => {
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

  return branch.destinations.length === 1 && branch.destinations[0] === kase.expectedOwner;
};

// The declared residual terminal claims NOTHING: it must carry the explicit no-owner marker, affirm
// zero destinations, AND affirm no self-claim. Recognition is never by the ABSENCE of a skill name,
// so a branch that merely forgot to name an owner cannot pass itself off as the residual (D-01).
//
// The self-claim conjunct is what closes the second hole recorded at isBareCatchAll: zero LITERAL
// destinations was the whole test, and a terminal keeping both marker halves while handing the
// request to itself in the house self-reference form satisfied it. Both directions were MEASURED
// over all eleven surfaces first: no shipped residual affirms any listed phrase, and the one live
// "this skill" is a negated exclusion on a NON-residual branch, so this moves no shipped verdict.
//
// Computed from `conditionText` rather than read off a precomputed branch field, so the predicate
// stays self-contained and drivable over any branch-shaped object -- the selftest's fixtures need no
// new plumbing to exercise it. `isResidual` gates the call, so a non-residual branch's phrasing is
// never judged here.
export const isDeclaredResidual = (branch) =>
  branch.isResidual &&
  branch.destinations.length === 0 &&
  selfClaimsIn(branch.conditionText).length === 0;

// Does ONE surface's own branch list route ONE case correctly? Returns { ok, why, via }.
//
// Quantified over a SINGLE surface's branches on purpose. The pooled version of this decision is what
// an unprimed review evaded: with three near-identical procedures, deleting lz-red's own branch (a)
// left the gate GREEN because its two siblings still carried an identical 1a. A skill that cannot
// route a case is broken whatever its siblings say.
//
// For a NONE case BOTH halves are required -- a declared residual must exist AND no non-residual
// branch may positively cover the case. Asserting only the first half is what let a branch capturing
// the residual case read as a pass.
export const routesCase = (branches, kase) => {
  const list = Array.isArray(branches) ? branches : [];

  if (kase.expectedOwner === "NONE") {
    const residuals = list.filter(isDeclaredResidual);
    const captors = list.filter((b) => !isDeclaredResidual(b) && covers(b, kase));

    if (residuals.length === 0) {
      // Distinguish "there is no terminal" from "the terminal SELF-CLAIMS", because they are
      // different defects and the second one is invisible in the file: the branch still reads as a
      // well-formed residual. Reporting the generic message for it would send a reader looking for a
      // missing section that is right there.
      const selfClaiming = list
        .filter((b) => b.isResidual && selfClaimsIn(b.conditionText).length > 0)
        .map((b) => `#${b.branchId} (${selfClaimsIn(b.conditionText).join(", ")})`);

      return {
        ok: false,
        why: selfClaiming.length
          ? `residual-marked branch(es) ${selfClaiming.join("; ")} SELF-CLAIM the request, so this surface declares no no-owner terminal`
          : "no declared residual terminal on this surface",
        via: [],
      };
    }

    if (captors.length > 0) {
      return {
        ok: false,
        why: `CAPTURED by non-residual branch(es) ${captors.map((b) => b.branchId).join(", ")} -- a no-owner case must reach the residual`,
        via: residuals.map((b) => b.branchId),
      };
    }

    return { ok: true, why: "declared residual claims no owner, and nothing captures it", via: residuals.map((b) => b.branchId) };
  }

  const hits = list.filter((b) => owns(b, kase));
  const want = kase.expectedSecondHop ? `${kase.expectedOwner} then ${kase.expectedSecondHop} (ordered)` : kase.expectedOwner;

  if (hits.length === 0) {
    return { ok: false, why: `no branch on this surface routes it to ${want}`, via: [] };
  }

  return { ok: true, why: want, via: hits.map((b) => b.branchId) };
};

// ---------------------------------------------------------------------------------------------
// The LEAD-IN prose of numbered item 1 -- everything before the first `a.` sub-item -- flattened.
// Returns null when item 1 is absent, and "" when item 1 has no lettered sub-items (the degenerate
// shape letteredChunks already returns whole, so there is no separate lead-in to judge).
//
// WHY THIS EXISTS, and why it is NOT folded into letteredChunks. `letteredChunks` starts its loop at
// i = 1 and therefore DISCARDS parts[0], which is exactly this lead-in. An unprimed review found the
// literal banned token `all prior tests green` living there in lz-tpp step 1, one sentence after the
// same step forbids that axis -- invisible to all eleven parsed surfaces. The TEST_STATE_TOKENS seed
// comment had even named that site as a source, so the token was listed for a location the parser
// could never reach.
//
// This is the SAME SHAPE as the intro-prose hole Phase 22 closed (prose above the first `## `
// heading, outside every surface). Closing that one did not close this one: there the blind region is
// above the first heading, here it is before the first lettered branch. A later review then found it
// AGAIN one level out -- prose BETWEEN the `## ` heading and item `1.`, which numberedItem also
// discards -- which is why the gate additionally runs a coarse whole-section scan. Three instances of
// one shape, each found by a human reading the file rather than by the gate.
//
// Deliberately a separate surface rather than an extra BRANCH: the exhaustiveness, at-most-one and
// bare-catch-all assertions all judge routing branches, and a lead-in is not a branch -- feeding it
// in would make a non-branch answerable for owning corpus cases. introBody set the precedent of a
// dedicated surface with a dedicated single-axis check; this follows it.
//
// Takes the FULL file text plus the surface heading, mirroring introBody's shape, so the caller needs
// no access to sectionBody. `null` is UNREACHABLE (heading absent or item 1 absent) and is a FAILURE
// for the caller to report, never a skip -- same contract as parseRoutingBranches.
// ---------------------------------------------------------------------------------------------
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
      // required, because a self-claim written in the house SELF-REFERENCE form ("...is this skill's
      // work") is invisible to a literal-slug parser, which destinationsIn must not learn to resolve.
      // Requiring the owner slug would make this check un-failable against exactly the branches it
      // exists to catch: the guard-that-cannot-fail class.
      //
      // HISTORY CORRECTED. An earlier version of this comment justified that by asserting "today's
      // FOUR shipped catch-alls say 'otherwise ... is this skill's work'". That is false and was
      // measured false: `is this skill's work` appears nowhere under plugins/, `otherwise` appears
      // once in the three SKILL.md files and not as a terminal, and every shipped terminal words
      // itself "None of (a) through (d)" -- which is what CATCHALL_CONDITION_RE was later widened to
      // cover. The old wording also directly contradicted the widening note at that regex, 460 lines
      // above. The PREDICATE is still right for the reason in the paragraph above; only its stated
      // evidence was stale.
      //
      // KNOWN HOLE, recorded rather than hidden: because `isDeclaredResidual` demands only zero
      // literal-slug destinations, a terminal can carry BOTH halves of the residual marker AND claim
      // the request for itself in that same self-reference form, and `!isResidual` then suppresses
      // this flag. A review demonstrated it. Open in the quick-task deferred items.
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
