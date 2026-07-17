I've got a failing test `expect(parseTag('a:b')).toEqual({ scope: 'a', name: 'b' })` and
`parseTag` currently just returns `null`. What refactoring gets it to pass?
