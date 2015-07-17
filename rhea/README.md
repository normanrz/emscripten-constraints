# Cassowary
We use the [rhea implementation](https://github.com/Nocte-/rhea) of the cassowary algorithm because it is compilable with current compiler software.

## Dependencies
* Only Emscripten

## Build
```
git submodule init && git submodule update
cd rhea
emcmake cmake .
emmake make
cd ..
./build.sh
```
