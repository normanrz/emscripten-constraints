#!/bin/bash
echo "Concatenating files..."
cp $1 $2
if [[ $1 = "common" ]]; then
  echo "exports.Module = Module; exports.FS = FS; " >> $2
else
  echo "return { Module : Module, FS : FS };" >> $2
fi

if [ -e $1.mem ]; then
  echo "Patching memoryInitializer..."
  sed -i.bak "s/memoryInitializer=\"$(basename $1).mem\"/memoryInitializer=memoryInitializerPath+\"$(basename $1).mem\"/g" $2
fi
echo "Done!"
