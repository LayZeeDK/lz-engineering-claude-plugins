// The per-link core of the relative-link gate in check-red-references.mjs. Exported for the self-test in
// package-links.selftest.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// lib -> tools -> lz-red-workspace -> skills -> .claude -> repo root
const repoRoot = path.resolve(here, "..", "..", "..", "..", "..");

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
  if (target.kind !== "relative") {
    return [];
  }

  const [filePart] = target.raw.split("#");

  if (filePart === "") {
    return [];
  }

  const problems = [];
  const resolved = path.resolve(repoRoot, path.dirname(sourceRel), filePart);

  if (!fs.existsSync(resolved)) {
    problems.push(DEAD);
  }

  const pluginRoot = path.join(repoRoot, ...sourceRel.split("/").slice(0, 2));
  const insidePackage = path.relative(pluginRoot, resolved);

  if (insidePackage === ".." || insidePackage.startsWith(`..${path.sep}`) || path.isAbsolute(insidePackage)) {
    problems.push(LEAVES_PACKAGE);
  }

  return problems;
}
