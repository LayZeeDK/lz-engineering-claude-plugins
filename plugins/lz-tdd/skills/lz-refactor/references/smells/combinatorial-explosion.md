# Combinatorial Explosion

Recognize by: a pile of near-identical methods or branches that each handle one combination of the same few options: an unnamed mini-language spelled out by hand.

Source: Kerievsky

## How to recognize

You find many methods (or branches) that differ only in which combination of a small set of conditions or inputs they cover, so adding one more option multiplies the cases rather than adding one. The shared structure, the grammar of terms being combined, is never named; it is scattered across all the variants. This is a specific, structured form of duplication, so it is narrower than plain
[Duplicated Code](duplicated-code.md): the copies are systematic combinations, not incidental repetition, and it is not
[Repeated Switches](repeated-switches.md) either, since the problem is the explosion of combinations rather than one switch repeated across sites.

## Why it's a problem

Because the cases are combinations, they grow multiplicatively: each new dimension multiplies the method count, and the implicit rules for combining terms live in no single place, so the code is hard to extend and easy to get subtly inconsistent. Naming the language explicitly, representing each term as an object you can compose, collapses the explosion into a handful of building blocks.

## Candidate refactorings

- [Replace Implicit Language with Interpreter](../kerievsky-catalog/replace-implicit-language-with-interpreter.md#replace-implicit-language-with-interpreter): pick when the explosion of combination methods is really an unnamed language whose terms you can express as composable objects and evaluate.
