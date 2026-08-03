This is a design question rather than a step in the test-first loop, so nothing in that loop owns it
and I will just answer it directly. Keep the parsing at the edge: one function that turns argv into a
plain options object, validated once, and a core that takes the options and never touches argv. Then
the parsing is testable on its own and the core does not need a CLI to exercise it.
