#!/bin/bash

yarn
out=$(yarn lint)
code=$?

node .pipelines/scripts/send-result.js "lint" $(date +%s) $1 $2 "$out" $3

exit $code