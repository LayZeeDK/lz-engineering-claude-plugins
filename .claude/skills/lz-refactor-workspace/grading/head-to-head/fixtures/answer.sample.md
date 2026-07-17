# Synthetic review answer (fixture -- not a real run)

This file exists only to pin the tabulator's LIFT count in `--selfcheck`. It names exactly two
canonical Fowler refactorings so the distinct-name matcher must return a count of 2. Do not add or
remove named refactorings here without updating the assertions in tabulate-mechanical.mjs.

The long body mixes several responsibilities. The first move is Extract Function: pull the
validation span and the totals span into their own named helpers so each reads at one level of
intent.

The helper then takes a street, a city, and a zip that always travel together. That clump is a
Introduce Parameter Object candidate: bundle the three parameters into one address value and pass
that instead.

That is the whole recommendation. Nothing here should be edited; this is report-only prose.
