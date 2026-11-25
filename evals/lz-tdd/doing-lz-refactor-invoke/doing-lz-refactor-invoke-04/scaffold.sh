#!/usr/bin/env bash
# price(order) picks a whole pricing algorithm per customer segment in one if/else; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "price",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/price.ts <<'EOF'
export interface Order {
  readonly segment: 'retail' | 'wholesale' | 'promo';
  readonly quantity: number;
  readonly unitPrice: number;
  readonly promoCode?: string;
}

export function price(order: Order): number {
  let total: number;

  if (order.segment === 'retail') {
    const base = order.quantity * order.unitPrice;
    const shipping = base >= 100 ? 0 : 7.5;
    total = base + shipping;
  } else if (order.segment === 'wholesale') {
    const tiers = order.quantity >= 1000 ? 0.3 : order.quantity >= 100 ? 0.2 : 0.1;
    const base = order.quantity * order.unitPrice * (1 - tiers);
    total = Math.max(base, 250);
  } else {
    const base = order.quantity * order.unitPrice;
    const promoOff = order.promoCode === 'HALF' ? base / 2 : order.promoCode === 'TEN' ? 10 : 0;
    total = Math.max(base - promoOff, 0);
  }

  return Math.round(total * 100) / 100;
}
EOF

cat > src/price.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { price } from './price';

describe('price', () => {
  it('adds shipping to a small retail order', () => {
    expect(price({ segment: 'retail', quantity: 2, unitPrice: 10 })).toBe(27.5);
  });

  it('ships a large retail order free', () => {
    expect(price({ segment: 'retail', quantity: 10, unitPrice: 10 })).toBe(100);
  });

  it('applies a wholesale tier and the wholesale minimum', () => {
    expect(price({ segment: 'wholesale', quantity: 100, unitPrice: 5 })).toBe(400);
    expect(price({ segment: 'wholesale', quantity: 10, unitPrice: 5 })).toBe(250);
  });

  it('applies a promo code', () => {
    expect(price({ segment: 'promo', quantity: 4, unitPrice: 25, promoCode: 'HALF' })).toBe(50);
    expect(price({ segment: 'promo', quantity: 1, unitPrice: 5, promoCode: 'TEN' })).toBe(0);
  });
});
EOF
