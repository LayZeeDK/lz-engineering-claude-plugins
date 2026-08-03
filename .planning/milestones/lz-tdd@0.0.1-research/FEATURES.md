# Feature Research

**Domain:** Claude Code agent skill (coach + reference) operationalizing Robert C. Martin's Transformation Priority Premise (TPP) for red-green-refactor TDD, shipped inside the `lz-tdd` plugin as `lz-tpp` (`/lz-tdd:lz-tpp`).
**Researched:** 2026-07-02
**Confidence:** HIGH

> This file has two jobs. Part 1 is the SKILL feature landscape (what a high-quality
> agent skill contains and what this coach+reference skill must offer). Part 2 is the
> verbatim-faithful TPP SUBJECT MATTER (the transformation list, concepts, worked
> examples, and coach decision procedure) that the skill's reference material and the
> coach behavior depend on. Downstream consumers (requirements + roadmap + skill
> content) should treat Part 2 as the canonical source-of-truth extract.

---

# PART 1 -- Skill Feature Landscape

## Feature Landscape

### Table Stakes (Users Expect These)

Features the skill is effectively useless without. Missing these = the skill fails to trigger, fails to help, or teaches TPP wrong.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| YAML frontmatter with `name` + `description` | Required by the skill format; the `description` is the sole triggering mechanism | LOW | `name` max 64 chars, lowercase/numbers/hyphens; `description` max 1024 chars. See Anthropic skill-authoring rules. |
| Triggering description with both "what" AND "when" + concrete trigger terms | Claude only consults a skill when the description matches intent; TDD/TPP/transformation vocabulary must appear | MEDIUM | Third-person phrasing ("This skill should be used when..."). Slightly "pushy" to combat Claude's tendency to under-trigger. Must NOT over-trigger on generic "write code" requests. |
| Correct, complete transformation priority list (bundled reference) | This is the entire subject matter; if the list is wrong or incomplete the skill is worse than nothing | MEDIUM | Use the revised 14-item FibTPP list as canonical (Part 2). Cite the source. This is the "if everything else fails, this must be correct" core value from PROJECT.md. |
| Coach decision procedure: failing test + current code -> next transformation by priority | The primary Core Value: pick the simplest transformation that passes the red test | HIGH | Needs a concrete, repeatable algorithm (see Part 2, "Coach Decision Procedure"), not vibes. |
| Reference behavior: explain the list + rationale on demand | Users ask "what is TPP / why this order / what does (constant->scalar) mean" | LOW | Straight exposition from the bundled reference; progressive-disclosure friendly. |
| Progressive disclosure (SKILL.md lean; details in `references/`) | Format best practice; keeps triggering metadata cheap and body focused | MEDIUM | SKILL.md body under ~500 lines / ~1500-2000 words; full list + worked examples live in a reference file loaded on demand. |
| Grounding in authoritative sources | Credibility; the premise has subtle, evolving ordering that memory gets wrong | LOW | 2 Clean Code blog posts (+ NDC 2011 talk transcript, produced later). Cite them in the reference file. |
| Concrete worked example(s) | Skills work far better with concrete examples than abstract rules | MEDIUM | Fibonacci (from FibTPP) is the canonical worked example; Word Wrap illustrates the impasse. See Part 2. |
| Explicit red-green-refactor framing | TPP only makes sense as a discipline layered on TDD's cycle | LOW | State the amended process (prefer high-priority transformations in green; pose tests passable by high-priority transformations in red; backtrack on impasse). |
| Clear distinction: transformations vs refactorings | The whole premise rests on this dichotomy; conflating them corrupts the advice | LOW | Transformations change behavior (make a failing test pass); refactorings change structure only. |

### Differentiators (Competitive Advantage)

Features that set `lz-tpp` apart from "read Uncle Bob's blog" or a generic TDD prompt. Aligned with PROJECT.md Core Value.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Language-agnostic principles + concrete TypeScript examples | Broad applicability grounded in the user's primary stack; the blogs use Java/Ruby only | MEDIUM | Translate each transformation to idiomatic TS; note the TS/functional-vs-imperative ordering nuance (recursion vs iteration). |
| Coach that reads CURRENT code + the failing test, not just recites theory | Turns a static essay into an in-loop pairing partner during TDD | HIGH | The genuinely novel capability. Requires the decision procedure to inspect what transformation each candidate implementation would require. |
| Impasse / local-maximum escape guidance | The premise's actual payoff: avoid rewrites by choosing the next TEST (not just the next code) wisely | MEDIUM | Coach should suggest posing a different, simpler test (or `@Ignore`/skip + backtrack) when the only path forward is a low-priority transformation. |
| Language-specific ordering awareness (recursion vs iteration) | Uncle Bob himself says the list is language-specific; naive tools ignore this | MEDIUM | For TS/JS (no TCO in practice), prefer `(if->while)` + `(variable->assignment)` above the recursion transformations, mirroring his Java guidance. Flag as an opinionated default, not dogma. |
| "Name the transformation" annotations | Teaches while it coaches; each recommendation cites which transformation and why it is highest-priority available | LOW | Cheap, high pedagogical value; reinforces the vocabulary. |
| Skill-creator eval coverage (triggering + behavior) | Measurable triggering accuracy and coaching quality; matches the build tooling constraint | MEDIUM | Trigger evals (should/should-not-trigger) + behavior evals (given test+code, does it pick the right transformation). Part of authoring workflow, not shipped runtime. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Documented to prevent scope creep and to keep the skill trustworthy.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Over-broad / "pushy everywhere" description | Fear of under-triggering | Triggers on every "write a function" request, becoming noise and eroding trust | Scope triggers to TDD / red-green-refactor / "next transformation" / TPP / "make the failing test pass" contexts; include near-miss should-NOT-trigger evals. |
| Presenting TPP as rigid, mandatory law ("ALWAYS use transformation N") | Feels authoritative and simple | Contradicts the source: Uncle Bob calls the ordering "informal at best", "roughly ordered", "not likely" perfectly correct, and language-specific. Rigid dogma produces bad code and false confidence | Present as a heuristic/thinking aid; explain the WHY; allow deviation with a stated reason. Explain-the-why over MUST/NEVER. |
| Bloated SKILL.md (full list + all examples + theory inline) | "Put everything in one place" | Wastes context on every trigger; violates progressive disclosure; harder to maintain | Lean SKILL.md (workflow + decision procedure summary + pointers); full list, rationale, and worked examples in `references/`. |
| Auto-editing the user's code / running the tests itself | "Just make it green for me" | Removes the human from the TDD loop, the point of the discipline; risky and surprising | Recommend the next transformation and show the minimal diff; let the developer apply and run. Coach, don't drive. |
| Auto-generating a full TPP tool (refactoring-engine style transformation application) | Uncle Bob floated "tool support for transformations" | Massive scope; language-specific ASTs; out of scope for a v1 skill and unvalidated | Ship guidance now; a mechanical transformer is a v2+ research topic at best. |
| Deep per-language guides (Java, C#, Python, Go, Clojure...) | Broad appeal | Multiplies maintenance; unvalidated demand; dilutes focus | Agnostic principles + TS examples for v1 (explicit PROJECT.md boundary); add languages only on demonstrated demand. |
| Bundling multiple TDD skills (naming, triangulation) into lz-tpp | "One skill to rule TDD" | Muddies triggering and the single-responsibility of the skill | Keep lz-tpp focused on TPP; future TDD skills are separate skills under `lz-tdd`. |
| Reconstructing the list "from memory" / trusting the 12-item version as final | Simplicity | The original post's list was superseded by FibTPP (added tail-recursion + case, reordered recursion) | Use the revised 14-item list as canonical; cite; note the evolution (Part 2). |

## Feature Dependencies

```
[Correct transformation priority list (Part 2)]
    +--requires--> [Grounding in authoritative sources]
    +--enables---> [Reference behavior: explain list on demand]
    +--enables---> [Coach decision procedure]
                        +--requires--> [transformations-vs-refactorings distinction]
                        +--requires--> [red-green-refactor framing]
                        +--enhanced-by--> [Impasse / local-maximum escape guidance]
                        +--enhanced-by--> [Language-specific ordering awareness]

[Triggering description] --gates--> [everything] (skill never runs if it doesn't trigger)

[Progressive disclosure] --organizes--> [SKILL.md body] + [references/*.md]
    (list + worked examples live in references/, not SKILL.md body)

[Concrete TypeScript examples] --enhances--> [Coach decision procedure]
                                             + [Reference behavior]

[Skill-creator evals] --validates--> [Triggering description] + [Coach decision procedure]

[Over-broad description] --conflicts--> [Triggering description] (mutually exclusive goals)
[Auto-editing code]     --conflicts--> [Coach, don't drive] behavior
```

### Dependency Notes

- **Coach requires the transformations-vs-refactorings distinction:** the coach must classify a proposed code change as behavior-changing (a transformation, subject to the priority list) versus structure-only (a refactoring, done in the refactor step, not priority-ranked). Getting this wrong makes every recommendation suspect.
- **Coach requires red-green-refactor framing:** priority applies during green (which transformation makes the current red test pass) and during red (choose a test passable by a high-priority transformation). Without the cycle, "priority" has no phase to live in.
- **Impasse guidance enhances the coach:** the highest-value move is often changing the NEXT TEST, not the code. This depends on the coach already understanding the priority ordering.
- **Language-specific ordering awareness enhances (does not replace) the canonical list:** the default is Uncle Bob's list; the TS nuance (iteration preferred over recursion) is an opinionated overlay he explicitly sanctions.
- **Triggering description gates everything:** a skill that does not trigger is inert regardless of body quality; this is why triggering has its own eval loop in skill-creator.

## MVP Definition

### Launch With (v1)

Minimum viable product -- validates "does an in-loop TPP coach + reference help TDD in Claude Code."

- [ ] Valid `SKILL.md` with tuned `name` + `description` (triggers on TDD/TPP/transformation contexts, not generic coding) -- triggering is the gate.
- [ ] Bundled reference file with the full revised 14-item transformation priority list, verbatim-faithful + cited -- the non-negotiable core.
- [ ] Coach decision procedure documented concretely (failing test + code -> named next transformation) -- the Core Value.
- [ ] Reference behavior: explain the list, notation, and rationale on demand.
- [ ] transformations-vs-refactorings distinction + amended red-green-refactor process stated.
- [ ] Language-agnostic principles with at least one concrete TypeScript worked example (Fibonacci recommended).
- [ ] Progressive disclosure: lean SKILL.md body, details in `references/`.
- [ ] Impasse/backtrack guidance (at least the "pose a simpler test" heuristic).

### Add After Validation (v1.x)

Add once the core coach is shown to help.

- [ ] Second/third worked TS examples (Word Wrap impasse; Prime Factors) -- trigger: users want more than Fibonacci.
- [ ] Explicit language-ordering overlay section (TS/JS iteration-over-recursion default) -- trigger: recursion recommendations feel wrong for JS.
- [ ] Skill-creator trigger-accuracy optimization pass (run_loop) -- trigger: mis-triggering observed in real use.
- [ ] Quick-reference cheat-sheet (one-line-per-transformation table) as a separate small reference -- trigger: users want fast lookup.

### Future Consideration (v2+)

Defer until product-market fit / demonstrated demand.

- [ ] Additional languages beyond TS (Python, Go, C#, Clojure ordering variants) -- defer: unvalidated demand, maintenance multiplier, explicit out-of-scope.
- [ ] Mechanical transformation suggester / AST-aware tool -- defer: huge scope, language-specific, unvalidated (Uncle Bob's own "holy grail" caveat).
- [ ] Additional TDD skills under `lz-tdd` (test naming, triangulation, test ordering) -- defer: separate skills, not this one.
- [ ] Integration with test-runner output to auto-detect the current red test -- defer: couples the skill to specific runners; anti-feature risk (driving vs coaching).

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Tuned triggering description | HIGH | MEDIUM | P1 |
| Correct 14-item transformation list (cited) | HIGH | MEDIUM | P1 |
| Coach decision procedure | HIGH | HIGH | P1 |
| Reference/explain-on-demand behavior | HIGH | LOW | P1 |
| transformations-vs-refactorings + RGR framing | HIGH | LOW | P1 |
| Progressive disclosure structure | MEDIUM | MEDIUM | P1 |
| Concrete TypeScript worked example (Fibonacci) | HIGH | MEDIUM | P1 |
| Impasse / backtrack guidance | MEDIUM | MEDIUM | P1 |
| Language-specific ordering overlay (TS) | MEDIUM | MEDIUM | P2 |
| Additional worked examples (Word Wrap, Prime Factors) | MEDIUM | MEDIUM | P2 |
| Skill-creator trigger + behavior evals | MEDIUM | MEDIUM | P2 |
| Quick-reference cheat-sheet | LOW | LOW | P2 |
| Additional languages | LOW | HIGH | P3 |
| Mechanical transformation tool | LOW | HIGH | P3 |

**Priority key:** P1 = must have for launch; P2 = should have, add when possible; P3 = future.

## Competitor Feature Analysis

There is no known dedicated Claude Code skill/plugin for TPP as of 2026-07-02 (searched; only the primary blogs, Wikipedia, and practitioner write-ups exist). "Competitors" are therefore the alternatives a developer would otherwise reach for.

| Feature | Uncle Bob's blog posts | Wikipedia / secondary write-ups | Generic "do TDD" prompt | Our approach (lz-tpp) |
|---------|------------------------|--------------------------------|-------------------------|-----------------------|
| The transformation list | Authoritative but split across 2 posts; original list superseded mid-post | Consolidated but often shows the 12-item version and misses tail-recursion/case nuance | Absent | Single cited, canonical revised 14-item list + evolution note |
| In-loop coaching (test+code -> next move) | None (prose only) | None | Ad hoc, no priority discipline | Concrete decision procedure invoked during red-green-refactor |
| Language grounding | Java/Ruby examples | Java examples | Whatever the user's stack is | Agnostic principles + concrete TypeScript |
| Impasse handling | Explained via Word Wrap essay | Summarized | Not addressed | Actionable "pose a simpler test / backtrack" heuristic |
| Availability inside the editor loop | Manual reading | Manual reading | Always present but unprincipled | Progressive-disclosure skill that triggers automatically on TDD contexts |
| Dogma risk | Low (Bob hedges heavily) | Medium (lists read as canon) | N/A | Explicitly heuristic, why-driven, deviation allowed |

---

# PART 2 -- TPP Subject-Matter Reference (canonical extract)

> This part is the verbatim-faithful subject matter for the skill's bundled reference
> material and coach logic. Where the two authoritative blog posts differ, the
> difference is flagged. Trust the blogs over any secondary source.

## Core Concepts (from the authoritative posts)

- **Transformations vs refactorings.** "Refactorings are simple operations that change the structure of code without changing its behavior. Transformations are simple operations that change the behavior of code. Transformations can be used as the sole means for passing the currently failing test in the red/green/refactor cycle." (TPP post)
- **The mantra:** "As the tests get more specific, the code gets more generic." Every behavior change moves the code from a more specific form to a more generic form (e.g., a constant is a specific case; a variable is its generalization).
- **Every code change is either a transformation (specific -> generic, behavior-changing) or a refactoring (structure-only).** This is the classification the coach applies.
- **Priority = complexity/risk ordering.** "The transformations at the top of the list are simpler, and less risky, than the transformations that are lower in the list." Prefer higher-priority (simpler) transformations because "the more complexity required by the test, the larger the risk you take to get that test to pass."
- **Direction.** Every transformation has a direction: it generalizes behavior (constant -> variable, variable -> array, if -> while, sequence -> recursion, etc.).
- **The impasse / local-maximum problem.** A poor sequence of tests/implementations can force "an impasse, where there is no way to get the next test to pass without rewriting the whole algorithm." The red/green/refactor cycle breaks down when you must change a large amount of code to get back to green.
- **The premise.** "If you choose the tests and implementations that employ transformations that are higher on the list, you will avoid the impasse."
- **Honest hedging (critical for the anti-dogma stance).** Uncle Bob explicitly says the transformations are "informal at best", "roughly ordered" by complexity, that the ordering is "not likely" perfectly correct, that priority "might be more complicated than a simple ordinal sequence", and that the list is "language specific" (and possibly team-specific). The skill MUST present TPP as a heuristic, not a law.

## The Canonical Transformation Priority List

There are TWO lists in the authoritative sources. The FibTPP post explicitly REVISES the original list, so the revised 14-item list is canonical; the original is retained here to document the evolution and the ordering discrepancy.

### CANONICAL -- Revised 14-item list (from FibTPP, source of truth)

Source: Robert C. Martin, "Fib. The T-P Premise." (dated February 2 2011; published on blog 27 May 2013). https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html

Verbatim (arrows normalized to ASCII `->`; descriptions as given):

1. `({} -> nil)` -- no code at all -> code that employs nil
2. `(nil -> constant)`
3. `(constant -> constant+)` -- a simple constant to a more complex constant
4. `(constant -> scalar)` -- replacing a constant with a variable or an argument
5. `(statement -> statements)` -- adding more unconditional statements
6. `(unconditional -> if)` -- splitting the execution path
7. `(scalar -> array)`
8. `(array -> container)`
9. `(statement -> tail-recursion)`
10. `(if -> while)`
11. `(statement -> recursion)`
12. `(expression -> function)` -- replacing an expression with a function or algorithm
13. `(variable -> assignment)` -- replacing the value of a variable
14. `(case)` -- adding a case (or else) to an existing switch or if

Notes on the revisions FibTPP makes to the original:
- Added `(statement -> tail-recursion)` at position 9, ABOVE `(if -> while)`: "tail recursion is preferred over arbitrary recursion."
- Added `(case)` at the very bottom (position 14): a switch/case or `else if` "is always the last option to choose." (Added because the original list did not prevent a degenerate `switch` solution for Fibonacci.)
- Moved plain `(statement -> recursion)` to position 11, now BELOW `(if -> while)` (in the original it was above).

### ORIGINAL -- 12-item list (from the TPP post; superseded, kept for provenance)

Source: Robert C. Martin, "The Transformation Priority Premise" (dated December 19 2010; published on blog 27 May 2013). https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html

1. `({} -> nil)` -- no code at all -> code that employs nil
2. `(nil -> constant)`
3. `(constant -> constant+)` -- a simple constant to a more complex constant
4. `(constant -> scalar)` -- replacing a constant with a variable or an argument
5. `(statement -> statements)` -- adding more unconditional statements
6. `(unconditional -> if)` -- splitting the execution path
7. `(scalar -> array)`
8. `(array -> container)`
9. `(statement -> recursion)`
10. `(if -> while)`
11. `(expression -> function)` -- replacing an expression with a function or algorithm
12. `(variable -> assignment)` -- replacing the value of a variable

### FLAGGED ordering discrepancy (quality-gate requirement)

The two authoritative posts disagree on the recursion/iteration ordering, and this is a deliberate within-source evolution, not a transcription error:

- **Original TPP post:** `(statement -> recursion)` #9 is ABOVE `(if -> while)` #10. Uncle Bob defends this in the same post: "you might question why I put (statement->recursion) above (if->while) ... Comparing the two may convince you that recursion is, in fact, simpler than iteration."
- **Revised FibTPP list:** inserts `(statement -> tail-recursion)` above `(if -> while)`, keeps `(if -> while)`, and moves plain `(statement -> recursion)` BELOW `(if -> while)`.
- **Language-specificity caveat (FibTPP):** "the priority list is language specific. In Java, for example, we might move (if->while) and (variable->assignment) ABOVE (statement->tail-recursion) so that iteration is always preferred above recursion, and assignment is preferred above parameter passing." Rationale: Java (and, for our purposes, TypeScript/JavaScript) is not a functional language and lacks reliable tail-call optimization, so a functional bias yields suboptimal code.

**Recommendation for lz-tpp:** ship the revised 14-item list as the canonical reference, but for the TypeScript/JavaScript coaching default, apply Uncle Bob's own language-specific guidance -- prefer `(if -> while)` and `(variable -> assignment)` above the recursion transformations. Present this as an opinionated, source-sanctioned overlay, not a contradiction. Secondary sources (Wikipedia, etc.) commonly publish only the 12-item list; trust the blogs and note this.

### Notation notes

- `{}` = no code / empty; `nil` = null / a nothing-ish return (the posts use "nil" and "null" interchangeably).
- `constant+` = a more complex constant than a bare `nil`/`0`/`""`.
- `scalar` = a variable or argument (a generalization of a constant).
- `container` = a collection/map generalizing an array.
- `(case)` = adding a `case` to a `switch`, or an `else`/`else if` branch -- lowest priority.
- Arrows in the source render with a special dash glyph; normalize to ASCII `->` in all skill content (ASCII-only requirement).

## The Amended Red-Green-Refactor Process (verbatim intent, from TPP post)

If you accept the Priority Premise, amend ordinary TDD with:

- When passing a test, prefer higher-priority transformations.
- When posing a test, choose one that can be passed with higher-priority transformations.
- When an implementation seems to require a low-priority transformation, backtrack to see if there is a simpler test to pass.

## Worked Example -- Fibonacci (from FibTPP)

Test suite (Java in source; behavior is language-agnostic):

```
assertEquals(0, of(0));
assertEquals(1, of(1));
assertEquals(1, of(2));
assertEquals(2, of(3));
assertEquals(3, of(4));
assertEquals(5, of(5));
assertEquals(8, of(6));
```

Step-by-step (each step names the transformation applied):

1. First test -> `({} -> nil)` then `(nil -> constant)`:
   ```java
   public static int of(int n) {
     return 0;
   }
   ```
2. Second test forces `(unconditional -> if)`, refactored with `(constant -> scalar)`. This coincidentally makes the third test pass:
   ```java
   public static int of(int n) {
     if (n <= 1)
       return n;
     return 1;
   }
   ```
3. Fourth test (maps 1->1, 2->1, 3->2). The "obvious" move is `(statement -> recursion)` since fib(n) = fib(n-1) + fib(n-2):
   ```java
   public static int of(int n) {
     if (n <= 1)
       return n;
     return of(n - 1) + of(n - 2);
   }
   ```
   This passes all tests and is beautiful -- BUT it has ~O(n^2) runtime, is not tail-recursive, and the JVM cannot optimize tail calls. (The same performance/stack concerns apply to TypeScript/JavaScript.)
4. Prefer `(statement -> tail-recursion)` (now above `(if -> while)` in the revised list):
   ```java
   public class Fibonacci {
     public static int of(int n) {
       if (n <= 1)
         return n;
       return of(0, 1, n);
     }
     private static int of(int a, int b, int n) {
       if (n == 0)
         return a;
       return of(b, a + b, n - 1);
     }
   }
   ```
   Refactor away the redundant outer `if`:
   ```java
   public static int of(int n) {
     return of(0, 1, n);
   }
   private static int of(int a, int b, int n) {
     if (n == 0)
       return a;
     return of(b, a + b, n - 1);
   }
   ```
5. Since Java (and JS/TS) do not do tail-call elimination reliably, for large `n` unwind recursion into iteration via `(if -> while)` plus a few `(variable -> assignment)`:
   ```java
   private static int of(int a, int b, int n) {
     while (n != 0) {
       int s = a + b;
       a = b;
       b = s;
       n--;
     }
     return a;
   }
   ```

Key lesson from FibTPP: the priority list PREVENTS the degenerate `switch(n) { case 0: ... }` solution (that is why `(case)` sits at the very bottom), and the recursion-vs-iteration ordering is where language-specificity bites.

## Worked Example -- Word Wrap impasse (from TPP post, condensed)

Purpose: demonstrates the impasse and the backtracking rule. Following the priority premise loosely, you reach a point where the only way forward is `(expression -> function)` (a whole algorithm) -- the impasse. The escape is NOT to power through with code; it is to backtrack and pose a DIFFERENT, simpler test (e.g., "word longer than the line breaks at the limit") passable by `(unconditional -> if)`, sometimes `@Ignore`-ing the hard test temporarily. This concretely illustrates the coach's most valuable move: change the next test, not just the next line of code.

## Coach Decision Procedure (concrete sketch for the skill)

Given: (a) the current failing (red) test, and (b) the current production code. Recommend the NEXT transformation.

1. **Confirm you are in the green phase.** If the code compiles and all prior tests pass and exactly one new test is red, you are choosing a transformation. If the request is "clean this up" with tests green, that is a refactoring (structure-only) -- do NOT priority-rank it; it belongs to the refactor step.
2. **Enumerate candidate minimal changes** that would make the red test pass. For each candidate, classify it as a transformation and identify WHICH transformation from the canonical list it corresponds to (behavior change: specific -> generic).
3. **Pick the highest-priority (lowest-numbered) transformation** among the candidates. Recommend that change, and name the transformation (e.g., "Use `(constant -> scalar)`: replace the literal `1` with the parameter `n`").
4. **Apply the language overlay.** For TypeScript/JavaScript, prefer `(if -> while)` and `(variable -> assignment)` above the recursion transformations (Uncle Bob's sanctioned language-specific reordering), because JS/TS lacks reliable TCO. State this when it changes the recommendation.
5. **Impasse check (the high-value move).** If the only way to pass the current red test is a LOW-priority transformation (e.g., `(expression -> function)` or `(case)`), do NOT recommend forcing it. Instead recommend, in order:
   a. Pose a DIFFERENT, simpler test that advances the same behavior but is passable by a higher-priority transformation (optionally skip/`@Ignore` the hard test temporarily);
   b. Check whether a small refactoring (structure-only) would open a higher-priority path;
   c. Only if neither works, take the low-priority transformation, and say explicitly why it was unavoidable.
6. **Show, don't drive.** Present the minimal diff and the named transformation; let the developer apply it and run the tests. Never edit code or run tests unless explicitly asked.
7. **Stay non-dogmatic.** Frame every recommendation as "the simplest transformation that passes this test, per TPP" and note that the ordering is a heuristic (informal, roughly ordered, language-specific) -- deviation with a stated reason is legitimate.

---

## Sources

Authoritative (primary), fetched in full 2026-07-02:
- Robert C. Martin, "The Transformation Priority Premise", Clean Coder Blog (post dated Dec 19 2010; published May 27 2013) -- https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html (original 12-item list; mantra; transformations-vs-refactorings; Word Wrap impasse; amended RGR process). HIGH confidence.
- Robert C. Martin, "Fib. The T-P Premise.", Clean Coder Blog (post dated Feb 2 2011; published May 27 2013) -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html (canonical revised 14-item list; tail-recursion + case additions; language-specificity; Fibonacci worked example). HIGH confidence.
- Robert C. Martin, "The Transformation Priority Premise", NDC 2011 talk -- https://youtu.be/B93QezwTQpI (video id B93QezwTQpI). Authoritative; full transcript produced in a later execution phase, NOT transcribed for this research per instructions.

Skill-authoring (primary for Part 1):
- Anthropic, "Skill authoring best practices", Claude Platform/Docs -- https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices (description = what + when, third-person, concrete trigger terms, name <=64 chars, description <=1024 chars, SKILL.md body <500 lines, progressive disclosure, scripts for deterministic ops, pre-publish checklist). HIGH confidence.
- Anthropic, "Agent Skills overview" -- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview (three-level progressive disclosure; bundled files free until used). HIGH confidence.
- Anthropic, "Equipping agents for the real world with Agent Skills" (engineering blog) -- https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills. HIGH confidence.
- skill-creator SKILL.md (local, read directly) -- description-as-triggering, "pushy to combat under-triggering", progressive disclosure levels, imperative writing, explain-the-why over MUSTs, trigger-accuracy eval loop. HIGH confidence.

Secondary (corroborating; used only to cross-check, blogs take precedence):
- Transformation Priority Premise -- Wikipedia -- https://en.wikipedia.org/wiki/Transformation_Priority_Premise (confirms list + language-specificity note; commonly shows the 12-item version -- flagged). MEDIUM confidence.
- ASOS Coding Style handbook, TPP section -- https://asos.gitbook.io/coding-style/module-1-classic-tdd/transformation-priority-premise-1. LOW/MEDIUM confidence.
- David Halewood, "TDD with the Transformation Priority Premise" -- https://davidhalewood.com/tdd-with-the-transformation-priority-premise/. LOW confidence.

---
*Feature research for: lz-tpp (TPP coach + reference skill under the lz-tdd plugin)*
*Researched: 2026-07-02*
