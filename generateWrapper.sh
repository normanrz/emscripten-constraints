#!/bin/bash
echo "Concatenating files..."
cp $1 $2
echo "return { Module : Module, FS : FS };" >> $2
if [ -e $1.mem ]; then
  echo "Patching memoryInitializer..."
  sed -i.bak "s/memoryInitializer=\"$(basename $1).mem\"/memoryInitializer=memoryInitializerPath+\"$(basename $1).mem\"/g" $2
fi
echo "Done!"