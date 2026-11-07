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
//
// packageLinkGate takes its source files from the same tracked set, so a tracked symlink is checked and
// an untracked or git-ignored file is not: exactly the files that ship. A tracked entry under plugins/
// that is not a regular file is also a hit of its own (trackedNonFiles): the disk walk the other gates use
// skips symlinked files, and it reads a submodule's checked-out files, which do not ship.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { findLinkTargets, findUnsupportedLinkForms } from "./pipe-table.mjs";

const DEAD = "dead (target is not in the package)";
const LEAVES_PACKAGE = "LEAVES PACKAGE";
const BACKSLASH = "uses backslash separators (no such path on a POSIX install)";
const NOT_IN_A_PLUGIN = "NOT IN A PLUGIN (a file directly under plugins/ ships in no package)";
const MARKDOWN_RE = /\.(md|markdown)$/i;

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
 * The entries in raw `git ls-files -s -z` output that are not regular files (any mode other than 100644 and
 * 100755, such as a 120000 symlink or a 160000 gitlink), in listing order. Each record is
 * `<mode> <object> <stage>TAB<path>`. Throws on a non-empty record of any other shape or with an empty path.
 *
 * @param {string} listing
 * @returns {{ mode: string, path: string }[]}
 */
export function nonFileEntries(listing) {
  const entries = [];

  for (const record of listing.split("\0").filter((entry) => entry !== "")) {
    const tab = record.indexOf("\t");
    const head = tab === -1 ? null : /^([0-7]{6}) [0-9a-f]+ [0-9]$/.exec(record.slice(0, tab));
    const entryPath = record.slice(tab + 1);

    if (head === null || entryPath === "") {
      throw new Error(`malformed git ls-files -s record: ${record}`);
    }

    if (head[1] !== "100644" && head[1] !== "100755") {
      entries.push({ mode: head[1], path: entryPath });
    }
  }

  return entries;
}

/**
 * The git-tracked entries under plugins/ that are not regular files. Reads the index, so a staged entry
 * counts. Throws when git fails; the caller fails closed.
 *
 * @param {string} repoRoot
 * @returns {{ mode: string, path: string }[]}
 */
export function trackedNonFiles(repoRoot) {
  const listed = execFileSync("git", ["ls-files", "-s", "-z", "--", "plugins"], { cwd: repoRoot, encoding: "utf8" });

  return nonFileEntries(listed);
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

  if (filePart.endsWith("/")) {
    return isTrackedDir(resolvedPath) ? [] : [DEAD];
  }

  return tracked.has(resolvedPath) || isTrackedDir(resolvedPath) ? [] : [DEAD];
}

/**
 * The whole package-link gate over the tracked `.md` files: every dead or escaping link, every link form
 * the extractor cannot read, and every unreadable file is a hit.
 *
 * @param {Set<string>} tracked repo-relative posix paths of the git-tracked plugin files
 * @param {(rel: string) => string} readText reads one tracked file by its repo-relative path
 * @returns {{ hits: string[], resolved: number }} `resolved` counts the targets the core acted on, not
 *   anchors or scheme URLs, so a caller can fail a gate that resolved nothing
 */
export function packageLinkGate(tracked, readText) {
  const hits = [];
  let resolved = 0;

  for (const rel of [...tracked].filter((file) => MARKDOWN_RE.test(file)).sort()) {
    // The package boundary is plugins/<plugin>/, so a file above it has no package to resolve against.
    if (rel.split("/").length < 3) {
      hits.push(`${rel}: ${NOT_IN_A_PLUGIN}`);
      continue;
    }

    let text;

    try {
      text = readText(rel);
    } catch (err) {
      hits.push(`${rel}: UNREADABLE (${err.code ?? err.message})`);
      continue;
    }

    for (const { line, form } of findUnsupportedLinkForms(text)) {
      hits.push(`${rel}:${line} -> unsupported link form (${form}), not checked`);
    }

    for (const target of findLinkTargets(text)) {
      if (target.kind !== "anchor" && target.kind !== "scheme") {
        resolved++;
      }

      for (const problem of packageLinkProblems(target, rel, tracked)) {
        hits.push(`${rel}:${target.line} -> ${target.raw} ${problem}`);
      }
    }
  }

  return { hits, resolved };
}
