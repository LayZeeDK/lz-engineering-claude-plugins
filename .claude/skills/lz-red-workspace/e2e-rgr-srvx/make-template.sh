#!/usr/bin/env bash
# Usage: make-template.sh <task id> <commit>
# Builds $SLIM_ROOT/rgr-eval/<task>/template from the commit's PARENT (feature absent), source only, and saves the
# commit's own test files as the hidden suite and its source files as the reference solution. The srvx clone comes
# from SRVX_REPO (default D:/projects/github/h3js/srvx).
set -u
. "$(dirname "$0")/../slim-arms.sh"
task=$1 commit=$2
repo=${SRVX_REPO:-D:/projects/github/h3js/srvx}
root=$slim_root/rgr-eval/$task
rm -rf "$root"
mkdir -p "$root/template" "$root/hidden" "$root/after-src"

git -C "$repo" archive "$commit^" | tar -x -C "$root/template"
git -C "$repo" diff --name-only "$commit^" "$commit" > "$root/changed-files.txt"

while read -r f; do
  case "$f" in
    test/*) mkdir -p "$root/hidden/$(dirname "$f")"; git -C "$repo" show "$commit:$f" > "$root/hidden/$f" ;;
    src/*) mkdir -p "$root/after-src/$(dirname "$f")"; git -C "$repo" show "$commit:$f" > "$root/after-src/$f" ;;
  esac
done < "$root/changed-files.txt"

# Source only: a copied pnpm node_modules loses its symlinks, so each copy installs from the store itself.
echo "[OK] template + hidden suite at $root"
