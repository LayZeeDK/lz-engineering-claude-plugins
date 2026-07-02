# Transformation Priority Premise -- Canonical Reference

> How this file was produced and reconciled: this is the single canonical, cited
> reference for Robert C. Martin's Transformation Priority Premise (TPP). Its content is
> distilled verbatim-faithfully from two primary Clean Coder blog posts -- the original
> "Transformation Priority Premise" post (TPP post) and the follow-up "Fib. The T-P
> Premise." post (FibTPP post) -- and cross-checked against a retained transcript of the
> NDC 2011 talk. Every list entry and key quote is cited inline to the specific post it
> came from ("(TPP post)" / "(FibTPP post)"), with full URLs in the Sources section. All
> arrows are normalized to ASCII `->` (see Notation notes). Precedence when the sources
> differ: the two blog posts > the NDC 2011 talk > secondary sources. This reference
> captures the list, the definitions, and the framing only; worked code examples and any
> language-specific coaching default are intentionally out of scope here.

## Transformations vs refactorings

Verbatim (TPP post), source spelling preserved:

> "Refactorings are simple operations that change the structure of code without changing
> it's [sic] behavior. Transformations are simple operations that change the behavior of code.
> Transformations can be used as the sole means for passing the currently failing test in
> the red/green/refactor cycle."

In short: a refactoring changes structure but preserves behavior; a transformation changes
behavior and is the means by which a failing (red) test is made to pass.

## The premise and the mantra

The premise (TPP post):

> "My premise is that if you choose the tests and implementations that employ
> transformations that are higher on the list, you will avoid the impasse."

The "impasse" is the local-maximum problem: a poor sequence of tests and implementations
can force a point where no small change makes the next test pass and the whole algorithm
must be rewritten -- breaking the tight red/green/refactor loop. Preferring higher-priority
transformations is meant to avoid reaching that point.

Priority is a complexity/risk ordering (TPP post):

> "the transformations at the top of the list are simpler, and less risky, than the
> transformations that are lower in the list."

> "the more complexity required by the test the larger the risk you take to get that test
> to pass."

The mantra (TPP post):

> "As the tests get more specific, the code gets more generic."

## TPP is a provisional heuristic

The author frames the ordering as informal and uncertain, not a rigid law. Each hedge is
quoted verbatim and cited to the post it actually came from (attribution is split across
both posts):

- "I have roughly ordered the transformations by their complexity" -- "roughly ordered"
  (TPP post)
- "The transformations as described are informal at best." -- "informal at best"
  (TPP post)
- "Is the priority order presented in this blog correct? (not likely)" -- "not likely"
  (TPP post)
- "Are these the right transformations? (probably not)" (TPP post)
- "Is there really a priority? (I think so, but it might be more complicated than a simple
  ordinal sequence)" (TPP post)
- "the priority list is language specific" (FibTPP post)

Treat the list as a heuristic: prefer the higher-priority transformation, but a deviation
with a stated reason is legitimate.

## Canonical transformation priority list

The canonical list is the revised 14-item list from the FibTPP post (it explicitly revises
the earlier 12-item list; see Provenance below). Entries are verbatim-faithful with arrows
normalized to ASCII `->`; descriptions are given where the source gives them (FibTPP post):

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

## Notation notes

- Arrow normalization: the primary sources render some arrows (notably the `({} -> nil)`
  entry) with a non-ASCII dash glyph while other arrows use ASCII. This repo is ASCII-only,
  so every arrow here is normalized to ASCII `->`. This is a rendering normalization only;
  no transformation name or meaning is changed.
- Glossary of the tokens used in the list:
  - `{}` = no code at all / an empty body.
  - `nil` = null / a nothing-ish return value (the posts use "nil" and "null"
    interchangeably).
  - `constant+` = a more complex constant than a bare `nil` / `0` / `""`.
  - `scalar` = a variable or an argument (a generalization of a constant).
  - `array` = an indexed sequence.
  - `container` = a collection or map generalizing an array.
  - `(case)` = adding a `case` to a `switch`, or an `else` / `else if` branch -- the lowest
    priority (last resort).

## Amended red-green-refactor process

If you accept the priority premise, amend ordinary TDD with the following (verbatim block,
TPP post):

> * When passing a test, prefer higher priority transformations.
> * When posing a test choose one that can be passed with higher priority transformations.
> * When an implementation seems to require a low priority transformation, backtrack to see
>   if there is a simpler test to pass.

## Provenance: original 12-item list

The earlier TPP post published a 12-item list. It is retained here for provenance; it is
superseded by the canonical 14-item list above. Entries are verbatim-faithful with arrows
normalized to ASCII `->` (TPP post):

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

The TPP post appends "There are likely others." after this list (TPP post).

## Provenance: FibTPP revisions and the 12-vs-14 resolution

The FibTPP post explicitly revises the original 12-item list into the canonical 14-item
list with three changes (FibTPP post):

1. Added `(statement -> tail-recursion)` at position 9, ABOVE `(if -> while)`. Rationale
   (FibTPP post): "tail recursion is preferred over arbitrary recursion."
2. Added `(case)` at position 14, at the very bottom. Rationale (FibTPP post): "So I've
   added the (case) transformation to the very bottom of the list. This means that using a
   switch/case or an 'else if' is always the last option to choose."
3. Moved plain `(statement -> recursion)` to position 11, now BELOW `(if -> while)` (it was
   at position 9, above `(if -> while)`, in the original 12-item list).

This reference adopts the revised 14-item FibTPP list as the canonical source of truth, and
retains the original 12-item list plus these three revisions solely for provenance. The
recursion/iteration reordering is a deliberate within-source evolution by the author, not a
transcription error.

The author also notes that the ordering is language-dependent. Captured here as provenance
for that evolution -- not as a coaching default (FibTPP post):

> "In Java, for example, we might move (if -> while) and (variable -> assignment) above
> (statement -> tail-recursion) so that iteration is always preferred above recursion, and
> assignment is preferred above parameter passing."

The opinionated per-language ordering default that could be built on this caveat is out of
scope for this reference.

## Secondary-source drift

Secondary sources (Wikipedia and similar third-party write-ups) commonly diverge from the
primary posts and must be treated as cross-checks only, never as the canonical list.
Common drift patterns:

- They commonly render `(constant -> scalar)` as `(constant -> variable)`.
- They commonly mislabel plain `(statement -> recursion)` as "tail recursion".
- They commonly publish only the original 12-item list and omit the FibTPP revisions.

When a secondary source disagrees with the two blog posts, the blog posts win.

## NDC 2011 transcript reconciliation

The NDC 2011 talk (video id `B93QezwTQpI`) was transcribed and retained as source material
(see Sources). The transcript is a spoken-word caption/ASR track that paraphrases the list
informally rather than enumerating it verbatim. Reconciling it against the canonical blog
list, the following discrepancies are NOTED (not silently resolved):

- The talk presents a PARTIAL, unnumbered, informally-named subset of the transformations
  and explicitly says "there are several others here"; it is not a canonical ordered list.
- The talk's spoken names differ from the written blog tokens: it says "constant ->
  variable" (blog: `(constant -> scalar)`), "scalar into a vector" (blog: `(scalar ->
  array)`), "statement to if" (blog: `(unconditional -> if)`), and "statement to
  assignment" at the bottom (blog: `(variable -> assignment)`).
- The 2011 talk predates the written FibTPP revisions: the spoken list contains neither
  `(statement -> tail-recursion)` nor `(case)` at the bottom.
- The talk states the mantra as "the code must get more generic"; the TPP post writes it as
  "the code gets more generic". Same meaning, minor wording difference.
- The talk names the blog only in garbled caption form ("blog. cleaners.com"); the actual
  domain is `blog.cleancoder.com`.

What the talk corroborates: the core distinction (refactorings preserve behavior;
transformations change behavior), the direction (specific -> generic), and the premise
(prefer transformations higher on the list to derive better algorithms).

The two Clean Coder blog posts take precedence over the NDC 2011 talk, which in turn takes
precedence over secondary sources -- blogs > talk > secondary. Where the talk differs from the
blogs, the canonical verbatim list and definitions above come from the blogs.

## Sources / citations

- TPP post -- Robert C. Martin, "The Transformation Priority Premise" (Clean Coder Blog):
  https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
  Source of: the original 12-item list, the transformations-vs-refactorings definition, the
  premise, the priority rationale, the mantra, the author's hedges (except "language
  specific"), and the amended red-green-refactor process.
- FibTPP post -- Robert C. Martin, "Fib. The T-P Premise." (Clean Coder Blog):
  https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
  Source of: the canonical revised 14-item list, the three revisions (tail-recursion added,
  `(case)` added, recursion moved), the "language specific" caveat, and the language-specific
  ordering example.
- NDC 2011 talk -- Robert C. Martin, "The Transformation Priority Premise", NDC 2011 (video
  id `B93QezwTQpI`): https://youtu.be/B93QezwTQpI
  A transcript was retained as unshipped source material for the reconciliation section above.
- Secondary sources (Wikipedia and similar): cross-check only; known to drift (see
  Secondary-source drift). Never used as the canonical list.
