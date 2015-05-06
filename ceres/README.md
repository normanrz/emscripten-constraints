# Ceres
[Ceres solver](http://ceres-solver.org/)

## Dependencies
* [Eigen](http://eigen.tuxfamily.org/index.php?title=Main_Page) (`brew install eigen`)
* Emscripten, obviously

## Build library
```
git clone https://ceres-solver.googlesource.com/ceres-solver ceres
cd ceres
emcmake cmake . -DLAPACK=OFF -DSUITESPARSE=OFF -DCXSPARSE=OFF -DEIGENSPARSE=OFF -DGFLAGS=OFF -DMINIGLOG=ON -DSCHUR_SPECIALIZATIONS=OFF -DOPENMP=OFF -DEIGEN_INCLUDE_DIR=/usr/local/include/eigen3
emmake make -j8
```

## Compile binding
* Copy `binding.cpp` to `ceres` directory

```
emcc -c -std=c++11 -I./include -I/usr/local/include/eigen3 -I./internal/ceres/miniglog -I./config binding.cpp -o binding.bc
emcc -O2 --bind lib/libceres.so binding.bc -o ceres.js
echo "console.log(Module.test(0.5));" >> ceres.js
node ceres.js
```

## Notes
* Ceres keeps `stderr` quite noisy. We can use `FS.init(function () { return null; }, function (a) { console.log(a); }, function () { /* do nothing */ });` to silence it. [see FS.init](http://kripken.github.io/emscripten-site/docs/api_reference/Filesystem-API.html#FS.init)
