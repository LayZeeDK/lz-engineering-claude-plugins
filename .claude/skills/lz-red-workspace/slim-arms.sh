# Shared by the lz-red-workspace eval runners; source it, do not run it.
# Sets slim_root, and offers ensure_pkg (sets pkg_dir), ensure_rules_b (sets rules_b) and the cycle-log pair
# begin_cycle_logs / collect_cycle_logs.
# SLIM_ROOT must stay outside the home folder: run-slim.ts refuses a cwd inside it.
slim_root="${SLIM_ROOT:-D:/tmp/slim-claude-p}"
slim_arms_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Packages plugins/lz-tdd at LZ_TDD_REF (default d02204d) into $slim_root/pkg/<ref>, reusing an existing package.
ensure_pkg() {
  local ref="${LZ_TDD_REF:-d02204d}"
  pkg_dir="$slim_root/pkg/$ref"

  if [ -f "$pkg_dir/.claude-plugin/plugin.json" ]; then
    echo "[INFO] reusing package $pkg_dir"

    return 0
  fi

  if ! (cd "$slim_arms_dir" && git rev-parse --quiet --verify "$ref^{commit}" > /dev/null); then
    echo "[ERROR] unknown ref '$ref' (set LZ_TDD_REF to a commit of this repo)"

    return 1
  fi

  # Extract into a sibling and rename only after tar succeeds, so a failed extract is never reused.
  local tmp="$pkg_dir.tmp.$$"
  rm -rf "$tmp"
  mkdir -p "$tmp"

  # From the top level: run in a subfolder, git archive keeps only that subfolder's paths.
  if ! (cd "$slim_arms_dir" && cd "$(git rev-parse --show-toplevel)" && set -o pipefail \
    && git archive "$ref:plugins/lz-tdd" | tar -x -C "$tmp"); then
    rm -rf "$tmp"
    echo "[ERROR] git archive of plugins/lz-tdd at $ref failed"

    return 1
  fi

  if [ ! -f "$tmp/.claude-plugin/plugin.json" ]; then
    rm -rf "$tmp"
    echo "[ERROR] no .claude-plugin/plugin.json in plugins/lz-tdd at $ref"

    return 1
  fi

  rm -rf "$pkg_dir"
  mv "$tmp" "$pkg_dir"
  echo "[OK] packaged lz-tdd at $ref into $pkg_dir"
}

# A session may write its cycle log into the rules folder or SLIM_ROOT, which every run reuses, so a later run can
# overwrite an earlier run's log. Call begin_cycle_logs <run dir> right before the session and collect_cycle_logs
# <run dir> right after it: the files changed in between, in rules-b and directly in SLIM_ROOT, are copied with their
# times into <run dir>.cycle-logs, where ../cycle-logs.mjs reads them.
begin_cycle_logs() {
  rm -rf "$1.cycle-logs"
  touch "$1.cycle-start"
}

collect_cycle_logs() {
  local marker="$1.cycle-start" dest="$1.cycle-logs"
  mkdir -p "$dest/rules-b" "$dest/slim-root"

  if [ -d "$slim_root/rules-b" ]; then
    (cd "$slim_root/rules-b" && find . -type f -newer "$marker" -exec cp -p --parents {} "$dest/rules-b" \;)
  fi

  find "$slim_root" -maxdepth 1 -type f -newer "$marker" -exec cp -p {} "$dest/slim-root" \;
  rm -f "$marker"
}

# Generates arm b's rules folder: the owner's lars-mode test-first.md plus a CLAUDE.md with the Test-first bullet.
# The folder is never deleted; collect_cycle_logs copies each run's logs out of it.
ensure_rules_b() {
  local source="$HOME/.claude/skills/lars-mode/references/test-first.md"
  rules_b="$slim_root/rules-b"

  if [ ! -f "$source" ]; then
    echo "[ERROR] missing $source (arm b needs the lars-mode Test-first reference)"

    return 1
  fi

  mkdir -p "$rules_b"
  cp "$source" "$rules_b/test-first.md"
  # Long form: run-slim refuses reads through 8.3 short paths.
  local long
  long="$(cygpath -m -l "$rules_b")"
  local bullet
  bullet=$(cat << 'EOF'
# Rules

- **Test-first** (`@TEST_FIRST@`, then skills `lz-tdd:lz-red`, `lz-tpp`, `lz-refactor`). A
  `pstack:tdd` trigger, a plan that names lz-tdd, or briefing or accepting a subagent's test-first work. Read the
  reference before the first test: one test per cycle through all three skills, with a cycle log.
EOF
  )
  printf '%s\n' "${bullet/@TEST_FIRST@/$long/test-first.md}" > "$rules_b/CLAUDE.md"
  echo "[INFO] test-first.md sha256 $(sha256sum "$rules_b/test-first.md" | cut -d' ' -f1)"
}
