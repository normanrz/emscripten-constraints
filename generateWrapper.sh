#!/bin/bash
echo "Concatenating files..."
# $1 = original solver file
# $2 = output file
# $3 = [common|amd]

if [ -e $1.pre ]; then
  # if $1.pre exists, we preprend it to $1 and save it to $2
  cp $1.pre $2
  cat $1 >> $2
else
  cp $1 $2
fi

if [[ $3 = "common" ]]; then
  echo "exports.Module = Module; exports.FS = FS; " >> $2
elif [[ $3 = "amd" ]]; then
  sed -i -e "1s/^/define([], function() {\n/" $2
  echo "return { Module : Module, FS : FS };};" >> $2
else
  echo "return { Module : Module, FS : FS };" >> $2
fi

if [ -e $1.mem ]; then
  echo "Patching memoryInitializer..."
  sed -i.bak "s/memoryInitializer=\"$(basename $1).mem\"/memoryInitializer=memoryInitializerPath+\"$(basename $1).mem\"/g" $2
fi
echo "Done!"
