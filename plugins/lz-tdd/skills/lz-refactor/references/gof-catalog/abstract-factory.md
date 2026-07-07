# Abstract Factory

Also known as: Kit

Functional alternative: [Factory Function](../functional-catalog/factory-function.md#abstract-factory)

## Intent

Give client code one interface for producing a whole family of related objects, so it can
create and use them without naming their concrete classes or knowing which variant of the
family it currently holds.

## Applicability

Use it when a system must work with one of several interchangeable families of related products and must guarantee that products from the same family are used together.

Reach for it when concrete product classes should stay hidden from clients, when a product family is meant to be swapped as a single unit, or when you want to make it impossible to accidentally combine products drawn from different variants.

## Consequences

- Isolates clients from concrete classes: client code talks only to the abstract
  product and factory interfaces, so the concrete types stay sealed behind the factory.
- Makes exchanging one entire family for another easy: because a program uses a factory
  only through its abstract interface, handing it a different concrete factory switches
  the whole family in one place.
- Promotes consistency among products: since a single factory produces the complete
  family, clients cannot mix a product from one variant with a product from another.
- Supporting new kinds of products is hard: the factory interface fixes the set of
  products that can be created, so adding another product type forces a change to that
  interface and to every concrete factory that implements it.

## Example

```ts
interface ObjectStore {
  put(key: string, value: string): void;
}

interface MessageQueue {
  send(payload: string): void;
}

// Abstract Factory: one creation method per product in the family.
interface InfrastructureFactory {
  createStore(): ObjectStore;
  createQueue(): MessageQueue;
}

class AwsStore implements ObjectStore {
  private readonly data = new Map<string, string>();

  put(key: string, value: string): void {
    this.data.set(key, value);
  }
}

class AwsQueue implements MessageQueue {
  private readonly outbox: string[] = [];

  send(payload: string): void {
    this.outbox.push(payload);
  }
}

// Concrete Factory: produces one matched family (all AWS-flavoured products).
class AwsInfrastructure implements InfrastructureFactory {
  createStore(): ObjectStore {
    return new AwsStore();
  }

  createQueue(): MessageQueue {
    return new AwsQueue();
  }
}

// Client depends only on the abstract interfaces, never on AwsStore or AwsQueue.
class UploadService {
  private readonly store: ObjectStore;
  private readonly queue: MessageQueue;

  constructor(factory: InfrastructureFactory) {
    this.store = factory.createStore();
    this.queue = factory.createQueue();
  }

  upload(key: string, value: string): void {
    this.store.put(key, value);
    this.queue.send(key);
  }
}

const service = new UploadService(new AwsInfrastructure());
service.upload("report.csv", "a,b,c");
```

## Related patterns

- [Factory Method](factory-method.md#factory-method): a concrete factory usually implements each of its creation methods as a factory method.
- [Prototype](prototype.md#prototype): a concrete factory can store prototype instances and build products by cloning them instead of instantiating a fixed class.
- [Singleton](singleton.md#singleton): a concrete factory is normally needed only once per family, so it is frequently realized as a singleton.
