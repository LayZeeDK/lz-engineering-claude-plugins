// Single source of truth for fence-aware level-1 heading detection across the checker battery.
// Returns the level-1 ATX heading lines (`# Heading`) that sit OUTSIDE fenced code blocks. Shared
// by check-gof / check-kerievsky / check-extra-patterns / check-functional (each of which collects a
// leaf's single H1 to establish its identity) so the fence-tracking rule can never diverge across
// the four checkers -- a per-checker patch would re-introduce exactly the divergence the 08.2 fixer
// declined (IN-02 / D-10). Drop-in for the former fence-blind `lines.filter((l) => /^#\s+\S/.test(l))`.
//
// Fence tracking (CommonMark-ish): a fence opens on a line starting with >=3 backticks or >=3 tildes;
// it closes on a later line with the SAME fence char, a run at least the opening length, and an empty
// info string. Inside a fence, a column-0 `#` (a bash/yaml/toml comment) is NOT mistaken for a
// heading. Node builtins only; no deps.
export const collectH1Lines = (text) => {
  const out = [];
  let fence = null; // { char, len } while inside a fenced block

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^(`{3,}|~{3,})(.*)$/);

    if (m) {
      const char = m[1][0];
      const len = m[1].length;

      if (fence === null) {
        fence = { char, len };
      } else if (char === fence.char && len >= fence.len && m[2].trim() === "") {
        fence = null;
      }

      continue;
    }

    if (fence === null && /^#\s+\S/.test(line)) {
      out.push(line);
    }
  }

  return out;
};
