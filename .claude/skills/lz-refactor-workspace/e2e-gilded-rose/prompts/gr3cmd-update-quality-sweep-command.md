`updateQuality` in `app/gilded-rose.ts` is hard to maintain end to end. The tests are green -- please
sweep the whole method now: work through every smell you find (guard clauses, per-branch updaters,
naming the magic numbers) in small behavior-preserving steps, running the tests after each, until it
is clean.
