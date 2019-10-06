#!/bin/sh

eval "npx eslint $1 --ext .js --ext .jsx --ext .ts --ext .tsx --ext .d.ts src"
