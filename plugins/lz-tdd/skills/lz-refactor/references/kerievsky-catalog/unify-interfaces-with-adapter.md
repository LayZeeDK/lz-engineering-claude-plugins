# Unify Interfaces with Adapter

Use when: clients want to treat two classes the same way, but the classes expose different interfaces and one of them you cannot change.

Direction: Towards
GoF pattern: Adapter
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Move Function](../fowler-catalog/move-function.md#move-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)

## Motivation

When two classes do the same job for a client but name and shape their operations differently, the client
has to know which one it holds and call each in its own way. If both classes were yours you would simply
rename until they matched, but often one is third-party or otherwise fixed. Unifying the interfaces gives
both a single shared type: the class you own is aligned to it directly, and the class you cannot change is
wrapped in an adapter that presents the shared interface and forwards to the original. The client then
depends only on the shared interface and stops distinguishing the two. Reach for it when a client is
branching on which concrete provider it has because their interfaces disagree.

## Mechanics

1. Pick the interface the client should depend on -- usually the shape of the class you own -- and align
   that class to it by renaming and reshaping its methods with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration);
   compile and run the tests.
2. For the class you cannot change, grow the adapter incrementally from the client's own calls: isolate
   each call the client makes into its own method with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function).
3. Move those extracted invocation methods into a new adapter class with
   [Move Function](../fowler-catalog/move-function.md#move-function) and have each forward to the
   adaptee's original method, so the adapter presents the shared interface.
4. Retype the client to the shared interface and pass the adapter where the fixed class used to go.
5. Run the tests and confirm the client behaves identically for both providers.

## Example

Before -- two providers, two different method shapes:

```ts
class Twilio {
  sendText(to: string, body: string): boolean {
    return to.length > 0 && body.length > 0;
  }
}

class Plivo {
  message(recipient: string, text: string): boolean {
    return recipient !== "" && text !== "";
  }
}
```

After -- a shared interface; the fixed provider is wrapped in an adapter:

```ts
interface Sms {
  send(to: string, body: string): boolean;
}

class Twilio implements Sms {
  send(to: string, body: string): boolean {
    return to.length > 0 && body.length > 0;
  }
}

class Plivo {
  message(recipient: string, text: string): boolean {
    return recipient !== "" && text !== "";
  }
}

class PlivoAdapter implements Sms {
  constructor(private readonly plivo: Plivo) {}
  send(to: string, body: string): boolean {
    return this.plivo.message(to, body);
  }
}
```

## Watch for

- Unify the interfaces only when a client genuinely needs to treat the two providers interchangeably; if
  every caller already knows and wants the specific concrete type, a shared interface plus an adapter is
  indirection with no payoff.
- When the class is yours to change, prefer aligning it directly over wrapping it -- an adapter that has
  to invent behavior the adaptee lacks is a sign the interfaces should not be forced together.
