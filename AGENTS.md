# AGENTS.md

Agent-agnostic behavioral rules for this repository. `CLAUDE.md` imports this file.

## Public-repo hygiene (maintainer identity / PII)

This is a PUBLIC repository. The rules below constrain the MAINTAINER's identity and authored
content ONLY. They do NOT restrict outside contributors, who commit under their own name and
email address.

### Maintainer identity

When committing as the maintainer (Lars Gyrup Brink Nielsen), the author AND committer email
must be the public contact `larsbrinknielsen@gmail.com`
(`git config user.email larsbrinknielsen@gmail.com`).

The maintainer's employer email address, and that address's bare email domain, must never appear:

- in any committed file authored for this project,
- in any commit message,
- in the author or committer identity of any commit made by the maintainer.

This holds in plain, split, or otherwise obfuscated form. Do not write the forbidden value even
as a search needle -- the needle is itself a leak.

### Detection: allowlist-inversion

Detect by ALLOWLIST-INVERSION, never by encoding the forbidden value. For the project's own
contact metadata (manifests, docs), assert that the only email-shaped token present is the
approved gmail and flag anything else. Never hardcode the forbidden address or domain in order
to detect it.

Detecting a bare domain that has no `@local-part` is out of scope by design: ordinary URLs make
a domain allowlist impractical. Reference such a domain only in escaped form -- a backslash
before the dot -- in private, uncommitted notes.

### Contributors

Outside contributors are NOT bound by the maintainer identity rule and must never be blocked by
a hygiene check. Their commit author and committer emails are their own. Any identity check must
be maintainer-scoped (gate on the maintainer's name), not a blanket allowlist over every commit.

### Before committing

Re-run the allowlist scan before committing meta-docs, audit reports, or agent-generated content.
"Absent earlier" goes stale the moment a later doc quotes the rule.
