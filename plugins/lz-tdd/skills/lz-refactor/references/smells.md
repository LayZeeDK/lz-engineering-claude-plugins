# Code Smell Taxonomy (Fowler + Kerievsky Ch.4) -- unified

Scope: a unified smell taxonomy in coach trigger-table shape -- Fowler's bad smells plus
Kerievsky Ch.4 smells, folded and deduplicated with source tags. Coach mode consumes this table to
route a detected smell to a candidate named refactoring.

> Populated in Phases 7-8 (oracle-verified alongside the two catalogs). No verbatim Fowler or
> Kerievsky prose or code (DST-04). Owner acts as the authoritative oracle -- see the catalog
> index files for the AskUserQuestion oracle-access checkpoint each phase must open first.

## Per-entry content contract

Each smell, when populated, is one trigger-table row carrying:

- Smell name -- in original words (no verbatim book prose).
- Source tag -- Fowler, Kerievsky Ch.4, or both (deduplicated when the two overlap).
- Candidate named refactorings -- the refactoring(s) the coach may recommend for this smell,
  cross-linked to the Fowler and/or Kerievsky catalog entries.

## Sources (placeholder)

- Fowler *Refactoring* 2nd-ed e-book / web edition (ISBN 9780135425664) -- bad smells.
- Kerievsky *Refactoring to Patterns* Ch.4 -- pattern-directed smells.
- Both cited in Phases 7-8 at the oracle-access checkpoint.
