echo "Concatenating files..."
cat pre.js z3.js post.js > wrappedZ3.js
echo "Patching memoryInitializer..."
sed -i.bak 's/memoryInitializer="z3.js.mem"/memoryInitializer=memoryInitializerPath+"z3.js.mem"/g' wrappedZ3.js
echo "Done!"