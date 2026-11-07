#!/usr/bin/env bash
# Usage: control.sh <task id>
# Copies the template, runs the hidden test files on the parent's source (expect failures), then swaps in the
# commit's source and runs them again (expect all green). Prints both summaries.
set -u
. "$(dirname "$0")/../slim-arms.sh"
task=$1
root=$slim_root/rgr-eval/$task
work=$root/control
rm -rf "$work"
mkdir -p "$work"
(cd "$root/template" && tar -cf - --exclude=node_modules .) | (cd "$work" && tar -xf -)
(cd "$work" && pnpm install --frozen-lockfile --prefer-offline --silent) || { echo "[ERROR] install failed"; exit 1; }
files=$(cd "$root/hidden" && find test -type f -name '*.test.ts' | sed 's/\.test\.ts$/.hidden.test.ts/')

(cd "$root/hidden" && find test -type f) | while read -r f; do
  case "$f" in
    *.test.ts) cp "$root/hidden/$f" "$work/${f%.test.ts}.hidden.test.ts" ;;
    *) cp "$root/hidden/$f" "$work/$f" ;;
  esac
done

echo "== before (parent source)"
(cd "$work" && NO_COLOR=1 npx vitest run $files 2>&1 | rg '^\s*(Test Files|Tests)\s')
cp -r "$root/after-src/." "$work/"
echo "== after (commit source)"
(cd "$work" && NO_COLOR=1 npx vitest run $files 2>&1 | rg '^\s*(Test Files|Tests)\s')
