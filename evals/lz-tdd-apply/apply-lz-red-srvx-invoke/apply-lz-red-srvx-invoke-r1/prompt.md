---
tags: [apply, lz-red, red-step, srvx]
---

/lz-tdd:lz-red You are pair-programming with me. Read what I point you at and make the change in small steps. After editing, typecheck the touched file(s) and run the affected tests, then tell me what you see. Leave your edits in the working tree; do not commit. Here is my question:

A middleware sets a cookie on the Node `res`, then we send a web `Response`, and the cookie is gone from what the client receives. What's the next failing test you'd write for `src/adapters/_node/send.ts`? Go ahead and add it under `test/`.
