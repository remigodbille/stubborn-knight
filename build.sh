#!/bin/bash

readonly ROOT=/home/stubborn-knight

readonly SRC=$ROOT/src
readonly APP=$ROOT/app.js
readonly APP_MIN=$ROOT/app.min.js
readonly INDEX=$ROOT/index.html

function buildModule {
  cd $1

  printf "App.$1 = (function(my) {\n" >> $APP

  for file in `ls`
  do
    cat "$file" >> $APP
    printf "\n\n" >> $APP
  done

  printf "\n" >> $APP
  printf "return my;\n" >> $APP
  printf "})(App.$1 || {});\n\n" >> $APP

  cd ..
}

cd "$SRC/js"

printf "var App = App || {};\n\n" > $APP

while read module; do
  if [ -d $module ]; then
    buildModule $module
  fi
done < "build.config"

yui-compressor $APP > $APP_MIN

cd "$SRC/html"

cat header.html > $INDEX
printf "\n\n" >> $INDEX

for file in `ls`; do
  extension="${file##*.}"

  if [ "$extension" == "template" ]; then
    cat $file >> $INDEX
    printf "\n\n" >> $INDEX
  fi
done

cat footer.html >> $INDEX
