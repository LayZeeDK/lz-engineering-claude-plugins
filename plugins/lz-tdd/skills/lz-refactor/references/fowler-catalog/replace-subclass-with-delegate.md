# Replace Subclass with Delegate

Use when: subclasses vary one aspect of an object, but inheritance is too rigid: the axis changes at runtime, or you need to vary more than one thing at once.

## Motivation

Inheritance commits you to a single axis of variation fixed at construction: an object cannot change
its subclass, and it can specialize along only one dimension. It also couples parent and child
tightly, so a later change to the superclass can ripple into the subclasses and break them. When the
varying behavior needs to switch while the object lives, or to combine with another kind of variation,
a delegate is the flexible choice: the object holds a replaceable collaborator instead of being a
fixed subclass. This is composition over inheritance, and it matches the State and Strategy patterns.
To move an entire parent out of the picture rather than the subclasses, see
[Replace Superclass with Delegate](replace-superclass-with-delegate.md).

## Mechanics

1. If many callers construct the subclasses, route them through a factory with
   [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md).
2. Create a delegate class for the varying behavior and give the superclass a field holding it.
3. Move each subclass method onto the delegate with [Move Function](move-function.md), and have the
   superclass method dispatch to the delegate; run the tests after each move.
4. Once a subclass is empty, delete it and point its factory at the superclass with the right
   delegate.
5. Run the tests.

## Example

Before, a sponsored subclass overrides the ranking:

```ts
class SearchResult {
  constructor(protected readonly baseScore: number) {}

  rank(): number {
    return this.baseScore;
  }
}

class SponsoredResult extends SearchResult {
  rank(): number {
    return this.baseScore * 1.5;
  }
}
```

After, the varying behavior becomes a swappable delegate:

```ts
interface RankingPolicy {
  rank(baseScore: number): number;
}

class SponsoredPolicy implements RankingPolicy {
  rank(baseScore: number): number {
    return baseScore * 1.5;
  }
}

class SearchResult {
  constructor(
    protected readonly baseScore: number,
    private readonly policy?: RankingPolicy,
  ) {}

  rank(): number {
    return this.policy ? this.policy.rank(this.baseScore) : this.baseScore;
  }
}
```

## Watch for

- The delegate cannot see the host's private members the way a subclass could; pass what it needs as
  arguments, and keep the back-reference one-way unless the collaboration truly requires two.
