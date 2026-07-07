# Flyweight

## Intent

Share the common, unchanging part of a large population of similar objects across all of
them, so that supporting very many fine-grained objects costs far less memory than giving
each object its own copy.

## Applicability

Use it when an application uses a very large number of objects whose memory cost is only bearable once most of their state is shared.

Reach for it only when all of the following hold: the application uses a great many objects; storage cost is high because of their sheer number; most of their state can be moved outside the object and supplied by the caller; many groups of objects can be replaced by a few shared ones once that state is extracted; and the application does not depend on the identity of these objects, since callers will be handed the same shared instance and cannot tell copies apart.

## Consequences

- Saves storage in proportion to how much state is shared: the reduction grows as more
  intrinsic state is shared, as more per-object state is made extrinsic, and as more
  objects collapse onto a smaller set of shared flyweights.
- Trades some run-time cost for that saving: because extrinsic state must be passed in,
  computed, or looked up on each use rather than stored, the pattern spends CPU time to
  reclaim memory.
- Modern status: Flyweight is a niche, optimization-driven pattern and is a different kind
  of beast from the patterns that shape a design for flexibility -- it is really a
  memory-footprint technique. Reach for it only when profiling shows large numbers of
  similar objects genuinely dominating memory, not as a default structuring choice.

## Example

```ts
// Flyweight: holds the intrinsic (shared) state; one instance is shared by many contexts.
class TreeType {
  constructor(
    readonly species: string,
    readonly texture: string,
  ) {}

  render(x: number, y: number): string {
    return `${this.species}@${x},${y}`;
  }
}

// Flyweight Factory: hands out shared flyweights, creating each distinct one only once.
class TreeTypeFactory {
  private readonly pool = new Map<string, TreeType>();

  get(species: string, texture: string): TreeType {
    const key = `${species}:${texture}`;
    let type = this.pool.get(key);

    if (type === undefined) {
      type = new TreeType(species, texture);
      this.pool.set(key, type);
    }

    return type;
  }
}

// Context objects store only extrinsic state (position) and borrow a shared flyweight.
class Tree {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly type: TreeType,
  ) {}

  draw(): string {
    return this.type.render(this.x, this.y);
  }
}

const factory = new TreeTypeFactory();
const forest = [new Tree(1, 2, factory.get("oak", "bark")), new Tree(3, 4, factory.get("oak", "bark"))];
const frame = forest.map((tree) => tree.draw());
```

## Related patterns

- [Composite](composite.md#composite): Flyweight is often combined with Composite to implement a hierarchy in which the shared leaf nodes are flyweights.
- [State](state.md#state) and [Strategy](strategy.md#strategy): objects that represent a state or a strategy usually hold no per-context data, so they make good flyweights and can be shared.
