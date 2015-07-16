#!/bin/bash
# $1 = original solver file
# $2 = output file
: ${2?"Usage: generateWrapper.sh originalSolverFile outputFile"}

if [ -e $1.pre ]; then
  echo "Found .pre file"
  cp $1.pre $2
  cat $1 >> $2
else
  cat $1 > $2
fi

echo "return { Module : Module, FS : FS };" >> $2

if [ -e $1.mem ]; then
  echo "Patching memoryInitializer..."
  sed -i.bak "s/memoryInitializer=\"$(basename $1).mem\"/memoryInitializer=memoryInitializerPath+\"$(basename $1).mem\"/g" $2
fi
echo "Done!"
