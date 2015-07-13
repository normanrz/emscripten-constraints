#!/bin/bash
echo "Concatenating files..."
if [[ $1 = "common" ]]; then
  cat pre.js z3.js post.common.js > z3.wrapped.js
else
  cat pre.js z3.js post.js > z3.wrapped.js
fi

echo "Patching memoryInitializer..."
sed -i.bak 's/memoryInitializer="z3.js.mem"/memoryInitializer=memoryInitializerPath+"z3.js.mem"/g' z3.wrapped.js
echo "Done!"
