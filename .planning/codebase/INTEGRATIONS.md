# External Integrations

**Analysis Date:** 2026-07-17

> This repository is a Claude Code plugin marketplace that ships static, knowledge-only
> Markdown. The shipped plugin makes NO network calls, stores NO data, and integrates with
> NO external runtime services. The integrations below are almost entirely about
> DISTRIBUTION and the local AUTHORING/EVAL toolchain, not about a running application.

## APIs & External Services

**Distribution platform:**
- GitHub (`github.com/LayZeeDK/lz-engineering-claude-plugins`) - Hosts the public marketplace. Declared in `plugins/lz-tdd/.claude-plugin/plugin.json` (`homepage`, `repository`). Users add the marketplace by repo slug; no API key required.

**Claude Code plugin runtime:**
- Claude Code plugin/skill system - Consumes `.claude-plugin/marketplace.json` and `plugins/lz-tdd/.claude-plugin/plugin.json`, then loads and auto-triggers the skills. This is the delivery channel, not a called API.

**Evaluation-time (local, NON-shipped harness):**
- Claude Code headless (`claude -p`) - The `.claude/skills/lz-refactor-workspace/` eval harness spawns `claude -p` subprocesses to run trigger and applied-output evals, then grades transcripts (`grade-run.mjs`, `grade-reference.mjs`, `merge-judge.mjs`). Runs only during skill authoring/measurement; never part of the distributed plugin.

## Data Storage

**Databases:**
- None. No database, ORM, or client anywhere in the repo.

**File Storage:**
- Local filesystem only. All content is Markdown/JSON in the repo. Eval run byproducts are written to gitignored `results*/`, `run-*/`, and `outputs/` trees under `.claude/skills/lz-refactor-workspace/`.

**Caching:**
- None (no runtime service to cache).

## Authentication & Identity

**Auth Provider:**
- None. The plugin has no accounts, sessions, or auth surface.

**Maintainer identity (public-repo hygiene, enforced convention):**
- Commits by the maintainer must use `larsbrinknielsen@gmail.com` as author AND committer. The maintainer's employer email/domain must never appear in committed files, commit messages, or identity. See `AGENTS.md` (allowlist-inversion detection). This is a process control, not a technical integration.

## Monitoring & Observability

**Error Tracking:**
- None. No runtime to observe.

**Logs:**
- Local only: eval harness writes `*.log`, `*.stream.jsonl`, and `run_loop_stdout.json` under the workspace; all gitignored.

## CI/CD & Deployment

**Hosting:**
- GitHub repository serves as both source and distribution. "Deployment" = pushing to `main` (or tagging a release, e.g. tag `lz-tdd@0.0.2`); the marketplace resolves versions from `plugin.json`.

**CI Pipeline:**
- None. No `.github/workflows/`. Structural validation (`claude plugin validate .`), the checker battery (`npm run check`), and the compile harness (`npm run typecheck`) are run locally by the maintainer.

## Authoring & Verification Toolchain (local integrations)

- `skill-creator` plugin - Draft/iterate skills, run trigger + output evals, optimize `description` triggering.
- `plugin-dev` plugin (v0.1.0) - Scaffolds structure; bundles the `plugin-validator` and `skill-reviewer` agents.
- `claude plugin validate .` - First-party structural validator (marketplace schema, plugin manifests, skill frontmatter, path-traversal).
- Repo-local checker battery - `.claude/skills/lz-refactor-workspace/tools/*.mjs` (catalog/consistency gates) + `extract-samples.mjs` (`tsc --strict` on catalog code fences).
- Clean-room `.oracle/` subagents - `.claude/agents/oracle.md` and `.claude/agents/oracle-reviewer.md` read gitignored copyrighted source excerpts (`.oracle/`, copied into worktrees via `.worktreeinclude`) to gate authored catalog leaves. Read-only; excerpts never enter the shipped repo.

## Environment Configuration

**Required env vars:**
- None for the shipped plugin. The eval harness relies only on `claude` being on PATH and Node.js v24.

**Secrets location:**
- No secrets. No `.env`, credential files, or API keys in the repo.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2026-07-17*
