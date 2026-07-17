# Builder

Functional alternative: [Function Composition](../functional-catalog/function-composition.md#builder)

## Intent

One assembly routine, several possible end products. The steps that build up a complex object live
outside it, in a separate builder role; because the walk through those steps is decoupled from what
each step actually produces, running it again against a different builder yields a different
representation.

## Applicability

Use it when the algorithm for assembling a complex object should be independent of the parts the object is made of and how they are put together.

Reach for it when the construction process must allow different representations of the object being built, and when you want the assembly to proceed under a director's control so the finished product is handed back only once every step has run.

## Consequences

- Lets you vary a product's internal representation: because the builder hides how the
  product is assembled and structured, changing that structure means writing a new
  builder, leaving the construction process and its clients untouched.
- Isolates code for construction and representation: the builder encapsulates how a
  complex object is built and stored, so clients need not know the classes that make up
  the product's internal structure.
- Gives finer control over the construction process: unlike creators that build the
  product in one shot, a builder assembles it step by step under the director's
  direction, so the product is retrieved only once it is fully built.

## Example

```ts
interface HttpRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: ReadonlyMap<string, string>;
  readonly body: string | undefined;
}

// Builder: exposes a step for each part of the product and returns the finished result.
class HttpRequestBuilder {
  private method = "GET";
  private url = "/";
  private readonly headers = new Map<string, string>();
  private body: string | undefined;

  target(method: string, url: string): this {
    this.method = method;
    this.url = url;
    return this;
  }

  header(name: string, value: string): this {
    this.headers.set(name, value);
    return this;
  }

  payload(body: string): this {
    this.body = body;
    return this;
  }

  build(): HttpRequest {
    return {
      method: this.method,
      url: this.url,
      headers: new Map(this.headers),
      body: this.body,
    };
  }
}

// Director: drives the steps in a fixed order, unaware of the concrete representation.
function buildJsonPost(builder: HttpRequestBuilder, url: string, body: string): HttpRequest {
  return builder.target("POST", url).header("content-type", "application/json").payload(body).build();
}

const request = buildJsonPost(new HttpRequestBuilder(), "/orders", "{\"item\":1}");
```

## Related patterns

- [Abstract Factory](abstract-factory.md#abstract-factory): both hide construction, but Abstract Factory returns a whole family of products immediately, whereas Builder returns one product only after a multi-step process finishes.
- [Composite](composite.md#composite): the object a builder assembles is often a composite tree.
