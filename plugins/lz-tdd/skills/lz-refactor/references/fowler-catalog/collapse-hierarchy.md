# Collapse Hierarchy

Use when: a superclass and its subclass have grown so alike that the separation no longer earns its keep.

## Motivation

After enough refactoring, a class and its parent can converge until the distinction between them adds
nothing -- the subclass no longer specializes anything worth naming. Merging the two into one class
removes a layer that a reader would otherwise have to hold in mind. It is the cleanup you reach for
once features have moved and a once-useful split has become empty ceremony.

## Mechanics

1. Choose which class to keep -- superclass or subclass.
2. Move every element into the surviving class: [Pull Up Field](pull-up-field.md) and
   [Pull Up Method](pull-up-method.md) to lift members up, or [Push Down Field](push-down-field.md)
   and [Push Down Method](push-down-method.md) to send them down.
3. Adjust references so callers name the surviving class.
4. Delete the now-empty class and run the tests.

## Example

Before -- the subclass adds only one derived label:

```ts
class Folder {
  constructor(readonly name: string) {}
}

class SmartFolder extends Folder {
  get label(): string {
    return this.name.toUpperCase();
  }
}
```

After -- the two collapse into a single class:

```ts
class Folder {
  constructor(readonly name: string) {}

  get label(): string {
    return this.name.toUpperCase();
  }
}
```

## Watch for

- Collapse only when the split has genuinely stopped paying; if the subclass still models a real
  distinction that will grow, keeping the layer is the cheaper long-run choice.
