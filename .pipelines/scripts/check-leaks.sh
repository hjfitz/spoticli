#!/bin/bash

## script args: 
# $1 repo
# $2 branch
# $3 url


docker pull zricethezav/gitleaks
out=$(docker run --rm --name=gitleaks -v $(pwd):/code/ zricethezav/gitleaks -v --repo-path=/code)
code=$?

node .pipelines/scripts/send-result.js leaks $(date +%s) $1 $2 "$out" $3

exit $code