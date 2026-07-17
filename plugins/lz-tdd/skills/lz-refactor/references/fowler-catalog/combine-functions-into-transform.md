# Combine Functions into Transform

Use when: several functions derive extra values from the same source record, and the source is not updated after the fact.

## Motivation

When derivations of a record are scattered, the same calculation gets repeated and can drift out of
step. A transform gathers them: it takes the source record and returns a new, enriched record whose
extra fields are the derived values, computed in one place. Prefer this over
[Combine Functions into Class](combine-functions-into-class.md) when the source is read-only,
because a derived snapshot goes stale if the source it copied from later changes.

## Mechanics

1. Create a transform function that takes the source record and returns a copy of it: copy rather
   than alias, so callers cannot mutate the source through the result.
2. Move one derivation's logic into the transform, add its result as a field on the returned record,
   and change that derivation's callers to read the field.
3. Run the tests.
4. Repeat for each remaining derivation.

## Example

Before, a derivation is a separate function over the record:

```ts
interface Item {
  price: number;
  qty: number;
}

function subtotal(item: Item): number {
  return item.price * item.qty;
}
```

After, the transform returns an enriched copy carrying the derived field:

```ts
interface Item {
  price: number;
  qty: number;
}

interface EnrichedItem extends Item {
  subtotal: number;
}

function enrichItem(item: Item): EnrichedItem {
  const result: EnrichedItem = { ...item, subtotal: 0 };
  result.subtotal = result.price * result.qty;
  return result;
}
```

## Watch for

- If the source is mutated after the transform runs, the enriched copy will not reflect it. That
  is the case for [Combine Functions into Class](combine-functions-into-class.md) instead.
