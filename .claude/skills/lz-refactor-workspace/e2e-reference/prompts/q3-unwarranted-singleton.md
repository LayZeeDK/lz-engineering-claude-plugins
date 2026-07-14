I have a class in my codebase that is written as a Singleton, but nothing about it actually needs a
single shared instance or global access point -- it is a Singleton only out of habit. I want to take
the pattern back out.

What is the named refactoring from Kerievsky's Refactoring to Patterns for removing a Singleton that
does not earn its keep? And separately, what plain functional-programming structure could I dissolve
it into instead?
