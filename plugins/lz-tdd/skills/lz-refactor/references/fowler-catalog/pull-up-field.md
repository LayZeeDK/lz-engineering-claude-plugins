# Pull Up Field

Use when: sibling subclasses each declare a field that holds the same thing.

## Motivation

A field repeated across subclasses is duplicated data: the subclasses use it the same way, so it
belongs on the superclass. Pulling it up removes the duplicate declarations and clears the way to
pull up any methods that read or write it. If the copies were named differently, unifying them first
reveals that they were the same concept all along.

## Mechanics

1. Examine every use of the candidate fields to confirm the subclasses use them the same way.
2. If the fields have different names, apply [Rename Field](rename-field.md) to give them one name.
3. Declare the field on the superclass, visible to subclasses (for example, protected).
4. Delete the field from each subclass.
5. Run the tests.

Once the field is shared, a method that depends on it can follow with [Pull Up Method](pull-up-method.md).

Inverse of [Push Down Field](push-down-field.md).

## Example

Before -- both listing subclasses hold the same seller field:

```ts
abstract class Listing {}

class AuctionListing extends Listing {
  constructor(protected readonly sellerId: string) {
    super();
  }
}

class FixedPriceListing extends Listing {
  constructor(protected readonly sellerId: string) {
    super();
  }
}
```

After -- the field moves to the superclass and the subclasses inherit its constructor:

```ts
abstract class Listing {
  constructor(protected readonly sellerId: string) {}
}

class AuctionListing extends Listing {}

class FixedPriceListing extends Listing {}
```

## Watch for

- Fields that share a name but are initialized to different meanings are not the same field; confirm
  the subclasses truly use them identically before merging.
