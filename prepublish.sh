#!/usr/bin/env bash

set -e

rm -rf ./build ./lib ./es
# commonJS
yarn tsc
mv ./build/src/ ./lib

yarn tsc --module ES6
mv ./build/src/ ./es
