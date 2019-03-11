#!/usr/bin/env bash
rm -rf ./lib
cp -rf ../appJS ./lib
git add lib
git add package.json
git add publishGIT.sh
git commit -m "update"
git push
