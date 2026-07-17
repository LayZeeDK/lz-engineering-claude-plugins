# EVL-02 aggregate (Pass@k / Pass^k)

Runs per config: 3. Fully-correct = all expectations (name+layer+nodrive+judge) pass in that run.

## Per-scenario Pass@1 (fully-correct rate)

| Scenario | with_skill c/n | with_skill Pass@1 | without_skill c/n | without_skill Pass@1 |
|---|---|---|---|---|
| eval-0-long-function | 3/3 | 100% | 3/3 | 100% |
| eval-1-long-parameter-list | 3/3 | 100% | 3/3 | 100% |
| eval-2-duplicated-code | 3/3 | 100% | 3/3 | 100% |
| eval-3-feature-envy | 3/3 | 100% | 3/3 | 100% |
| eval-4-conditional-strategy | 3/3 | 100% | 3/3 | 100% |
| eval-5-state-altering | 3/3 | 100% | 3/3 | 100% |
| eval-6-combinatorial-interpreter | 3/3 | 100% | 3/3 | 100% |
| eval-7-singleton-depattern | 3/3 | 100% | 3/3 | 100% |
| eval-8-repeated-switch | 3/3 | 100% | 2/3 | 67% |

## Overall

| Config | c/n | Pass@1 | Pass@3 | Pass@27 |
|---|---|---|---|---|
| with_skill | 27/27 | 100% | 100% | 100% |
| without_skill | 26/27 | 96% | 100% | 100% |

## Saturated assertions (Pass@1 = 1.0 for BOTH configs)

- [0|0] Names Extract Function as the best-fit next refactoring
- [0|1] Names an in-set Long Function refactoring
- [0|2] Routes to the Fowler mechanical layer
- [0|3] Ties the pick to a nameable block within the long body (validate / compute totals / format receipt), not a generic 'shorten it'
- [0|4] Coach, don't drive (no edit / no test run)
- [1|0] Names Introduce Parameter Object as the best-fit next refactoring
- [1|1] Names an in-set Long Parameter List refactoring
- [1|2] Routes to the Fowler mechanical layer
- [1|3] Ties the pick to the street/city/zip clump that travels together, not a generic parameter reduction
- [1|4] Coach, don't drive (no edit / no test run)
- [2|0] Names Pull Up Method as the best-fit next refactoring
- [2|1] Names an in-set Duplicated Code refactoring
- [2|2] Routes to the Fowler mechanical layer
- [2|3] Ties the pick to WHERE the duplication lives (identical code in sibling subclasses -> lift to the shared parent), not a generic dedup
- [2|4] Coach, don't drive (no edit / no test run)
- [3|0] Names Move Function as the best-fit next refactoring
- [3|1] Names an in-set Feature Envy refactoring
- [3|2] Routes to the Fowler mechanical layer
- [3|3] Ties the pick to the whole function computing from Customer's fields (it envies the other module), siting it with that data
- [3|4] Coach, don't drive (no edit / no test run)
- [4|0] Names Replace Conditional Logic with Strategy as the best-fit next refactoring
- [4|1] Names an in-set Conditional Complexity refactoring
- [4|2] Routes to the Kerievsky pattern-directed layer
- [4|3] Ties the pick to the conditional choosing among whole interchangeable algorithms (not optional embellishment or next-state selection)
- [4|4] Coach, don't drive (no edit / no test run)
- [5|0] Names Replace State-Altering Conditionals with State as the best-fit next refactoring
- [5|1] Names an in-set Conditional Complexity refactoring
- [5|2] Routes to the Kerievsky pattern-directed layer
- [5|3] Ties the pick to conditionals that both decide what may happen now AND choose which status comes next (state-altering), not whole-algorithm selection
- [5|4] Coach, don't drive (no edit / no test run)
- [6|0] Names Replace Implicit Language with Interpreter as the best-fit next refactoring
- [6|1] Routes to the Kerievsky pattern-directed layer
- [6|2] Frames the near-identical combination methods as an unnamed mini-language whose terms become composable objects, not plain incidental duplication
- [6|3] Coach, don't drive (no edit / no test run)
- [7|0] Names an accepted de-patterning route: Inline Singleton or the Module Namespace functional dissolution
- [7|1] Routes to the Kerievsky-Away or functional layer (either is accepted)
- [7|2] Frames the Singleton as unwarranted (nothing needs single-instance policy) and names the dissolution, rather than keeping or embellishing the pattern
- [7|3] Coach, don't drive (no edit / no test run)
- [8|0] Names Replace Conditional with Polymorphism as the best-fit next refactoring
- [8|1] Routes to the Fowler mechanical layer (NOT a Kerievsky pattern-directed refactoring)
- [8|3] Coach, don't drive (no edit / no test run)
