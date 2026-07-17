# Transformation Priority Premise -- provenance and source reconciliation

Audit trail for the shipped reference
`plugins/lz-tdd/skills/lz-tpp/references/transformations.md`. NOT shipped with the plugin --
this file holds the sourcing/reconciliation apparatus that the coach does not need at
answer time.

How the shipped reference was produced and reconciled: it is the single canonical, cited
reference for Robert C. Martin's Transformation Priority Premise (TPP). Its content is
distilled verbatim-faithfully from two primary Clean Coder blog posts -- the original
"Transformation Priority Premise" post (TPP post) and the follow-up "Fib. The T-P Premise."
post (FibTPP post) -- and cross-checked against a retained transcript of the NDC 2011 talk.
Every list entry and key quote is cited inline to the specific post it came from
("(TPP post)" / "(FibTPP post)"). All arrows are normalized to ASCII `->`. Precedence when
the sources differ: the two blog posts > the NDC 2011 talk > secondary sources. The shipped
reference captures the list, the definitions, and the framing only; worked code examples and
any language-specific coaching default are out of scope there.

## Provenance: original 12-item list

The earlier TPP post published a 12-item list. It is retained here for provenance; it is
superseded by the canonical 14-item list in the shipped reference. Entries are
verbatim-faithful with arrows normalized to ASCII `->` (TPP post):

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

The shipped reference adopts the revised 14-item FibTPP list as the canonical source of
truth, and retains the original 12-item list plus these three revisions solely for
provenance. The recursion/iteration reordering is a deliberate within-source evolution by the
author, not a transcription error.

The author also notes that the ordering is language-dependent. Captured here as provenance
for that evolution -- not as a coaching default (FibTPP post):

> "In Java, for example, we might move (if -> while) and (variable -> assignment) above
> (statement -> tail-recursion) so that iteration is always preferred above recursion, and
> assignment is preferred above parameter passing."

The opinionated per-language ordering default that could be built on this caveat is out of
scope for the shipped reference.

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
(`ndc-2011-tpp-transcript.md`, alongside this file). The transcript is a spoken-word
caption/ASR track that paraphrases the list informally rather than enumerating it verbatim.
Reconciling it against the canonical blog list, the following discrepancies are NOTED (not
silently resolved):

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
blogs, the canonical verbatim list and definitions in the shipped reference come from the
blogs.

## Sources

- TPP post -- Robert C. Martin, "The Transformation Priority Premise" (Clean Coder Blog):
  https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
  Source of the original 12-item list above.
- FibTPP post -- Robert C. Martin, "Fib. The T-P Premise." (Clean Coder Blog):
  https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
  Source of the three revisions and the language-specific ordering example above.
- NDC 2011 talk -- Robert C. Martin, "The Transformation Priority Premise", NDC 2011 (video
  id `B93QezwTQpI`): https://youtu.be/B93QezwTQpI
  Transcript: `ndc-2011-tpp-transcript.md` (this directory).
- Secondary sources (Wikipedia and similar): cross-check only; known to drift (see above).
  Never used as the canonical list.
