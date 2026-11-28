---
type: tool_used
tool: Bash
input_match: '"command":"(?:(?:[^"\\'']|''(?:[^''"\\]|\\.)*''|\\"(?:[^"\\]|\\[^"])*\\"|\\[^"])*?(?:&&|\|\||[;|(]|\\n))?\s*(?:\w+=(?:[^\s"\\'';&|()]|''(?:[^''"\\]|\\.)*''|\\"(?:[^"\\]|\\[^"])*\\"|\\[^"])*\s+)*(?:npx\s+(?:vitest|jest)\b|npm\s+(?:test\b|run\s+(?:test|vitest)))'
---

A Bash call ran the tests: a test-runner invocation at a command position, not a mention of the runner.
