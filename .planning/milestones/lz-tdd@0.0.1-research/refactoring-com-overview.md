# refactoring.com Catalog -- Overview (scaffold for Phase 7)

**Ingested:** 2026-07-04 via markdown.new from <https://refactoring.com/catalog/>
**Scope:** Fowler's free public catalog for *Refactoring* (2nd ed). **Fowler only** --
Kerievsky's *Refactoring to Patterns* is NOT on refactoring.com.
**Status:** small and incomplete by design -- each entry page has only a title, the
"refactorgram" SVG sketch, a tiny before/after JS excerpt, plus `inverse of` and
`aliases` cross-links. This file is an ORIENTATION SCAFFOLD, not a content source; the
authoritative oracle for full mechanics/prose remains the owner's e-book + web edition.
Per-entry excerpt/sketch/inverse-of harvest is deferred to Phase 7 (see note at end).

## What each entry page provides

Confirmed from the Extract Function page (`/catalog/extractFunction.html`):

- `# <Name>` heading
- link to the InformIT web edition (owner has access: ISBN 9780135425664)
- `![refactorgram](/rgrams/<name>.svg)` -- the book's sketch as SVG
- a short **before** JS snippet and a short **after** JS snippet (JavaScript, 2nd-ed style)
- `**inverse of** [<Other>](...)` -- the reverse refactoring, when it has one
- `**aliases** <1st-edition / alternate names>`

## Fowler catalog tags (Fowler's own grouping)

`basic`, `encapsulation`, `moving-features`, `organizing-data`,
`simplify-conditional-logic`, `refactoring-apis`, `dealing-with-inheritance`,
`collections`, `delegation`, `errors`, `extract`, `parameters`, `fragments`,
`grouping-function`, `immutability`, `inline`, `remove`, `rename`, `split-phase`,
`variables`

## The 66 refactorings + aliases (authoritative rename map)

Aliases are the 1st-edition / alternate names each 2nd-edition refactoring replaces or
is also known by -- useful so the skill resolves old names to the current one.

| # | Refactoring (2nd ed) | Aliases / replaces | Slug |
|---|----------------------|--------------------|------|
| 1 | Change Function Declaration | Add Parameter; Change Signature; Remove Parameter; Rename Function; Rename Method | changeFunctionDeclaration |
| 2 | Change Reference to Value | -- | changeReferenceToValue |
| 3 | Change Value to Reference | -- | changeValueToReference |
| 4 | Collapse Hierarchy | -- | collapseHierarchy |
| 5 | Combine Functions into Class | -- | combineFunctionsIntoClass |
| 6 | Combine Functions into Transform | -- | combineFunctionsIntoTransform |
| 7 | Consolidate Conditional Expression | -- | consolidateConditionalExpression |
| 8 | Decompose Conditional | -- | decomposeConditional |
| 9 | Encapsulate Collection | -- | encapsulateCollection |
| 10 | Encapsulate Record | Replace Record with Data Class | encapsulateRecord |
| 11 | Encapsulate Variable | Encapsulate Field; Self-Encapsulate Field | encapsulateVariable |
| 12 | Extract Class | -- | extractClass |
| 13 | Extract Function | Extract Method | extractFunction |
| 14 | Extract Superclass | -- | extractSuperclass |
| 15 | Extract Variable | Introduce Explaining Variable | extractVariable |
| 16 | Hide Delegate | -- | hideDelegate |
| 17 | Inline Class | -- | inlineClass |
| 18 | Inline Function | Inline Method | inlineFunction |
| 19 | Inline Variable | Inline Temp | inlineVariable |
| 20 | Introduce Assertion | -- | introduceAssertion |
| 21 | Introduce Parameter Object | -- | introduceParameterObject |
| 22 | Introduce Special Case | Introduce Null Object | introduceSpecialCase |
| 23 | Move Field | -- | moveField |
| 24 | Move Function | Move Method | moveFunction |
| 25 | Move Statements into Function | -- | moveStatementsIntoFunction |
| 26 | Move Statements to Callers | -- | moveStatementsToCallers |
| 27 | Parameterize Function | Parameterize Method | parameterizeFunction |
| 28 | Preserve Whole Object | -- | preserveWholeObject |
| 29 | Pull Up Constructor Body | -- | pullUpConstructorBody |
| 30 | Pull Up Field | -- | pullUpField |
| 31 | Pull Up Method | -- | pullUpMethod |
| 32 | Push Down Field | -- | pushDownField |
| 33 | Push Down Method | -- | pushDownMethod |
| 34 | Remove Dead Code | -- | removeDeadCode |
| 35 | Remove Flag Argument | Replace Parameter with Explicit Methods | removeFlagArgument |
| 36 | Remove Middle Man | -- | removeMiddleMan |
| 37 | Remove Setting Method | -- | removeSettingMethod |
| 38 | Remove Subclass | Replace Subclass with Fields | removeSubclass |
| 39 | Rename Field | -- | renameField |
| 40 | Rename Variable | -- | renameVariable |
| 41 | Replace Command with Function | -- | replaceCommandWithFunction |
| 42 | Replace Conditional with Polymorphism | -- | replaceConditionalWithPolymorphism |
| 43 | Replace Constructor with Factory Function | Replace Constructor with Factory Method | replaceConstructorWithFactoryFunction |
| 44 | Replace Control Flag with Break | Remove Control Flag | replaceControlFlagWithBreak |
| 45 | Replace Derived Variable with Query | -- | replaceDerivedVariableWithQuery |
| 46 | Replace Error Code with Exception | -- | replaceErrorCodeWithException |
| 47 | Replace Exception with Precheck | Replace Exception with Test | replaceExceptionWithPrecheck |
| 48 | Replace Function with Command | Replace Method with Method Object | replaceFunctionWithCommand |
| 49 | Replace Inline Code with Function Call | -- | replaceInlineCodeWithFunctionCall |
| 50 | Replace Loop with Pipeline | -- | replaceLoopWithPipeline |
| 51 | Replace Magic Literal | Replace Magic Number with Symbolic Constant | replaceMagicLiteral |
| 52 | Replace Nested Conditional with Guard Clauses | -- | replaceNestedConditionalWithGuardClauses |
| 53 | Replace Parameter with Query | Replace Parameter with Method | replaceParameterWithQuery |
| 54 | Replace Primitive with Object | Replace Data Value with Object; Replace Type Code with Class | replacePrimitiveWithObject |
| 55 | Replace Query with Parameter | -- | replaceQueryWithParameter |
| 56 | Replace Subclass with Delegate | -- | replaceSubclassWithDelegate |
| 57 | Replace Superclass with Delegate | Replace Inheritance with Delegation | replaceSuperclassWithDelegate |
| 58 | Replace Temp with Query | -- | replaceTempWithQuery |
| 59 | Replace Type Code with Subclasses | Extract Subclass; Replace Type Code with State/Strategy | replaceTypeCodeWithSubclasses |
| 60 | Return Modified Value | -- | returnModifiedValue |
| 61 | Separate Query from Modifier | -- | separateQueryFromModifier |
| 62 | Slide Statements | Consolidate Duplicate Conditional Fragments | slideStatements |
| 63 | Split Loop | -- | splitLoop |
| 64 | Split Phase | -- | splitPhase |
| 65 | Split Variable | Remove Assignments to Parameters; Split Temp | splitVariable |
| 66 | Substitute Algorithm | -- | substituteAlgorithm |

Entry URL pattern: `https://refactoring.com/catalog/<slug>.html`; sketch:
`https://refactoring.com/rgrams/<slug>.svg`.

## Notes / reconciliation

- Count matches the owner-confirmed catalog exactly: **66**.
- The 5 print-absent (`+`) entries (Replace Magic Literal, Replace Control Flag with
  Break, Return Modified Value, Replace Error Code with Exception, Replace Exception
  with Precheck) ARE present here (this is the web catalog). Provenance labels in the
  skill are informational only; the owner's e-book/web edition remains the oracle for
  all 66.
- `inverse of` links per page give the reverse-refactoring graph (e.g., Extract
  Function <-> Inline Function) -- useful structural metadata for the catalog.
- Excerpts are tiny JS; all shipped skill samples are ORIGINAL TS/JS, not copied from
  here (DST-04). This scaffold is for orientation and name/alias/inverse cross-checks.

**Deferred to Phase 7:** optional full per-entry harvest (sketch + before/after +
inverse-of for each of the 66) if a richer local scaffold is wanted; the index-level
overview above is sufficient to structure the Fowler catalog docs.
