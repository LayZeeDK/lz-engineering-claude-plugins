#!/usr/bin/env bash
# A pure netOf that still returns the total unchanged, so a test of total minus discount fails on its assertion.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "net-of",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/net-of.ts <<'EOF'
export function netOf(total: number, discount: number): number {
  return total;
}
EOF
