#!/bin/bash

yarn >/dev/null
out=$(yarn test)
code=$?

node .pipelines/scripts/send-result.js "test" $(date +%s) $1 $2 "$out" $3 $4

exit $code