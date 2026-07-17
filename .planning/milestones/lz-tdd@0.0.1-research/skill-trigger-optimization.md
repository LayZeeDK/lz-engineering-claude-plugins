# Skill trigger-optimization: eval design, hard negatives, and technical-term-misuse

Reusable project research (web-sourced) for optimizing Claude Code skill `description`s so they auto-trigger
on the right prompts and NOT the wrong ones. Surfaced 2026-07-10 for the `lz-refactor` trigger-optimization
quick task; applies to any skill trigger tuning in this repo. Confidence: HIGH = primary page fetched;
MEDIUM = via search summarizer.

## Eval-set design (recall + specificity)

- **~20 queries, ~50/50** should-trigger / should-not-trigger (balanced when specificity matters -- our case).
  HIGH -- agentskills.io "Optimizing skill descriptions".
- **Vary positives** along 4 axes: phrasing (formal/casual/typos), explicitness (name the domain vs only
  describe the need), detail (terse vs file-paths+backstory), complexity (single-step vs buried in a chain).
  "The most useful should-trigger queries are ones where the skill would help but the connection isn't obvious
  from the query alone" -- i.e. vague prompts are the high-value positives.
- **Nondeterminism:** run each query 3x, compute a trigger rate; positive passes if rate > 0.5, negative if
  < 0.5. (philschmid: 3-5 trials.)
- **Overfitting control:** 60% train / 40% validation split (proportional pos/neg), fixed across iterations;
  edit the description only from TRAIN failures; pick the final description by VALIDATION score (best may not
  be the last iteration); sanity-check with 5-10 fresh held-out queries. **Do NOT paste keywords from a failed
  query into the description -- find the general CATEGORY it represents and address that.**

## Negatives / hard negatives

- The **negatives carry the specificity signal**, and they must be **near-misses**, not noise. The most
  valuable negatives share vocabulary/concepts with positives but need a DIFFERENT tool/skill. Easy noise
  ("what's the weather", "write a fibonacci function") tests nothing.
- Hard negatives are what actually break routing (MEDIUM: tool-routing benchmarks show accuracy collapsing
  against semantically-similar distractors, ~94% -> ~70%).
- **Validate each negative genuinely should not trigger** -- LLM-generated hard negatives can drift so close
  they become mislabeled positives. (This is why rubrics/classifications need review.)

## Technical-term MISUSE (user says "refactor" but means the green step)

Accepted convention = **(a) exclude-and-reroute in the DESCRIPTION**, not (b) runtime trigger-then-reroute:
- A Skill has no clean runtime handoff primitive; once triggered it just injects context. Anthropic tool-use
  guidance favors a sharp description boundary, not runtime redirection ("clear, distinct purpose"; "overlapping
  tools distract"). HIGH -- anthropic.com/engineering/writing-tools-for-agents.
- Real-world convention (HIGH -- citypaul `.dotfiles` `refactoring` SKILL.md): the refactoring skill's
  description ends with an explicit exclusion naming the sibling: "Do NOT use... **for adding behavior (see
  tdd)**." Making a failing test pass = adding behavior -> routed to the TDD/green skill at ROUTING time,
  before invocation.
- **Anchor each overlapping skill by stage + intent** so boundaries are mutually exclusive (e.g. lz-refactor =
  behavior-preserving STRUCTURE change; lz-tpp = the GREEN step / minimal change to pass a failing test), and
  state that anchor in the description.

**Representing a term-misuse case in the eval -- do it twice:**
1. **Binary hard should-not-trigger negative** for the skill in isolation (shares the keyword, needs the
   sibling). Necessary but insufficient; grade as a SUPPORTING signal.
2. **Sibling-routing / outcome test** with BOTH sibling descriptions present -- pass condition = the correct
   sibling handled it. **Grade outcomes, not paths**: a strict binary should-not-trigger would wrongly FAIL a
   correct reroute. A binary eval on one skill alone cannot capture "the sibling should win."

## Anthropic-specific levers

- The `description` is BY FAR the top selection lever; write it third-person, "what + when", specific key terms.
  HIGH -- platform.claude.com Agent Skills best practices; anthropic.com engineering posts.
- Models UNDER-trigger -> descriptions should be a bit "pushy" ("use... even if they don't explicitly ask
  for..."); the near-miss negatives are what pull that back from over-triggering.
- **Match USER INTENT, not internal/API terminology** -- the single highest-leverage fix (MEDIUM: Vercel
  reported skills uninvoked in 56% of cases; rewriting descriptions to user intent was the biggest win).
- Namespacing related skills/tools under common prefixes measurably affects selection.

## Sources

- agentskills.io/skill-creation/optimizing-descriptions (HIGH) -- the fullest eval recipe (this is what
  `skill-creator` automates).
- platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (HIGH).
- anthropic.com/engineering/writing-tools-for-agents (HIGH); .../equipping-agents-for-the-real-world-with-agent-skills (HIGH).
- philschmid.de/testing-skills (HIGH) -- 10-20 prompts, 3-5 trials, grade outcomes not paths.
- github.com/citypaul/.dotfiles .../skills/refactoring/SKILL.md (HIGH) -- the exclude-and-reroute convention.
- vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals (MEDIUM); tool-routing benchmarks (MEDIUM).

Note: the strongest quantitative figures (Vercel 56%, the 94->70% hard-negative drop) came via search
summarizer -- treat as indicative. The methodology + the term-misuse convention were fetched directly (HIGH).
