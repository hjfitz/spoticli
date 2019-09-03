#!/bin/bash

yarn >/dev/null
out=$(yarn lint)
code=$?

node .pipelines/scripts/send-result.js "lint" $(date +%s) $1 $2 "$out" $3 $4
echo $out

exit $code