#!/usr/bin/env bash
# An untested pure slugify that splits on single spaces, so a title with a run of spaces gives repeated dashes.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "slugify",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/slugify.ts <<'EOF'
export function slugify(title: string): string {
  return title.trim().toLowerCase().split(' ').join('-');
}
EOF
