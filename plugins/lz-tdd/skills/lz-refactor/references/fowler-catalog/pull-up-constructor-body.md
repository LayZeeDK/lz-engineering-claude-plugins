# Pull Up Constructor Body

Use when: subclass constructors begin with the same setup steps.

## Motivation

Constructors resist the usual method moves because a subclass constructor must call its parent's
before it can touch the instance. When several subclass constructors share opening statements, that
shared setup belongs in the superclass constructor, invoked through a single super() call. Moving it
up removes the duplication while respecting the ordering rules constructors impose.

## Mechanics

1. Define a superclass constructor if none exists, and make each subclass constructor call it with
   super().
2. Use [Slide Statements](slide-statements.md) to gather the common statements next to the super()
   call so they move as a block.
3. Move the common statements into the superclass constructor, passing through super() any values it
   needs; run the tests.
4. If a shared step cannot move directly because it depends on subclass data, extract it with
   [Extract Function](extract-function.md) and pull the extracted method up instead.

## Example

Before, both subclasses repeat the same name-and-health setup:

```ts
abstract class Character {
  protected name = "";
  protected health = 0;
}

class Warrior extends Character {
  constructor(name: string, readonly shield: number) {
    super();
    this.name = name;
    this.health = 100;
  }
}

class Mage extends Character {
  constructor(name: string, readonly mana: number) {
    super();
    this.name = name;
    this.health = 100;
  }
}
```

After, the shared setup lives in the superclass constructor:

```ts
abstract class Character {
  protected name: string;
  protected health: number;

  constructor(name: string) {
    this.name = name;
    this.health = 100;
  }
}

class Warrior extends Character {
  constructor(name: string, readonly shield: number) {
    super(name);
  }
}

class Mage extends Character {
  constructor(name: string, readonly mana: number) {
    super(name);
  }
}
```

## Watch for

- If the common code must run after subclass-specific setup rather than first, it is not a clean
  constructor-body pull-up; consider a factory function instead.
