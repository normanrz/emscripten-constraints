cp binding.cpp rhea
cd rhea
emcc -c -std=c++11 -I. binding.cpp -o binding.bc
emcc --bind rhea/librhea.so binding.bc -o rhea.js -s TOTAL_MEMORY=1073741824
cd ..
cp rhea/rhea.js .
../generateWrapper.sh rhea.js rhea.wrapped.js
