# Emscripten-based constraint solvers
[![Build Status](https://travis-ci.org/normanrz/emscripten-constraints.svg?branch=master)](https://travis-ci.org/normanrz/emscripten-constraints)

## Implemented solvers
* [Z3](https://github.com/Z3Prover/z3)
* [Cassowary JS](https://github.com/slightlyoff/cassowary.js/)
* [rhea](https://github.com/Nocte-/rhea)

## Presentation
https://docs.google.com/presentation/d/1ViKZB2N_3aU3ga4KYHF-73TBx_kPAj6D8LAxf1Qjuy4/edit?usp=sharing

## Code structure
* Z3 and rhea are accessible through the `z3/module.z3.js` and `rhea/module.rhea.js` modules. These modules expose a promise-based loader.

```
var loadRhea = require("./rhea/module.rhea");
loadRhea("/rhea/").then(function (rhea) {
  doSomething(rhea);
});
```

* Tests, Benchmarks and Examples can be accessed by starting a web server in this repo's root directory and navigating to the respective folder.
* Basic BabelsbergJS implementations can be found in the `examples` folder.
* Tests and Benchmarks can be run in the browser or with Karma.
* Need to run `npm install` to use any of this.
