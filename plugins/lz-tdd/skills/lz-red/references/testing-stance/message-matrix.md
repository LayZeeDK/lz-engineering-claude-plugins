# Message matrix (query vs command)

Scope: the testing stance for an object with collaborators, decided by the KIND of message rather
than by the object's class. Every message an object receives or sends is either a query (it returns
a value and changes nothing a caller can observe) or a command (it changes observable state and
returns nothing worth using), and it either arrives from outside (incoming), goes out to a
collaborator (outgoing), or is sent by the object to itself. What a red-step test asserts, and the
single place a double is warranted, follow from those two axes. Reached from the testing-stance
index when the code is message-oriented -- an object talking to collaborators with a clear
query/command split.

> Owned reference: the query/command message matrix leans on Sandi Metz and Katrina Owen's 99
> Bottles of OOP (2nd Edition, JavaScript Edition) and is oracle-verified against the clean-room
> source. The message-type NAMES (query, command, incoming, outgoing, sent-to-self) are kept as
> plain facts; every definition and rule below is written in original words, with no verbatim source
> prose or code (DST-04).

## Query and command: two kinds of message

- Message type: a query is a message that answers with a value and leaves the world unchanged; a
  command is a message that changes observable state and hands back nothing a caller needs. Keeping a
  message on one side of that line -- return a value or change state, not both -- is what makes the
  matrix below decidable.
- When-to-use: when the unit under test is an object that collaborates with others and you need to
  decide what a test should pin and whether any double belongs in it.
- Distilled rationale: the pair of axes -- query versus command, and where the message comes from or
  goes -- sorts every interaction into exactly one cell, and each cell carries one rule. The design
  of the object does not change the rule; the kind of message does.

## Incoming query: assert the returned value

- Message type: an incoming query is a message the object receives from a caller and answers with a
  value.
- Assert rule: exercise the object through that message and assert the value it returns. The return
  value is the whole observable behavior of a query, so it is the whole of the test.
- Mock rule: no double. A query hands back a value you can assert directly, so there is nothing to
  stand in for.

## Incoming command: assert the public side effect

- Message type: an incoming command is a message the object receives that changes its observable
  state.
- Assert rule: run the command, then assert the direct public side effect -- the state change a
  caller can see afterwards through the object's own public surface, never a private field.
- Mock rule: no double. The effect is observable through the public interface, so a test reads it
  back rather than mocking it.

## Outgoing command: expect the message was sent

- Message type: an outgoing command is a message the object sends to a collaborator to change
  something beyond itself -- a notification, a write, an enqueue.
- Assert rule: assert that the object sent that message -- an expect-to-send check against a double
  standing in for the collaborator. Sending the command IS the behavior under test, and it has no
  return value to read, so the interaction is what you pin.
- Mock rule: this is the ONE cell that warrants a double. Use it only for a genuine outgoing command
  at the object's boundary, and assert what was sent, not how.

## Outgoing query and self-messages: do not test

- Message type: an outgoing query is a value the object asks a collaborator for; a self-message is a
  message the object sends to itself (a private helper).
- Assert rule: assert nothing. An outgoing query is the collaborator's own incoming query -- test it
  there. A self-message is a private step on the way to a public result -- it is covered by the
  public query or command that drives it.
- Mock rule: no double. Standing in for an outgoing query only couples the test to how this object
  happens to use its collaborator, and pinning a self-message freezes an implementation detail the
  refactor step is free to change.

## The matrix and the over-mocking firewall

The two axes give six cells; only one of them warrants a double:

| Origin \ Type | Query | Command |
|---------------|-------|---------|
| Incoming | Assert the returned value | Assert the direct public side effect |
| Sent to self | Ignore (do not test) | Ignore (do not test) |
| Outgoing | Ignore (do not test) | Expect to send (the one warranted double) |

- Rule: the only cell that calls for a mock or double is the outgoing command (expect-to-send).
  Every other cell is assert-a-value, assert-a-state, or do-not-test.
- When-to-use: whenever you feel the pull to mock a collaborator, check which cell you are in first.
  If it is not an outgoing command, the double is the wrong move and there is a value to assert
  instead.
- Distilled rationale (Sandi Metz and Katrina Owen, owned; oracle-verified): routing every message
  through this one table is the design-agnostic firewall against over-mocking and the test-per-class
  habit. A double appears in exactly one place, so a suite cannot drift into mirroring the object's
  internals with a mock per collaborator -- the failure mode that makes tests brittle and refactoring
  expensive.

An incoming query is pinned by its return value; an outgoing command is pinned by an expect-to-send
on a double for the collaborator:

```ts
import { describe, it, expect, vi } from 'vitest';

// The collaborator receives an outgoing command: a one-way notification.
type Notify = (event: string) => void;

// The SUT answers an incoming query (isOpen) and handles an incoming command (openGate)
// that also sends an outgoing command to its notifier collaborator.
class Gate {
  private open = false;

  constructor(private readonly notify: Notify) {}

  // Incoming query: returns a value, no observable side effect.
  isOpen(): boolean {
    return this.open;
  }

  // Incoming command: changes observable state and sends an outgoing command.
  openGate(): void {
    this.open = true;
    this.notify('opened');
  }
}

describe('Gate', () => {
  it('should report it is closed before it is opened', () => {
    // Arrange
    const gate = new Gate(vi.fn());
    // Act: an incoming query.
    const result = gate.isOpen();
    // Assert the returned value; no double needed.
    expect(result).toBe(false);
  });

  it('should send the opened notification when it is opened', () => {
    // Arrange
    const notify = vi.fn();
    const gate = new Gate(notify);
    // Act: an incoming command that fans out an outgoing command.
    gate.openGate();
    // Assert the outgoing command was sent -- expect-to-send, the one warranted double.
    expect(notify).toHaveBeenCalledWith('opened');
  });
});
```

## Sources

- Sandi Metz and Katrina Owen, 99 Bottles of OOP (2nd Edition, JavaScript Edition) -- the
  query/command message matrix that decides what a test asserts, and the single cell (the outgoing
  command) where a double is warranted, from the kind of message rather than the object's class.
  Owned; oracle-verified against the clean-room source.
