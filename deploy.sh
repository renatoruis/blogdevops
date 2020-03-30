#!/bin/bash
git pull origin master
rm -rf docs/
hugo -D
echo "blogdevops.com" > ./docs/CNAME
git add .
git commit -m "$1"

git push 
