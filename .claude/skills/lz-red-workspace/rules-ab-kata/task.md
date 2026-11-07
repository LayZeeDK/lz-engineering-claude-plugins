Implement `shippingCost(order)` in src/shipping.ts test-first with the lz-tdd plugin. Put the tests in src/shipping.spec.ts and run them with `npm test`.

```ts
export interface Order { weightKg: number; subtotal: number; express: boolean }
```

Rules:
- Up to 1 kg costs 5.00; every started kg above that adds 2.00.
- Express doubles the price.
- A subtotal of 100 or more ships free, unless it's express.
- The weight must be positive, otherwise throw a RangeError.
