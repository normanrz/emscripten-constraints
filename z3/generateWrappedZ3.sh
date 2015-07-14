#!/bin/bash
echo "Concatenating files..."
output="z3.wrapped.js"
if [[ $1 = "common" ]]; then
  cat pre.js z3.js post.common.js > $output
elif [[ $1 = "amd" ]]; then
  echo "define([], function() {\n" > $output
  cat z3.js >> $output
  echo "return { Module : Module, FS : FS };};" >> $output
else
  cat pre.js z3.js post.js > $output
fi

echo "Patching memoryInitializer..."
sed -i.bak 's/memoryInitializer="z3.js.mem"/memoryInitializer=memoryInitializerPath+"z3.js.mem"/g' $output
echo "Done!"
