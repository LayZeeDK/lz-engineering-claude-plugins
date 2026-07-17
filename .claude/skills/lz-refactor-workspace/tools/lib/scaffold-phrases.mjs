// Single source of truth for the draft-scaffolding phrases that must never leak into a shipped leaf
// or a populated reference. Shared by check-backing / check-catalog / check-extra-patterns /
// check-functional / check-gof / check-kerievsky so the phrase set can never drift across the
// battery -- the same anti-divergence move as lib/heading-scan.mjs (IN-02 / D-10).
// Uppercase TODO only (so a `todos` domain example never false-fails); the rest are unambiguous
// draft markers. `## Sources (placeholder)`-style stubs trip `/\bplaceholder\b/i`. Node builtins
// only; no deps.
export const SCAFFOLD_RES = [/\bTODO\b/, /once it exists/i, /to be authored/i, /\bplaceholder\b/i, /\bTBD\b/];
