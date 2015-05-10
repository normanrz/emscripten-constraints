# Emscripten-based constraint solvers (API Design and toolchain)
[![Build Status](https://magnum.travis-ci.com/normanrz/emscripten-constraints.svg?token=7fqzGEv22MQpvpU7RhK5)](https://magnum.travis-ci.com/normanrz/emscripten-constraints)

## Solvers of interest
* Z3
* Ceres
* Cassowary (JS vs C implementation)
* Yices (Not sure if compiles)
* DeltaBlue (Deprecated?)
* Kodkod (Java)

## Tasks
* Initial Compiliation
* API Wrapping
  * Asynchronous loading
  * On demand
* Toolchain for Compilation

### Babelsberg API requirements
* `always(opts, func)`
* `contraintVariableFor(object, property)`
* `solve()`

## References
* http://emscripten.org
* http://repl.it/languages

## Literature
* http://opus.kobv.de/ubp/volltexte/2014/6729/pdf/tbhpi81.pdf
* http://adamrehn.com/articles/creating-javascript-bindings-for-c-cxx-libraries-with-emscripten
