#!/usr/bin/env bash
set -e
echo "REMOVING ./lib IF IT EXISTS"
rm -rf ./lib
echo done.

echo "BUILDING GRAMMAR"
nearleyc ./grammar.ne | tee ./src/grammar.js
echo done.

# compile
echo "COMPILING"
./node_modules/.bin/babel ./src --out-dir ./lib
echo done.
