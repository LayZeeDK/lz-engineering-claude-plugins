# Inline Class

Use when: a class no longer pulls its weight, often the leftover of a refactoring that moved most of its features elsewhere.

## Motivation

The opposite of [Extract Class](extract-class.md): when a class has dwindled to too little
responsibility to justify its existence, fold it back into the class that uses it most. Inlining is
also a useful setup move: collapse two poorly-divided classes into one, then re-extract along a
better seam.

## Mechanics

1. In the absorbing class, declare the source class's public methods, each delegating to the source
   for now.
2. Change every reference to the source class's methods to go through the absorbing class, testing
   after each.
3. Move the source class's fields and methods into the absorbing class, testing after each.
4. Delete the source class.

Inverse of [Extract Class](extract-class.md).

## Example

Before, a class that barely holds anything:

```ts
class Label {
  constructor(public text: string) {}
}

class Product {
  constructor(public label: Label) {}
}
```

After, its one field folds into its only user:

```ts
class Product {
  constructor(public text: string) {}
}
```
