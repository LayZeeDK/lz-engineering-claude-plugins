---
tags: [trigger, lz-refactor, fire, forward, rec-f23c7f8]
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
disallowed_tools: [Agent]
---

i have a `Config` Singleton that everything reaches into globally and it's making my tests painful. should i refactor away from the Singleton?
