# Cassowary
We use the [rhea implementation](https://github.com/Nocte-/rhea) of the cassowary algorithm because it is compilable with current compiler software.

## Dependencies
* Only Emscripten

## Build library
```
git clone git@github.com:Nocte-/rhea.git
cd rhea
emcmake cmake .
emmake make
```

## Compile binding
* Copy `binding.cpp` to `rhea` directory

```
emcc -c -std=c++11 -I. binding.cpp -o binding.bc
emcc --bind rhea/librhea.so binding.bc -o rhea.js
```

## Generate Wrapper
```
./generateWrapper.sh rhea.js rhea.wrapped.js
```