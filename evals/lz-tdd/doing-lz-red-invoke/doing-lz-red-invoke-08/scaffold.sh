#!/usr/bin/env bash
# A package with a vitest test script and an isPalindrome that still returns false, so a correct red test fails on
# its assertion.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "is-palindrome",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/is-palindrome.ts <<'EOF'
export function isPalindrome(s: string): boolean {
  return false;
}
EOF
