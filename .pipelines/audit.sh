#!/bin/bash

out=$(yarn audit --json)
code=$(echo $out | jq 'select(.data.vulnerabilities.low != null)|.data.vulnerabilities.low' -r -M)

yarn add request request-promise
node .pipelines/send-result.js audit $(date +%s) $1 $2 "$out" $3


exit $code