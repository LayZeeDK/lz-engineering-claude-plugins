// Single source of truth for level-2 section-body extraction across the catalog checkers.
// Body text of a `## <heading>` section: everything after the heading line up to the next `## `
// (level-2) heading or EOF, or null when the heading is absent. `### ` (level-3) sub-headings
// stay INSIDE the body (## does not match ###). Shared by check-gof / check-catalog /
// check-extra-patterns / check-functional so the four cannot diverge (WR-02). The heading is
// regex-escaped so a metacharacter in a heading can never corrupt the match; every caller passes
// a plain heading ("Example", "Consequences", "When each fits") for which the escaped and
// unescaped forms are byte-identical, so importing this is behavior-preserving. Node builtins only.
// In check-rgr-routing.mjs a `null` return is a FAILURE with an attributable label, never a skip
// -- there the heading is a parse INPUT, so renaming it must redden the gate rather than quietly
// drop a surface from the scan (D-17; the four catalog checkers keep their own null semantics).
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const sectionBody = (text, heading) => {
  const re = new RegExp(`^##\\s+${escapeRe(heading)}\\s*$`, "m");
  const parts = text.split(re);

  if (parts.length < 2) {
    return null;
  }

  return parts[1].split(/^##\s+/m)[0];
};
