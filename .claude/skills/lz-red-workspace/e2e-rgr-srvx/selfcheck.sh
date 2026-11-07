#!/usr/bin/env bash
# Grader controls per task: the parent untouched (expect hidden failures, 0 tests added) and the real commit applied
# (expect hidden all green, the commit's tests added).
E="$(dirname "$0")"
. "$E/../slim-arms.sh"

for task in "$@"; do
  root="$slim_root/rgr-eval/$task"

  for kind in parent reference; do
    dir="$root/selfcheck-$kind"
    rm -rf "$dir"
    mkdir -p "$dir"
    (cd "$root/template" && tar -cf - --exclude=node_modules .) | (cd "$dir" && tar -xf -)
    (cd "$dir" && pnpm install --frozen-lockfile --prefer-offline --silent \
      && git init -q && git add -A && git -c user.name=eval -c user.email=eval@localhost commit -qm base && git tag base)

    if [ "$kind" = reference ]; then
      cp -r "$root/after-src/." "$dir/"
      cp -r "$root/hidden/." "$dir/"
    fi

    echo "$task $kind: $(node "$E/grade-rgr.mjs" --outcome-only "$dir" "$task")"
  done
done
