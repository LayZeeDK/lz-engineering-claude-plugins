# Message matrix (query vs command)

Scope: the testing stance built on the query/command message distinction (Metz + Owen) --
a design-agnostic rule for what to assert and what to mock based on the KIND of message an
object receives or sends. Incoming query: assert the returned value. Incoming command: assert
the direct public side effect. Outgoing command: expect (mock) the message was sent. Outgoing
query: do not test. Reached from the testing-stance index when the code is message-oriented.

> Populated in Phase 17. Satisfies RTR-01, ASRT-03. Source cluster: Sandi Metz + Katrina Owen
> (99 Bottles of OOP; owned).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each message-type cell, when populated, carries:

- Message type -- incoming query, incoming command, outgoing query, or outgoing command.
- Assert rule -- what the red-step test asserts for that cell (or that it asserts nothing).
- Mock rule -- whether to use a double for that cell (only outgoing commands), in original words.

Sub-topics in scope for this doc:

- The query vs command distinction -- messages that return a value vs messages that change state.
- Incoming query -- assert on the returned value.
- Incoming command -- assert on the direct public side effect.
- Outgoing command -- expect the message was sent (the one place a double is warranted).
- Outgoing query -- do not test (an implementation detail of a collaborator).

## Sources (placeholder)

- Sandi Metz + Katrina Owen -- the message-testing matrix, 99 Bottles of OOP (owned;
  oracle-verified at the Phase 16 checkpoint; distilled in Phase 17).
