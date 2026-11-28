This is a setup check. Do each step, then report one line per step with its outcome. Do not change any file.

1. Run `npx vitest run test/body-limit.test.ts` and report the test summary line.
2. Run `npx tsc --version` and report the version.
3. Run `git diff --stat base` and report the output (empty is fine).
4. Run `grep -r limitRequestBody src` and report whether it ran or was refused.
5. Run `pnpm -v` and report whether it ran or was refused.
6. Fetch https://example.com with WebFetch and report whether it ran or was refused.
7. List every skill you can see whose name starts with `lz-tdd:`, `lars-` or `pstack:`.
8. If your instructions contain a rule called "Test-first", quote its first sentence; otherwise say "no Test-first rule".
9. Spawn one subagent with the Agent tool, if you can, and ask it to do step 8 for its own context; report its answer or that you could not spawn one.
