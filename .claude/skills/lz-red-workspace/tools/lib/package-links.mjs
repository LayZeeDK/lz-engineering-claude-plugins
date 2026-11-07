// The relative-link gate's package model, used by check-red-references.mjs. Exported for the self-test in
// package-links.selftest.mjs.
//
// A packaged plugin is the git-tracked files of plugins/<plugin>/ copied to a root that is NOT named
// after the plugin. trackedFiles reads that set from git; packageLinkProblems is pure: a target is
// resolved segment by segment against the set, never on the disk. The disk would accept untracked,
// git-ignored and junction-reached files, and on Windows it ignores letter case. The boundary test walks
// the target's own segments before any lookup, so a `..` that climbs above the plugin root fails even
// when it comes back in through the plugin's folder name. The lookup walk then requires every segment
// before the last, and a trailing-slash target, to be a tracked directory, as a POSIX install would.
import { execFileSync } from "node:child_process";
import path from "node:path";

const DEAD = "dead (target is not in the package)";
const LEAVES_PACKAGE = "LEAVES PACKAGE";
const BACKSLASH = "uses backslash separators (no such path on a POSIX install)";

/**
 * Repo-relative posix paths of the git-tracked files under plugins/. Reads the index, so a staged file
 * counts. Throws when git fails; the caller fails closed.
 *
 * @param {string} repoRoot
 * @returns {Set<string>}
 */
export function trackedFiles(repoRoot) {
  // -z keeps non-ASCII names unquoted.
  const listed = execFileSync("git", ["ls-files", "-z", "--", "plugins"], { cwd: repoRoot, encoding: "utf8" });

  return new Set(listed.split("\0").filter((entry) => entry !== ""));
}

/**
 * Problems with one link target, judged against the plugin package its source file lives in. The target
 * is walked segment by segment against the tracked set rather than normalised lexically.
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

  // Backslashes count as separators here so that a `..\` escape is still caught as one.
  const sourceDir = path.posix.dirname(sourceRel);
  let depth = sourceDir.split("/").length - 2;

  for (const segment of filePart.replaceAll("\\", "/").split("/")) {
    if (segment === "..") {
      depth--;
    } else if (segment !== "" && segment !== ".") {
      depth++;
    }

    if (depth < 0) {
      return [LEAVES_PACKAGE];
    }
  }

  if (filePart.includes("\\")) {
    return [BACKSLASH];
  }

  // A directory is tracked when it holds at least one tracked file.
  const isTrackedDir = (dir) => [...tracked].some((file) => file.startsWith(`${dir}/`));
  const segments = filePart.split("/").filter((segment) => segment !== "");
  const resolved = sourceDir.split("/");

  for (const [index, segment] of segments.entries()) {
    if (segment === ".") {
      continue;
    }

    if (segment === "..") {
      resolved.pop();
      continue;
    }

    resolved.push(segment);

    // POSIX resolves every segment before the last against a real directory, so a file or a missing
    // directory there breaks the path even when a later `..` would cancel it lexically.
    if (index < segments.length - 1 && !isTrackedDir(resolved.join("/"))) {
      return [DEAD];
    }
  }

  const resolvedPath = resolved.join("/");
  const last = segments.at(-1);

  // Every directory on the way was proven tracked, and so was the source file's own directory.
  if (last === "." || last === "..") {
    return [];
  }

  if (filePart.endsWith("/")) {
    return isTrackedDir(resolvedPath) ? [] : [DEAD];
  }

  return tracked.has(resolvedPath) || isTrackedDir(resolvedPath) ? [] : [DEAD];
}
