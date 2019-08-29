#!/bin/bash

docker pull zricethezav/gitleaks
out=$(docker run --rm --name=gitleaks -v $(pwd):/code/ zricethezav/gitleaks -v --repo-path=/code)
code=$?

yarn add request request-promise
node .pipelines/send-result.js leaks $(date +%s) $1 $2 "$out" $3

exit $code