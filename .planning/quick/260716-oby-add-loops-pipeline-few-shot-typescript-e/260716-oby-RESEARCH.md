# Research: few-shot before/after examples as a loop-recognition lever

**Researched:** 2026-07-16
**Domain:** in-context learning / few-shot design for code-smell RECOGNITION
**Confidence:** MEDIUM (theory supports one specific mechanism; no study tests our exact setup; 4 prior null evals are a strong counter-prior)

## TL;DR verdict (skeptical)

- Few-shot examples are a **genuinely different lever than the prose rules we already tried** -- but only via ONE mechanism the evidence backs: exposing the model to the *input surface forms* it's failing to recognize. Rules supply "label space" (the model already HAS the pipeline category); examples supply "input distribution" (mapping THESE loop shapes INTO that category). That distinction is the single reason to expect this could beat the null.
- The support is **indirect**: the canonical ICL finding is about classification, not agentic reasoning; the code-refactoring few-shot wins measure output *correctness given a refactor was requested*, not *recognition of whether/where*; the code-smell paper doesn't compare examples vs rules at all. No study isolates our failure mode.
- Recommendation: **worth exactly one eval**, designed to maximize the supported mechanism (diverse surface disguises + explicit cue label + minimal contrast). If it nulls, the ceiling is inference-time salience/attention, not skill content -- stop editing content.

## Q1 -- what actually moves RECOGNITION (vs cargo-cult)

Min et al., "Rethinking the Role of Demonstrations" (ICL ablation) [CITED: ar5iv.labs.arxiv.org/html/2202.12837]:
- **Input-label correctness: barely matters** (0-5% drop with random labels). Do NOT fuss over pedantically "correct" labeling.
- **Input distribution: matters (3-16%).** Showing in-distribution inputs -- i.e., the actual accumulation-loop shapes -- is what drives recognition. **This is our lever.** Our failure is precisely that these input shapes aren't being mapped into the pipeline category; that's an input-distribution problem, which examples fix and prose does not.
- **Label space: matters (5-16%)** -- but we already supply this via the existing "Replace Loop with Pipeline" catalog entry, which is likely why more prose nulled.
- **Format/pairing structure: critical** -- keep clean before -> after pairing.

Contrastive ICL [CITED: arxiv.org/html/2401.17390v1]: contrastive positive/negative pairs beat plain few-shot on both accuracy and token efficiency, and **eliciting explicit analysis of what distinguishes the pair** helps -- evidence that naming the discriminative cue (not just showing it) aids recognition. Ordering/permutation sensitivity is real but high-variance and not controllable in a static skill file -- do not over-invest there.

Cargo-cult / won't move recognition: more prose rules (label-space we already have); label correctness pedantry; piling on shots (2-6 is the sweet spot, diminishing/negative after ~6, see Q2); tuning example order in a loaded file.

## Q2 -- code-specific evidence (examples vs rules for code)

- "Code Refactoring with LLM: few-shot evaluation" [CITED: arxiv.org/html/2511.21788v1]: few-shot substantially aids refactoring, sweet spot **2-6 shots**, diminishing/negative returns past 6, dynamically-typed langs gain most (Python 0-shot 78.7% -> 2-shot 99.3%). **Caveat that matters for us:** this measures transformation *correctness once a refactor is asked for*, NOT recognition of whether/where to refactor. Does not directly validate our recognition ceiling.
- "Beyond Strict Rules: LLMs for Code Smell Detection" [CITED: arxiv.org/html/2601.09873v1]: uses CoT over rule-derived criteria; **does not compare examples vs prose** -- so there is no clean head-to-head in the literature for code-smell recognition. Honest gap.

Net: the literature does NOT contain a study proving worked examples beat rules for *code-smell recognition specifically*. The transfer is theoretical (Min et al. input-distribution) plus adjacent (refactor-quality few-shot).

## Q3 -- practical design for the catalog (if we run the eval)

Maximize the one supported mechanism. Per target shape (group-by, Set-union/flatMap, classify-into-Set):

1. **Cover multiple surface disguises of the SAME target** (diversity of input distribution -- highest-value move):
   - group-by: `reduce` into Map, `reduce` into plain object, `for` + `map.set(k, [...(m.get(k)??[]), x])`.
   - Set-union -> flatMap: `for` + `set.add`, `reduce` into a Set.
   - classify -> map().filter(): `for`+`switch`, `for`+`if/else` pushing into a Set.
2. **Minimal contrast, low distracting detail** -- strip each example to just the loop + its accumulator; noise dilutes the cue.
3. **Name the trigger cue explicitly**, don't just show it -- e.g. "Cue: loop body does `map.set(key, ...)` / `set.add(...)` / a keyed bucket -> this is accumulation into a keyed collection = group-by / union / classify." Labeling the shape is what the contrastive evidence rewards.
4. **Clean before -> after pairing**, arrow-visible; keep 2-3 disguises per shape (total in the 2-6 shot window, not 15).
5. Don't invest in ordering; it's high-variance and static here.

## Confidence / honest flag

- Recognition lever: MEDIUM. Mechanism (input-distribution exposure) is exactly what examples provide and rules can't -- the strongest reason this differs from our nulled prose attempts.
- Risk of another null: REAL. Skill content is *loaded* but not adjacent to the target code at inference; if the miss is a salience/attention failure at reasoning time, more/better content won't fix it. Prior = 4 nulls on content edits.
- Decision rule: run ONE eval with the design above. If null, conclude ceiling is inference-time recognition, not content; stop content edits.

## Sources

- [CITED] Min et al., Rethinking the Role of Demonstrations -- ar5iv.labs.arxiv.org/html/2202.12837 (input-distribution matters, label-correctness doesn't)
- [CITED] Ground-Truth Labels Matter (EMNLP 2022 rebuttal) -- aclanthology.org/2022.emnlp-main.155.pdf (nuance: correctness can matter more than Min claims; supports not over-relying on the "labels don't matter" result)
- [CITED] Customizing LM Responses with Contrastive ICL -- arxiv.org/html/2401.17390v1 (contrastive pairs + explicit distinction analysis beat plain few-shot)
- [CITED] Code Refactoring with LLM: few-shot evaluation -- arxiv.org/html/2511.21788v1 (2-6 shot sweet spot, diminishing returns; measures correctness not recognition)
- [CITED] Beyond Strict Rules: LLMs for Code Smell Detection -- arxiv.org/html/2601.09873v1 (no examples-vs-rules comparison; gap noted)
