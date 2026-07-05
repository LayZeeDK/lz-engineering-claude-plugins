# Rename Field

Use when: a record or class field's name no longer says what it holds.

## Motivation

Field names carry much of a data structure's meaning: they are how the next reader understands what a
record represents without chasing its uses. As your grasp of the domain sharpens, a name that once
seemed fine can turn vague or misleading, and the cost is paid by everyone who reads it afterward.
Renaming keeps the data self-describing. The same reasoning applies to the getters and setters of a
class that behaves like a record.

## Mechanics

1. If the field's use is narrow, rename it at the declaration and every reference, run the tests, and
   you are done.
2. Otherwise, if the record is not yet encapsulated, apply
   [Encapsulate Record](encapsulate-record.md) so all access goes through accessors.
3. Rename the private field, and update the accessors inside the record to match.
4. Run the tests.
5. If the accessor names are part of the record's interface, rename them with
   [Change Function Declaration](change-function-declaration.md).
6. If the constructor takes the field's value under the old name, rename that parameter too with
   [Change Function Declaration](change-function-declaration.md).
7. Run the tests.

## Example

Before -- a cramped field name obscures the data:

```ts
interface Contact {
  nm: string;
  email: string;
}

function greeting(contact: Contact): string {
  return `Hello, ${contact.nm}`;
}
```

After -- the field name states what it holds, at the declaration and every use:

```ts
interface Contact {
  name: string;
  email: string;
}

function greeting(contact: Contact): string {
  return `Hello, ${contact.name}`;
}
```

## Watch for

- Renaming a field that maps to stored data changes the persisted shape; green unit tests do not
  prove it safe. Migrate with a parallel change -- see the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
