#!/bin/bash

out=$(yarn audit --json)
code=$(echo $out | jq 'select(.data.vulnerabilities.low != null)|.data.vulnerabilities.low' -r -M)

node .pipelines/scripts/send-result.js audit $(date +%s) $1 $2 "$out" $3 $4

exit $code