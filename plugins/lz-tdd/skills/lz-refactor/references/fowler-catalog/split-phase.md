# Split Phase

Use when: one block of code does two distinct things in sequence -- typically it prepares some data and then computes a result from it.

## Motivation

When a stretch of code deals with two different concerns one after the other, splitting them lets
each be understood and changed on its own. The usual shape is a first phase that builds an
intermediate data structure and a second phase that consumes it, so a change to one concern no
longer forces you to read the other.

## Mechanics

1. Give the trailing concern a function of its own -- [Extract Function](extract-function.md) --
   leaving the earlier work where it stands.
2. Run the tests.
3. Create a record to carry values across the seam, and hand it to the trailing function as an
   argument.
4. Run the tests.
5. Walk the trailing function's remaining parameters one by one; whenever the earlier work also
   touches one, fold it into that carrier record and re-run the tests before moving on.
6. Extract the first phase into its own function that returns the intermediate structure.

## Example

Before -- gathering and computing are tangled in one function:

```ts
function receiptTotal(prices: readonly number[], taxRate: number): number {
  const subtotal = prices.reduce((sum, p) => sum + p, 0);
  return subtotal + subtotal * taxRate;
}
```

After -- a first phase builds an intermediate record, a second phase computes from it:

```ts
interface OrderData {
  subtotal: number;
  taxRate: number;
}

function receiptTotal(prices: readonly number[], taxRate: number): number {
  return applyTax(gatherOrder(prices, taxRate));
}

function gatherOrder(prices: readonly number[], taxRate: number): OrderData {
  return { subtotal: prices.reduce((sum, p) => sum + p, 0), taxRate };
}

function applyTax(order: OrderData): number {
  return order.subtotal + order.subtotal * order.taxRate;
}
```

## Watch for

- The split pays off when the two phases really are separate concerns; if the intermediate structure
  just mirrors the inputs, the division is not yet earning its keep.
