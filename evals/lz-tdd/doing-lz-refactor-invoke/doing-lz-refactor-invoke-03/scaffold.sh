#!/usr/bin/env bash
# Invoice.total() reads mostly from the Customer it holds; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "invoice",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/invoice.ts <<'EOF'
export class Customer {
  constructor(
    readonly discountRate: number,
    readonly taxRegion: 'eu' | 'us',
    readonly loyaltyTier: 'none' | 'silver' | 'gold',
  ) {}
}

export class Invoice {
  constructor(
    private readonly customer: Customer,
    private readonly amount: number,
  ) {}

  total(): number {
    const discounted = this.amount * (1 - this.customer.discountRate);
    const loyalty = this.customer.loyaltyTier === 'gold' ? 10 : this.customer.loyaltyTier === 'silver' ? 5 : 0;
    const taxRate = this.customer.taxRegion === 'eu' ? 0.25 : 0.08;

    return Math.round((discounted - loyalty) * (1 + taxRate) * 100) / 100;
  }
}
EOF

cat > src/invoice.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { Customer, Invoice } from './invoice';

describe('Invoice', () => {
  it('totals with discount, loyalty and EU tax', () => {
    expect(new Invoice(new Customer(0.1, 'eu', 'gold'), 200).total()).toBe(212.5);
  });

  it('totals with US tax and no loyalty', () => {
    expect(new Invoice(new Customer(0, 'us', 'none'), 100).total()).toBe(108);
  });

  it('takes the silver loyalty amount off', () => {
    expect(new Invoice(new Customer(0, 'eu', 'silver'), 100).total()).toBe(118.75);
  });
});
EOF
