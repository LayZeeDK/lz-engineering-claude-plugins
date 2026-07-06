# Refactoring Directions -- authoritative Direction source (Phase 8)

**Provenance:** transcribed from Joshua Kerievsky, *Refactoring to Patterns*, the book's "Refactoring
Directions" table. Owner-authorized 2026-07-06 to keep in `.planning/`. This is a FACTUAL direction
matrix: the refactoring names and GoF/pattern names are public vocabulary (Kerievsky's catalog is public
at industriallogic.com; GoF pattern names are common knowledge), and each To/Towards/Away entry is a fact
about the refactoring. It is NOT reproduced in the shipped skill tree (`plugins/lz-tdd/skills/...`); it
lives only as a planning artifact.

**Authority:** this table is the authoritative source for each Kerievsky leaf's `Direction:` field, and
the `oracle`/`oracle-reviewer` agents CAN read it -- they now carry standing instructions (committed
9a877d7) to consult it at the book's Inside Front Cover when settling a refactoring's direction. It
outranks per-chapter PROSE: the prose frames only the pattern being ADOPTED, so it misses a refactoring's
classification relative to a DIFFERENT pattern. A refactoring may appear under more than one column and in
more than one pattern row (e.g. Move Accumulation to Visitor is To/Towards Visitor AND Away from
Iterator). See auto-memory `kerievsky-direction-table-authoritative`.

## Legend (To / Towards / Away)

The book does NOT explicitly define these terms. Their meaning was INFERRED (2026-07-06) by three
independent `oracle` consults -- Ch.7, Ch.8, Ch.10 (the chapters that contain the To-vs-Towards contrast)
-- each comparing every refactoring's actual mechanics/end-state to the column the table assigns it. All
three converged (confidence ~72-76 each):

- **To** -- run to completion, the refactoring FULLY instantiates the named pattern: every participant and
  collaboration the pattern requires ends up in place. The pattern is the destination; there is no
  meaningful "did most of it but it is not the pattern yet" resting state. Every pattern-targeting
  refactoring appears under `To`.
- **Towards** (only ever listed ALSO under `To` -- never Towards-only) -- the refactoring additionally has
  a legitimate PARTIAL adoption: a two-phase shape whose first phase yields a deliberately-keepable
  intermediate that installs the pattern's key seam (a shared interface, loose coupling, a state-as-class
  field) and makes the design pattern-READY, while a SEPARABLE second phase (often Replace Conditional
  with Polymorphism, or adding a common abstraction + dispatch) completes the full pattern -- a step the
  book treats as optional and sometimes an enhancement (new behavior), because the full GoF structure is
  often more than you need. The dual `To`+`Towards` tag marks a refactoring you can carry all the way or
  honestly stop partway.
- **Away** -- de-patterning: the refactoring retreats FROM the row's pattern (dismantles/retires it). The
  3 named cases; a refactoring can be To/Towards one pattern AND Away from another (Move Accumulation to
  Visitor: To/Towards Visitor, Away Iterator).

Textual anchors were strongest for Decorator and Strategy (the author explicitly contrasts refactoring
"towards" a pattern vs "all the way to it", and frames Strategy as "to or towards"). This is inferred, not
stated -- treat it as high-confidence-but-interpretive.

**LOCKED CONVENTION (unanimous 6-member Opus board, peer-deliberated 2026-07-06; owner-approved):**

- **Both-listed refactorings (the 6): `Direction: To/Towards`** (compound). The `Direction:` field records the
  source-table FACT, and the table places these 6 in two cells; the compound preserves that losslessly, is
  checker-legal (leading-token match validates and routes as `To`), and is coach-safe. Applied ONLY to the 6
  truly dual-listed leaves.
- **Table-absent utilities (the 4 -- Replace Type Code with Class, Chain Constructors, Unify Interfaces,
  Extract Parameter): `Direction: n/a`** (sentinel). They have no table row, so the faithful record is "not
  applicable"; `n/a` mirrors their `GoF pattern: n/a -- utility` sibling and matches this doc's Authoritative
  column. This SUPERSEDES the earlier "keep Towards" -- `Towards` falsely implied a partial adoption of a
  nonexistent pattern. Requires widening `check-kerievsky`'s Direction allow-list by the one `n/a` token
  (08-06; the Phase-9 coach keys only on `Away`, so its routing is untouched).
- **A single SHARED gloss line ships in the kerievsky-catalog README** (NOT per-leaf -- a per-leaf gloss
  would re-import into the shipped tree the `.planning/` table deliberately withheld from it):
  `To` = completes the pattern; `To/Towards` = completes it and also supports a keepable partial adoption;
  `Away` = de-patterns; `n/a` = utility, targets no GoF pattern so direction does not apply.

Board convergence record: opened split (D1: 3 `To/Towards` / 2 `To` / 1 binary; D2: 5 `To` / 1
sentinel-lean); converged unanimously through peer rounds (no chair). Decisive shifts: the VERIFIED finding
that `## Watch for` carries only generic over-application advice (so `To`-alone would DELETE the dual-degree
fact from the shipped tree with no other carrier), and -- for D2 -- that the D1 shipped gloss defining
`To` = "completes the pattern" would make `Direction: To` self-contradictory beside `GoF pattern: n/a --
utility`.

**The table below is transcribed VERBATIM as provided from the book (owner-confirmed 2026-07-06).** Some
cells -- Command/Towards, and Observer/To and Towards -- contain a repeated name fragment exactly as
written in the source; this is preserved, NOT normalized, and its significance is a question about the
To/Towards semantics, not a transcription error to fix.

## Table (by pattern)

| Pattern | To | Towards | Away |
|---|---|---|---|
| Adapter | Extract Adapter, Unify Interfaces with Adapter | Unify Interfaces with Adapter | |
| Builder | Encapsulate Composite with Builder | | |
| Collecting Parameter | Move Accumulation to Collecting Parameter | | |
| Command | Replace Conditional Dispatcher with Command | Replace Conditional Dispatcher Replace Conditional Dispatcher with Command | |
| Composed Method | Compose Method | | |
| Composite | Replace One/Many Distinctions with Composite, Extract Composite, Replace Implicit Tree with Composite | | Encapsulate Composite with Builder |
| Creation Method | Replace Constructors with Creation Methods | | |
| Decorator | Move Embellishment to Decorator | Move Embellishment to Decorator | |
| Factory | Move Creation Knowledge to Factory, Encapsulate Classes with Factory | | |
| Factory Method | Introduce Polymorphic Creation with Factory Method | | |
| Interpreter | Replace Implicit Language with Interpreter | | |
| Iterator | | | Move Accumulation to Visitor |
| Null Object | Introduce Null Object | | |
| Observer | Replace Hard-Coded Notifications with Observer Notifications with Observer | Replace Hard-Coded Notifications with Observer Notifications with Observer | |
| Singleton | Limit Instantiation with Singleton | | Inline Singleton |
| State | Replace State-Altering Conditionals with State | Replace State-Altering Conditionals with State | |
| Strategy | Replace Conditional Logic with Strategy | Replace Conditional Logic with Strategy | |
| Template Method | Form Template Method | | |
| Visitor | Move Accumulation to Visitor | Move Accumulation to Visitor | |

## Same-row To vs Towards (per both-listed refactoring, inferred)

For each refactoring the table lists under BOTH `To` and `Towards` within a single pattern row, the two
columns name two attainable DEGREES of that one refactoring: `Towards` = the deliberately-keepable phase-1
intermediate (pattern-ready, the pattern's key seam installed); `To` = carrying the separable phase-2
through to the complete pattern. Inferred per refactoring (own words; ~72-76 confidence):

| Refactoring (pattern) | `Towards` = partial resting state | `To` = completed pattern |
|---|---|---|
| Replace Conditional Logic with Strategy (Strategy) | algorithm delegated to a single separate strategy object | the conditional becomes a family of interchangeable concrete strategies |
| Move Embellishment to Decorator (Decorator) | a delegating subclass that is almost a decorator | a transparent wrapper whose wrapped object is injected |
| Replace State-Altering Conditionals with State (State) | the state field's type becomes a class (state-as-class) | transition logic pushed into per-state subclasses the context delegates to |
| Replace Conditional Dispatcher with Command (Command) | each handler's behavior extracted into its own class | those classes share a common execution interface, dispatched via a command map/invoker |
| Replace Hard-Coded Notifications with Observer (Observer) | collaborators coupled loosely through an observer interface (still one-to-one) | the subject holds a collection of observers (one-to-many) -- an enhancement |
| Unify Interfaces with Adapter (Adapter) | a common interface extracted + a bare adapter not yet implementing it | the adapter formally implements the common interface (a true Adapter) |
| Move Accumulation to Visitor (Visitor) | the design pushed incrementally toward a Visitor architecture (a subset of classes visited) | the host is a complete double-dispatch Visitor |

(Move Accumulation to Visitor is additionally `Away` from Iterator -- a separate pattern row, not a
To/Towards degree.)

## Per-leaf reconciliation (authored `Direction:` vs the table)

Per the LOCKED CONVENTION above, the authoritative single value is: `To` for To-only rows; `To/Towards` for
the 6 both-listed rows; `Away` for the 3 de-patterning cases; `n/a` for the 4 table-absent utilities.
Status column: `done (08-05)` = set in this plan; `08-06` = reconciled at the phase gate (committed leaves);
`ok` = already correct as committed.

| Refactoring | Table direction(s) | Authoritative | Status |
|---|---|---|---|
| Extract Adapter | To (Adapter) | To | 08-06 (Towards -> To) |
| Unify Interfaces with Adapter | To+Towards (Adapter) | To/Towards | 08-06 (Towards -> To/Towards) |
| Encapsulate Composite with Builder | To (Builder), Away (Composite) | Away | ok |
| Move Accumulation to Collecting Parameter | To (Collecting Parameter) | To | done (08-05) |
| Replace Conditional Dispatcher with Command | To+Towards (Command) | To/Towards | 08-06 (Towards -> To/Towards) |
| Compose Method | To (Composed Method) | To | 08-06 (Towards -> To) |
| Replace One/Many Distinctions with Composite | To (Composite) | To | 08-06 (Towards -> To) |
| Extract Composite | To (Composite) | To | 08-06 (Towards -> To) |
| Replace Implicit Tree with Composite | To (Composite) | To | 08-06 (Towards -> To) |
| Replace Constructors with Creation Methods | To (Creation Method) | To | 08-06 (Towards -> To) |
| Move Embellishment to Decorator | To+Towards (Decorator) | To/Towards | 08-06 (Towards -> To/Towards) |
| Move Creation Knowledge to Factory | To (Factory) | To | 08-06 (Towards -> To) |
| Encapsulate Classes with Factory | To (Factory) | To | 08-06 (Towards -> To) |
| Introduce Polymorphic Creation with Factory Method | To (Factory Method) | To | 08-06 (Towards -> To) |
| Replace Implicit Language with Interpreter | To (Interpreter) | To | 08-06 (Towards -> To) |
| Move Accumulation to Visitor | To+Towards (Visitor), Away (Iterator) | Away (de-patterning framing, D-03) | ok |
| Introduce Null Object | To (Null Object) | To | done (08-05) |
| Replace Hard-Coded Notifications with Observer | To+Towards (Observer) | To/Towards | 08-06 (Towards -> To/Towards) |
| Limit Instantiation with Singleton | To (Singleton) | To | done (08-05) |
| Inline Singleton | Away (Singleton) | Away | ok |
| Replace State-Altering Conditionals with State | To+Towards (State) | To/Towards | 08-06 (Towards -> To/Towards) |
| Replace Conditional Logic with Strategy | To+Towards (Strategy) | To/Towards | 08-06 (Towards -> To/Towards) |
| Form Template Method | To (Template Method) | To | 08-06 (Towards -> To) |
| Replace Type Code with Class | (not in table) | n/a | done (08-05) |
| Chain Constructors | (not in table) | n/a | done (08-05) |
| Unify Interfaces | (not in table) | n/a | done (08-05) |
| Extract Parameter | (not in table) | n/a | done (08-05) |

**Summary:** 7 leaves settled in 08-05 (3 To-only -> `To`; 4 utilities -> `n/a`); 3 already correct (`Away`);
17 committed leaves reconciled at 08-06 (11 `Towards` -> `To`; 6 `Towards` -> `To/Towards`). 08-06 also
widens the `check-kerievsky` Direction allow-list (+`n/a`, + compound leading-token) and ships the shared
README gloss.
