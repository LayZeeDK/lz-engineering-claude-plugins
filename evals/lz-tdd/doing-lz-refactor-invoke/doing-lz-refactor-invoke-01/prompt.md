---
tags: [doing, lz-refactor, refactor-step]
max_turns: 20
allowed_tools: [Read, Glob, Grep, Skill]
---

/lz-tdd:lz-refactor green bar. `createShipment(name, street, city, zip, weightKg, carrier, priority)` in `src/shipment.ts` -- the street/city/zip trio always travels together and i pass that same trio into three other functions the same way. tests pass. refactor that signature.
