// Single source of truth for GitHub-flavored heading -> anchor slugs across the checker
// battery. Matches github-slugger's rule: lowercase, drop the characters GitHub drops
// (anything outside word chars / whitespace / hyphen), then collapse whitespace runs to a
// single hyphen. Shared by check-kerievsky (which BUILDS the required cross-link anchors)
// and check-crossrefs (which VALIDATES anchors against a file's headings) so the anchor a
// checker DEMANDS can never diverge from the anchor a checker VALIDATES -- or from the
// anchor github.com actually generates.
//
// NOTE: this is the ANCHOR rule, deliberately distinct from the FILENAME rule (slugFor:
// `replace(/[^a-z0-9]+/g, "-")`). The two agree for names that are alphanumeric + single
// spaces, and legitimately differ only on droppable punctuation -- e.g. the Kerievsky name
// "Replace One/Many Distinctions with Composite" is the file `replace-one-many-...` (slugFor
// collapses the "/" run to a hyphen) but the GitHub anchor `replace-onemany-...` (githubSlug
// drops the "/"). Filenames keep slugFor; anchors use githubSlug.
export const githubSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
