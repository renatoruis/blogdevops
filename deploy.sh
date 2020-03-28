#!/bin/bash
rm -rf docs/
hugo -D
git add .
git commit -m "$1"

git push 
