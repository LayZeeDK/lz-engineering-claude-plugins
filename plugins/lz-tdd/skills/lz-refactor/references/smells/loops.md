# Loops

Recognize by: a loop, or a reduce or accumulator that buckets items into a Map or object under a key, whose real intent (filter, map, sum, group-by) is buried in bookkeeping.

## How to recognize

A `for` or `while` that mixes iteration mechanics with the work it does, so you must read the whole
body to see that it is really selecting some elements, transforming them, and combining them. Nested
or multi-purpose loops are the clearest cases. When one loop does several unrelated things, that is
also [Long Function](long-function.md) territory. Split the jobs before naming them.

A `reduce` (or an accumulator loop) that mutates a `Map` or object with a nested `if`/`else` to bucket
items under a key is the same smell wearing a functional coat: its real intent is a group-by, hidden in
the bookkeeping. Read "collect each item into the bucket for its key" and treat it as a pipeline step,
not as loop state to reconstruct. When that reduce scans the accumulator on each item (an inner `find`
or `some`) to locate the bucket, it can be quadratic as well, so naming the group-by removes a potential
O(n^2) scan, not only clarifies the intent -- a real reduction to weigh in the refactoring decision.

## Why it's a problem

Hand-written loops force the reader to reconstruct intent from index arithmetic and accumulator
updates, and they resist reuse. Expressing the sequence of operations directly makes each step
visible and lets the collection pipeline carry the mechanics.

## Candidate refactorings

- [Replace Loop with Pipeline](../fowler-catalog/replace-loop-with-pipeline.md#replace-loop-with-pipeline): pick when the loop is a chain of filter/map/reduce steps; make each step explicit as a pipeline operation.
