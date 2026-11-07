// The per-link core of the relative-link gate in check-red-references.mjs. Exported for the self-test in
// package-links.selftest.mjs.
//
// Pure and lexical: a packaged plugin is the git-tracked files of plugins/<plugin>/, so a target is
// resolved as a path string and looked up in that tracked set, never on the disk. The disk would accept
// untracked, git-ignored and junction-reached files, and on Windows it ignores letter case. The boundary
// test runs before the lookup, so an escaping target is rejected without any further work.
import path from "node:path";

const DEAD = "dead (target is not in the package)";
const LEAVES_PACKAGE = "LEAVES PACKAGE";

/**
 * Problems with one link target, judged against the plugin package its source file lives in.
 *
 * @param {{ raw: string, kind: string }} target one entry from findLinkTargets
 * @param {string} sourceRel repo-relative posix path of the file carrying the link
 * @param {Set<string>} tracked repo-relative posix paths of the git-tracked plugin files
 * @returns {string[]} empty when the link is fine
 */
export function packageLinkProblems(target, sourceRel, tracked) {
  if (target.kind === "anchor" || target.kind === "scheme") {
    return [];
  }

  // A package copied to its own root cannot contain a rooted path.
  if (target.kind === "absolute") {
    return [LEAVES_PACKAGE];
  }

  const [filePart] = target.raw.split("#");

  if (filePart === "") {
    return [];
  }

  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), filePart.replaceAll("\\", "/")));
  const pluginRoot = sourceRel.split("/").slice(0, 2).join("/");

  if (resolved !== pluginRoot && !resolved.startsWith(`${pluginRoot}/`)) {
    return [LEAVES_PACKAGE];
  }

  // Set.has is case-sensitive, so a link differing from a tracked path only in letter case is dead.
  return tracked.has(resolved) ? [] : [DEAD];
}
