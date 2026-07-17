# Proxy

Also known as: Surrogate

Functional alternative: [Thunk and Lazy Value](../functional-catalog/thunk-and-lazy-value.md#proxy)

## Intent

Put a stand-in object in front of a real one so that every access is routed through the
stand-in, which can add control or deferral while presenting the same interface clients
already use.

## Applicability

Use it whenever there is a need for a more versatile or sophisticated reference to an object than a plain pointer.

Reach for it for a remote proxy (a local stand-in for an object in another address space), a virtual proxy (which defers the cost of creating an expensive object until it is actually needed), a protection proxy (which checks access rights before forwarding a request), or a smart reference (which does extra bookkeeping when an object is accessed).

## Consequences

- Introduces a level of indirection when accessing an object, and that indirection has
  several distinct uses: a remote proxy hides that an object lives in a different address
  space; a virtual proxy can create an expensive object on demand; a protection proxy can
  enforce access rights; and a smart reference can perform extra work such as reference
  counting on each access.
- Keeps the real subject's interface: because the proxy conforms to the same interface as
  the object it stands in for, clients use it exactly as they would the real subject and
  need not know whether they hold a proxy or the real object.

## Example

```ts
// Subject: the interface shared by the real object and its proxy.
interface Vault {
  read(): string;
}

// Real Subject: the object the proxy stands in for.
class RealVault implements Vault {
  constructor(private readonly secret: string) {}

  read(): string {
    return this.secret;
  }
}

// Proxy: same interface as the subject; this protection proxy checks clearance before
// forwarding the request to the real object.
class VaultProxy implements Vault {
  constructor(
    private readonly real: RealVault,
    private readonly caller: { readonly clearance: number },
  ) {}

  read(): string {
    if (this.caller.clearance < 5) {
      return "access denied";
    }

    return this.real.read();
  }
}

const vault: Vault = new VaultProxy(new RealVault("launch-code"), { clearance: 7 });
const value = vault.read();
```

## Related patterns

- [Adapter](adapter.md#adapter): an adapter gives its subject a different interface, whereas a proxy keeps the same interface as its subject.
- [Decorator](decorator.md#decorator): has a similar structure but a different purpose: a decorator adds responsibilities to an object, while a proxy controls access to it.
