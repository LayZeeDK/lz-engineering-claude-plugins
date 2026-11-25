#!/usr/bin/env bash
# A ShoppingCart whose addItem does not yet change what items() returns, so a test of the added item fails on its
# assertion.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "shopping-cart",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/shopping-cart.ts <<'EOF'
export interface Item {
  readonly sku: string;
  readonly price: number;
}

export class ShoppingCart {
  private readonly contents: Item[] = [];

  addItem(item: Item): void {}

  items(): readonly Item[] {
    return [...this.contents];
  }
}
EOF
