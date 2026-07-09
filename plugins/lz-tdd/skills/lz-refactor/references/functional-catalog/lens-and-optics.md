# Lens and Optics

Use when: reading or updating a value buried several levels deep in immutable data forces long access chains and hand-written copy-on-write spreads.
Correspondence: alternative-to -> [Hide Delegate](../fowler-catalog/hide-delegate.md#hide-delegate), [Remove Middle Man](../fowler-catalog/remove-middle-man.md#remove-middle-man)
Keep the OO form when: the container should conceal its shape behind delegating methods (a genuine Hide Delegate), the nesting is shallow enough that direct access reads fine, or updating in place is acceptable.

## Idiom

A lens is a pair of pure functions focused on one slot inside a structure: a getter that reads that slot and an immutable setter that returns a copy with the slot replaced. Because both are ordinary values, lenses compose: pointing one lens through another reaches a deeper slot, so "the city inside the address inside the person" becomes a single reusable focus. Repeated dotted reads and nested spread updates collapse into a named getter and setter you can pass around and combine.

## Example

Before, updating a nested field means spreading every level by hand, and the shape is spelled out again at each call site:

```ts
interface Address {
  city: string;
}

interface Person {
  name: string;
  address: Address;
}

function moveCity(person: Person, city: string): Person {
  return {
    ...person,
    address: {
      ...person.address,
      city,
    },
  };
}
```

After, one lens per level names each focus; composing the address getter with the city setter performs the same immutable update, and the spread logic lives once inside the lenses.

```ts
interface Lens<S, A> {
  get: (source: S) => A;
  set: (value: A, source: S) => S;
}

interface Address {
  city: string;
}

interface Person {
  name: string;
  address: Address;
}

const addressLens: Lens<Person, Address> = {
  get: (person) => person.address,
  set: (address, person) => ({ ...person, address }),
};

const cityLens: Lens<Address, string> = {
  get: (address) => address.city,
  set: (city, address) => ({ ...address, city }),
};

function moveCity(person: Person, city: string): Person {
  const updatedAddress = cityLens.set(city, addressLens.get(person));

  return addressLens.set(updatedAddress, person);
}
```

Same behavior; mechanics: extract a getter/immutable-setter pair per level into a Lens, then compose them to replace each nested spread, run tests between steps.

## When each fits

Reach for a lens when the same nested slot is read and updated from many places in immutable data and you want that focus named, reusable, and composable rather than respelled as a spread at every site. Keep Hide Delegate when the container should present intent-revealing methods and keep its internal structure private. A lens deliberately exposes the path instead. Remove Middle Man is the inverse pull: when so many pass-through accessors have piled up that direct access (or a lens over the exposed structure) reads more honestly than another delegating layer.
