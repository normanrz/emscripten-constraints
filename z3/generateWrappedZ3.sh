echo "Concatenating files..."
cat pre.js z3.js post.js > z3.wrapped.js
echo "Patching memoryInitializer..."
sed -i.bak 's/memoryInitializer="z3.js.mem"/memoryInitializer=memoryInitializerPath+"z3.js.mem"/g' z3.wrapped.js
echo "Done!"