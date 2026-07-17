# Replace Conditional Dispatcher with Command

Use when: a switch or if/else chain selects and runs an action by name or code, and the set of actions keeps changing.

Direction: To/Towards
GoF pattern: [Command](../gof-catalog/command.md#command)
Composed Fowler primitive(s): [Replace Function with Command](../fowler-catalog/replace-function-with-command.md#replace-function-with-command), [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Extract Class](../fowler-catalog/extract-class.md#extract-class)
Functional alternative: [Thunk and Lazy Value](../functional-catalog/thunk-and-lazy-value.md#command)

## Motivation

When a dispatcher branches on a code to decide which action to run, adding, removing, or reordering an
action means editing the one growing conditional, and the actions cannot be handed around or configured
on their own. Turning each action into a command object behind a shared interface lets you register the
commands in a lookup keyed by the code, so dispatching becomes a table read plus a call, and a new action
is a new entry rather than another branch. The commands become first-class: you can store, pass, and test
them individually. Reach for it once the dispatch conditional is a churn point or the actions need a life
outside the switch.

## Mechanics

1. Define a command interface with the single method the actions share.
2. For one branch, extract its body into a handler method with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function), then move that handler into
   a class implementing the interface with [Extract Class](../fowler-catalog/extract-class.md#extract-class)
   (or [Replace Function with Command](../fowler-catalog/replace-function-with-command.md#replace-function-with-command)
   for a standalone function); compile.
3. Register that command in a lookup keyed by the code the branch matched.
4. Repeat for each branch, running the tests each time.
5. Replace the dispatcher body with a lookup by code and a call to the command it finds, keeping the
   not-found handling the old default gave.
6. Delete the drained conditional and run the tests.

## Example

Before, a switch dispatches by operation code:

```ts
function apply(op: string, value: number): number {
  switch (op) {
    case "double":
      return value * 2;
    case "negate":
      return -value;
    case "increment":
      return value + 1;
    default:
      throw new Error("unknown op: " + op);
  }
}
```

After, each operation is a command in a lookup:

```ts
interface Command {
  run(value: number): number;
}

const commands: Record<string, Command> = {
  double: { run: (value) => value * 2 },
  negate: { run: (value) => -value },
  increment: { run: (value) => value + 1 },
};

function apply(op: string, value: number): number {
  const command = commands[op];
  if (command === undefined) {
    throw new Error("unknown op: " + op);
  }
  return command.run(value);
}
```

## Watch for

- Reach for a command table only once the dispatch set is genuinely churning, or the actions need to be
  stored, passed, or tested on their own; a small, stable switch that nothing needs to extend is clearer
  left as a switch than scattered across a command per case.
- Keep the not-found path the old default gave; a lookup that silently returns nothing where the switch
  used to throw is a behavior change, not a refactoring.
