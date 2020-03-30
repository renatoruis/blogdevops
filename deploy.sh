#!/bin/bash
git pull origin master
rm -rf docs/
hugo -D
git add .
git commit -m "$1"

git push 
