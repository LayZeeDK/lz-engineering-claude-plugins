# Plugin-wide references in a Claude Code plugin

**Status:** COMPLETE.
**Researched:** 2026-07-29
**Claude Code version under test:** 2.1.220
**Question:** How do you create a plugin-wide Markdown reference shared by several skills in the
same plugin, owned by none of them, and how does a SKILL.md link to it?

## Answer in one paragraph

A plugin-wide reference IS supported. Put the shared Markdown at the PLUGIN ROOT, e.g.
`plugins/lz-tdd/references/beck-tdd-by-example.md`, and have each `SKILL.md` point at it with the
absolute-path placeholder `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`. Claude Code
substitutes `${CLAUDE_PLUGIN_ROOT}` inside the SKILL.md BODY (not just in hooks/MCP JSON) at
prompt-build time, expanding it to the installed plugin's absolute directory with forward slashes.
The marketplace install copies the ENTIRE plugin directory, so a top-level `references/` dir ships
intact and is not touched by component auto-discovery. Do NOT use `../../` relative Markdown links:
they are unnecessary once you have the placeholder, no shipped plugin uses them, and the only anchor
Claude Code states for a skill is the skill's own directory. Progressive disclosure is preserved --
the substituted path is plain text in the prompt, so the model still has to `Read` the file on
demand.

## VERIFIED vs INFERRED

### VERIFIED (read out of the shipped Claude Code 2.1.220 binary, or observed on disk)

| # | Fact | How verified |
|---|------|--------------|
| V1 | `${CLAUDE_PLUGIN_ROOT}` IS substituted in the SKILL.md body text | Decompiled bundle, `getPromptForCommand` |
| V2 | `${CLAUDE_SKILL_DIR}` IS substituted in the SKILL.md body, skill-mode only, to the skill's OWN dir | Same |
| V3 | Every plugin-skill prompt is prefixed with `Base directory for this skill: <abs path>` | Same |
| V4 | `@path` in a SKILL.md body is NOT eagerly inlined by the skill loader | Same, by exhaustion of the transform chain |
| V5 | A marketplace install copies the WHOLE plugin dir, including non-standard top-level dirs | Installed plugin cache on disk |
| V6 | A shipped plugin already does exactly this: plugin-root `references/` + `${CLAUDE_PLUGIN_ROOT}` in SKILL.md | `lz-advisor` 2.0.0, installed |
| V7 | ZERO installed SKILL.md files use a `](../` relative Markdown link | `rg` over the whole plugin cache, positive-controlled |

### The transform chain, verbatim from the bundle

`getPromptForCommand` (the function that builds the text a skill contributes to the conversation):

```js
let V = s.isSkillMode
  ? `Base directory for this skill: ${L2.dirname(t.filePath)}\n\n${l}`   // l = SKILL.md body
  : l;
V = Ect(V, q, true, E, xee);                 // $ARGUMENTS / named args
V = rSe(V, { path: o, source: r });          // <-- placeholder substitution, see below
if (n.userConfig) V = Tuo(...);              // ${user_config.*}
if (s.isSkillMode) V = V.replace(/\$\{CLAUDE_SKILL_DIR\}/g, p);   // p = dirname(SKILL.md)
V = V.replace(/\$\{CLAUDE_SESSION_ID\}/g, ...);
V = V.replaceAll("${CLAUDE_EFFORT}", ...);
V = Oyo() ? Dyo(V)                            // strip !`...` when shell exec disabled by policy
          : await WBe(V, ..., `/${e}`, W);    // execute !`...` shell substitutions
return [{ type: "text", text: V }];
```

and the substitution helper:

```js
function rSe(e, t) {
  let r = (o) => o.replace(/\\/g, "/");
  let n = e.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => r(t.path));
  n = n.replace(/\$\{CLAUDE_PROJECT_DIR\}/g, () => r(Pl()));
  if (t.source) n = n.replace(/\$\{CLAUDE_PLUGIN_DATA\}/g, () => r(u8e(t.source)));
  return n;
}
```

Read off that chain:

- `${CLAUDE_PLUGIN_ROOT}` -> the installed plugin's root directory, absolute, backslashes rewritten
  to forward slashes. On this machine that is
  `C:/Users/<user>/.claude/plugins/cache/<marketplace>/<plugin>/<version>`.
- `${CLAUDE_SKILL_DIR}` -> `dirname(SKILL.md)`, i.e. the skill's OWN directory. Wrong tool for a
  shared reference; right tool for a skill's private `references/`.
- Nothing in the chain expands `@`. The only content-inlining step is `WBe`, and reading its body
  shows it handles ONLY `` !`shell command` `` substitution. So `@some/path.md` survives into the
  prompt as literal text.

### INFERRED (reasoned, not executed)

| # | Claim | Confidence | Why not verified |
|---|-------|-----------|------------------|
| I1 | Progressive disclosure holds: the model Reads the shared file only when it decides to | HIGH | Follows from V4 -- the path is inert text. Not observed in a live session. |
| I2 | A `](../../references/x.md)` link would be interpretable by the model but is fragile | MEDIUM | The only anchor the runtime states is the skill dir (V3), so `../../` is resolvable in principle. No shipped plugin does it (V7). |

## Q1. Where can a shared reference physically live?

**At the plugin root. VERIFIED.**

Auto-discovery looks only for the component surfaces it knows: `skills/`, `commands/`, `agents/`,
`hooks/hooks.json`, `.mcp.json`, `monitors/monitors.json`, plus whatever the manifest points at with
explicit path fields. Any other top-level directory is inert payload -- it is copied on install and
otherwise ignored.

Observed on disk in `~/.claude/plugins/cache`, installed plugins ship arbitrary top-level dirs with
no ill effect:

| Plugin | Non-component top-level dirs it ships |
|--------|----------------------------------------|
| `lz-advisor` 2.0.0 | `references/` |
| `mattpocock-skills` 1.2.0 | `docs/`, `scripts/`, `node_modules/` |
| `ponytail` 4.8.4 | `docs/`, `examples/`, `benchmarks/`, `tests/`, `scripts/`, `assets/`, `pi-extension/` |
| `nx` 0.2.34 | `artifacts/`, `assets/`, `generated/`, `tests/`, `node_modules/` |

So `plugins/lz-tdd/references/` is fine and needs no manifest entry.

The official plugins reference states the plugin-root discovery contract for skills ("`skills/` or
`commands/` directory in plugin root, or a single `SKILL.md` file at the plugin root") and says
"Skills can include supporting files alongside SKILL.md" -- it does not claim exclusivity over other
directories. [CITED: docs.claude.com/en/docs/claude-code/plugins-reference]

## Q2. How does a SKILL.md link to a file outside its own skill dir?

**Use `${CLAUDE_PLUGIN_ROOT}/references/<file>.md`. VERIFIED.**

The three path anchors available to a plugin skill, and what each resolves to:

| Placeholder | Resolves to | Use for |
|-------------|-------------|---------|
| `${CLAUDE_PLUGIN_ROOT}` | absolute path of the installed PLUGIN root, forward slashes | **plugin-wide shared references** |
| `${CLAUDE_SKILL_DIR}` | absolute path of `dirname(SKILL.md)` -- the skill's OWN dir | a skill's private `references/`, when an absolute path is wanted |
| implicit `Base directory for this skill: <abs path>` prefix | same as `${CLAUDE_SKILL_DIR}` | why bare `references/foo.md` already works in the three lz-tdd skills |

`${CLAUDE_PLUGIN_ROOT}` is the correct one here: the shared file is owned by the plugin, not by any
skill, so the anchor must be the plugin.

**Does it work in SKILL.md BODY text, or only in hooks/scripts?** Body text too. VERIFIED from the
binary (see the transform chain above): `rSe(V, {path: o, source: r})` is applied to `V`, and `V` is
the SKILL.md body. plugin-dev documents the same thing in prose:

> **In component files** (commands, agents, skills):
> `Reference scripts at: ${CLAUDE_PLUGIN_ROOT}/scripts/helper.py`

[CITED: plugin-dev 0.1.0, `skills/plugin-structure/SKILL.md`, "Path Resolution Rules"]

The official plugins reference documents `${CLAUDE_PLUGIN_ROOT}` only in hook / monitor / MCP
contexts and never mentions `${CLAUDE_SKILL_DIR}` at all -- so the docs UNDER-state what the runtime
does. The binary is the stronger source.

**Do relative Markdown links like `[x](../../references/foo.md)` resolve after a marketplace
install?** They are not needed and should not be used. The install is a whole-directory copy, so the
relative shape is preserved and a `../../` link is not structurally broken by installation. But:

- The only anchor Claude Code states in the prompt is the SKILL's directory, not the repo. There is
  no runtime resolution of Markdown links at all -- the model resolves them by reading the prompt.
- ZERO of the SKILL.md files across all 14 installed marketplaces on this machine use a `](../`
  link. (`rg` over the full plugin cache; positive-controlled -- the same scan finds 417 hits for
  `references/`.)
- This repo's own N2 link gate would flag nothing for a correct `../../../` link, but see the trap
  in Q6 about placing a placeholder inside Markdown link syntax.

Recommendation: `${CLAUDE_PLUGIN_ROOT}` in INLINE CODE, not `../../` and not a Markdown link.

## Q3. Is progressive disclosure preserved?

**Yes. VERIFIED at the mechanism level, INFERRED at the behavior level.**

Nothing in the skill prompt-building chain inlines file contents. The only content-substituting step
is `WBe`, and reading its body shows it handles only `` !`shell command` `` expansion. `@path` is
never expanded. So `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md` lands in the prompt as
a plain absolute path string, exactly like today's `references/beck-tdd-by-example.md` lands as a
plain relative one. The model reads it on demand or not at all -- identical economics to the
current in-skill references.

**Caveat on the `@` prefix.** `lz-advisor` writes some of its pointers as a bare line
`@${CLAUDE_PLUGIN_ROOT}/references/advisor-timing.md`. After substitution that becomes
`@C:/Users/.../references/advisor-timing.md` in the prompt. The skill loader does not expand it, but
`@` is the file-mention sigil elsewhere in Claude Code and its handling is not guaranteed to stay
inert. Since `@` buys nothing here, **omit it** -- write the bare path in backticks. That keeps
progressive disclosure unambiguous and matches how the three lz-tdd skills already cite references.

## Q4. Path-traversal / validation constraints -- THE SUSPECTED BLOCKER

**Not a blocker. VERIFIED by running the validator.**

Built a throwaway fixture with exactly the proposed shape plus the worst case on purpose:

```
pvtest/
  .claude-plugin/marketplace.json          source: "./plugins/testplug"
  plugins/testplug/.claude-plugin/plugin.json
  plugins/testplug/references/shared.md     <- plugin-wide reference
  plugins/testplug/skills/alpha/SKILL.md    <- body contains ALL THREE forms:
                                                 ${CLAUDE_PLUGIN_ROOT}/references/shared.md
                                                 [shared](../../references/shared.md)
                                                 ${CLAUDE_SKILL_DIR}/references/private.md
```

`claude plugin validate <fixture>` on Claude Code 2.1.220:

```
Validating marketplace manifest: ...\pvtest\.claude-plugin\marketplace.json

Found 2 warnings:
  - description: No marketplace description provided...
  - plugins[0] plugin.json -> author: No author information provided...

Validation passed with warnings
```

Both warnings are cosmetic metadata, unrelated to the layout. The plugin-root `references/` dir and
the `../../` link in the body both pass clean.

This matches the code: every path-traversal guard in the binary is scoped to a structured path
field, never to Markdown prose. The guards are on archive/extension unpacking, `symlinkDirectories`,
npm package names, LSP config paths (`Security: Path traversal attempt blocked in plugin` /
`Invalid path: must be relative and within plugin directory`), and marketplace `source`. There is no
Markdown link scanner in the validator at all.

Control: `claude plugin validate .` on this repo today also passes clean, so the fixture result is
not a false green from a broken invocation.

## Q5. What do real plugins do?

**One shipped plugin already implements exactly this, and it is structurally identical to lz-tdd.**

`lz-advisor` 2.0.0 -- your own marketplace, installed at
`~/.claude/plugins/cache/lz-advisor-claude-plugins/lz-advisor/2.0.0`:

```
plugins/lz-advisor/                    (marketplace source: "./plugins/lz-advisor")
|-- .claude-plugin/plugin.json
|-- agents/{advisor,reviewer,security-reviewer}.md
|-- references/                        <- PLUGIN-WIDE, owned by no skill
|   |-- advisor-timing.md
|   |-- context-packaging.md
|   |-- orient-exploration.md
|   '-- verify-target-selection.md
'-- skills/{lz-plan,lz-execute,lz-review,lz-security-review}/SKILL.md
```

All four skills cite the same four references via `${CLAUDE_PLUGIN_ROOT}/references/<file>.md`. Same
monorepo shape as lz-tdd (`plugins/<name>` + relative marketplace `source`), same multi-skill
sharing problem, shipped and installed. The install copy carries `references/` intact.

One caveat worth carrying over from that plugin: its `agents/*.md` do NOT get the same treatment.
`agents/reviewer.md` line 418 says outright:

> "this section is duplicated near-verbatim in the other reviewer agent ...; keep the two in sync.
> (The agents do NOT `@`-load shared references, so the content must live in each prompt.)"

So the mechanism verified here is a SKILL mechanism. Do not assume it extends to agent files.

No other installed plugin shares references across skills. `mattpocock-skills` has a top-level
`docs/`, but that is guidance about the USER's repo, not plugin-internal shared reference material.

## Q6. Migration shape for `beck-tdd-by-example.md`

### Current state

| Fact | Value |
|------|-------|
| Path | `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` |
| Inbound links, whole `plugins/` tree | exactly ONE |
| That link | `plugins/lz-tdd/skills/lz-refactor/references/principles.md:27` -> `[Test-Driven Development by Example](beck-tdd-by-example.md)` |
| Linked from `lz-refactor/SKILL.md`? | NO |

Verified with `git grep -n beck-tdd-by-example -- plugins/`.

That single sibling-relative link is the whole migration cost, and it is the thing that collides
with the "do not modify the shipped skills" constraint. See Q7.

### End state

```
plugins/lz-tdd/
|-- references/
|   '-- beck-tdd-by-example.md                     <- MOVED here (git mv)
'-- skills/
    |-- lz-red/SKILL.md                            <- ADD a pointer
    |-- lz-refactor/
    |   |-- SKILL.md                               <- UNCHANGED
    |   '-- references/principles.md:27            <- one link retargeted
    '-- lz-tpp/                                    <- UNCHANGED
```

**`lz-refactor/references/principles.md` line 27** becomes:

```markdown
see the Beck backing: [Test-Driven Development by Example](../../../references/beck-tdd-by-example.md).
```

Three `..` because the file sits at `plugins/lz-tdd/skills/lz-refactor/references/`: up to
`lz-refactor`, up to `skills`, up to `lz-tdd`.

**`lz-red/SKILL.md`** gains a pointer in its reference-routing list, written as inline code:

```markdown
- Beck's own account of the red-green-refactor cycle:
  `${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md`
```

### TRAP: do not write the placeholder inside Markdown link syntax

This repo's own `check-red-references.mjs` N2 gate ("[lc9] every relative markdown link resolves")
walks every Markdown file under `plugins/`, extracts `[...](...)` targets, and classifies them with:

```js
const linkKind = (raw) => {
  if (raw.startsWith("#")) return "anchor";
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return "scheme";
  if (raw.startsWith("/")) return "absolute";
  return "relative";
};
```

`${CLAUDE_PLUGIN_ROOT}/references/beck-tdd-by-example.md` starts with `$`, so it falls through to
`relative` and the gate `existsSync`-checks it against the file's own directory -- and fails.

So: `` `${CLAUDE_PLUGIN_ROOT}/references/foo.md` `` (inline code, not a link). The gate only reads
`[...](...)` outside fenced blocks, so backticked inline code is untouched. This also happens to be
the safer prompt shape (Q3).

### What breaks for an already-installed user

Nothing, provided the move and the link retarget ship in the SAME release.

- Installs are keyed by resolved version: `cache/<marketplace>/<plugin>/<version>/`. Multiple
  versions coexist on disk (`plugin-dev` alone has five). An update materializes a NEW directory
  containing the complete new tree; there is no incremental file sync, so there is no window where
  a new SKILL.md sees an old references layout.
- A user who never updates keeps 0.0.2 with the old layout, fully working.
- The old version directory lingers "for about two weeks after an update before cleanup"
  [CITED: plugins-reference]. Mid-session updates keep hooks/MCP/monitors bound to the old path.
  A skill prompt already materialized in a live conversation holds a substituted absolute path into
  the old dir -- still readable during that window, then gone. Same exposure as any plugin update;
  no additional risk from this change.
- The only real failure mode is intra-release inconsistency: a doc still pointing at the old path.
  The N2 gate catches that on the shipped tree, which is why it must be run after the move.

## Q7. BLOCKERS

### B1 -- the move requires editing a shipped skill's reference file

`plugins/lz-tdd/skills/lz-refactor/references/principles.md` line 27 is the only inbound link to
`beck-tdd-by-example.md`. Moving the file dangles it, and this repo's N2 gate will fail the build.
The stated constraint is that lz-refactor is shipped and must not be modified this milestone.

There is no version of "relocate the file" that leaves `principles.md` untouched. The options, worst
to best:

| Option | Cost |
|--------|------|
| Leave the file where it is; lz-red points at `${CLAUDE_PLUGIN_ROOT}/skills/lz-refactor/references/beck-tdd-by-example.md` | Zero edits to lz-refactor. But it cements lz-refactor as the owner of material two skills use, which is the thing being fixed. Cross-skill reach-in is worse coupling than a shared dir. |
| Move the file; retarget the ONE link in `principles.md` | ONE line changed in a shipped skill's reference. No SKILL.md changed, no behavior changed, no prose changed. |
| Move the file; leave a stub at the old path that points at the new one | Two files to keep honest, and it recreates a near-duplicate -- the exact failure the no-copy gate exists to prevent. |

Recommendation: take the middle option and get the constraint relaxed for this one line. It is a
path retarget inside a reference doc, not a change to lz-refactor's shipped behavior, and it is
mechanically verified by the N2 gate. If the constraint is truly absolute, the top option is the
only remaining one and its cost should be recorded as accepted coupling.

### B2 -- the test-double taxonomy cannot be relocated into the plugin at all right now

`check-red-references.mjs` N3 ("[lc9] no test-double taxonomy copy in the shipped tree") fails on
ANY file named `test-double-taxonomy.md` anywhere under `plugins/`:

```js
const TAXONOMY_COPY_FILENAME = "test-double-taxonomy.md";
for (const file of pluginsMarkdown) {
  if (path.basename(file) === TAXONOMY_COPY_FILENAME) taxonomyCopyHits.push(...);
}
```

The gate is filename-scoped over the whole shipped tree, with no carve-out for a single canonical
location. So `plugins/lz-tdd/references/test-double-taxonomy.md` fails, and so does
`skills/lz-red/references/test-double-taxonomy.md`.

Also note the gate's own stated intent -- "this material is used by **lz-red only** and must never
ship again as byte-identical per-skill copies". If the taxonomy really is lz-red-only, it is not a
plugin-wide reference and should not be relocated to the plugin root; it belongs to lz-red or stays
out of the shipped tree entirely. Decide the ownership question first; only if the answer turns out
to be "shared" does the gate need narrowing (from "no file with this basename" to "at most one, at
the canonical path").

## Fallback if the mechanism had not existed

Not needed -- it exists and is shipped. Recorded for completeness: the least-bad alternative would
have been cross-skill reach-in via `${CLAUDE_PLUGIN_ROOT}/skills/<owner-skill>/references/<file>.md`
(option 1 in B1). Tradeoff: zero edits to the shipped skill, at the price of a permanent ownership
lie -- the file lives under a skill that is not its only consumer, and any future change to that
skill's reference layout silently breaks a sibling.

## Recommended end-state convention for lz-tdd

```
plugins/lz-tdd/
|-- .claude-plugin/plugin.json
|-- references/                    # plugin-wide, owned by no skill, cited as
|                                  #   `${CLAUDE_PLUGIN_ROOT}/references/<file>.md`
'-- skills/<skill>/
    |-- SKILL.md
    '-- references/                # skill-private, cited as today: [references/x.md](references/x.md)
```

Rules:

1. Shared material goes to `plugins/lz-tdd/references/`. Nothing else moves.
2. Cite a plugin-wide reference as INLINE CODE: `` `${CLAUDE_PLUGIN_ROOT}/references/foo.md` ``.
   Never as a `[...](...)` link (N2 gate), never with a leading `@` (Q3 caveat), never with `../`.
3. Skill-private references keep the existing `[references/foo.md](references/foo.md)` house style.
   The runtime supplies `Base directory for this skill:` so relative-to-skill resolves.
4. No manifest change. `references/` needs no entry in `plugin.json`.
5. Run `claude plugin validate .` and the repo's `check-red-references.mjs` after the move.

## The one experiment that would settle the last doubt

Everything above is verified from the shipped binary, from disk, or from the validator. The single
thing NOT observed live is a skill actually resolving and reading a plugin-root reference in a real
session. To settle it:

1. `claude plugin marketplace add <path-to-repo>` and `claude plugin install lz-tdd@...`
2. Start a session, invoke `/lz-tdd:lz-red`, and ask it to read the plugin-wide reference.
3. Confirm the path it Reads is `<cache>/<version>/references/beck-tdd-by-example.md` and that it
   did NOT read it until asked.

Cost: one short interactive session. Given `lz-advisor` already ships this pattern in production,
this is confirmation, not discovery.

## Sources

### Primary (HIGH)

- Claude Code 2.1.220 shipped bundle, `~/.local/bin/node_modules/@anthropic-ai/claude-code/bin/claude.exe`
  -- `getPromptForCommand`, `rSe`, `WBe`, `Dyo`/`Oyo`, plugin skill loader. Byte-sliced directly.
- `claude plugin validate` run against a purpose-built fixture and against this repo.
- Installed plugin cache `~/.claude/plugins/cache`, 14 marketplaces -- layout observation and
  `rg` sweeps (positive-controlled).
- `lz-advisor` 2.0.0 source (`D:/projects/github/LayZeeDK/lz-advisor-claude-plugins`) and installed copy.
- This repo: `git grep` over `plugins/`, and `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`
  N2/N3 gates plus `lib/pipe-table.mjs` `linkKind`.

### Secondary (MEDIUM)

- docs.claude.com/en/docs/claude-code/plugins-reference, fetched via markdown.new
  -- `${CLAUDE_PLUGIN_ROOT}` definition, version-directory lifetime, skills discovery contract.
  Does not document placeholders in skill body text; does not mention `${CLAUDE_SKILL_DIR}`.
- plugin-dev 0.1.0, `skills/plugin-structure/SKILL.md` "Path Resolution Rules"
  -- states `${CLAUDE_PLUGIN_ROOT}` is for use "in component files (commands, agents, skills)".
  Lowest authority per this repo's precedence order, cited only as corroboration.

