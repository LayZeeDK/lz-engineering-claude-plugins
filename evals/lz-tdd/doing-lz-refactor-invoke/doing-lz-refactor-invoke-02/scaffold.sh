#!/usr/bin/env bash
# Two Account subclasses with the same validateWithdrawal body copied into each; the tests pass.
set -euo pipefail

mkdir -p src

cat > package.json <<'EOF'
{
  "name": "accounts",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  }
}
EOF

cat > src/accounts.ts <<'EOF'
export abstract class Account {
  constructor(protected balance: number) {}

  getBalance(): number {
    return this.balance;
  }

  abstract withdraw(amount: number): void;
}

export class SavingsAccount extends Account {
  validateWithdrawal(amount: number): void {
    if (amount <= 0) {
      throw new Error('amount must be positive');
    }

    if (amount > this.balance) {
      throw new Error('insufficient funds');
    }
  }

  withdraw(amount: number): void {
    this.validateWithdrawal(amount);
    this.balance = this.balance - amount;
  }
}

export class CheckingAccount extends Account {
  validateWithdrawal(amount: number): void {
    if (amount <= 0) {
      throw new Error('amount must be positive');
    }

    if (amount > this.balance) {
      throw new Error('insufficient funds');
    }
  }

  withdraw(amount: number): void {
    this.validateWithdrawal(amount);
    this.balance = this.balance - amount - 1;
  }
}
EOF

cat > src/accounts.test.ts <<'EOF'
import { describe, expect, it } from 'vitest';
import { CheckingAccount, SavingsAccount } from './accounts';

describe('accounts', () => {
  it('withdraws from savings', () => {
    const account = new SavingsAccount(100);
    account.withdraw(30);

    expect(account.getBalance()).toBe(70);
  });

  it('charges a fee on a checking withdrawal', () => {
    const account = new CheckingAccount(100);
    account.withdraw(30);

    expect(account.getBalance()).toBe(69);
  });

  it('refuses a withdrawal above the balance in both', () => {
    expect(() => new SavingsAccount(10).withdraw(20)).toThrow('insufficient funds');
    expect(() => new CheckingAccount(10).withdraw(20)).toThrow('insufficient funds');
  });

  it('refuses a withdrawal that is not positive in both', () => {
    expect(() => new SavingsAccount(10).validateWithdrawal(0)).toThrow('amount must be positive');
    expect(() => new CheckingAccount(10).validateWithdrawal(-1)).toThrow('amount must be positive');
  });
});
EOF
