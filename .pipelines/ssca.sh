#!/bin/bash

git clone https://github.com/ajinabraham/NodeJsScan scan
cd scan
docker build -t nodejsscan-cli -f cli.dockerfile  .
cd ..
docker run -v $(pwd):/src nodejsscan-cli -d /src/bin -o /src/results.json

res=$(cat results.json| jq '.total_count.sec')

# exit with the amount of errors. 0 errors means an ok exit code!
issues=$(cat results.json | jq .)

# install deps to phone home
yarn add request request-promise
node .pipelines/send-result.js ssca $(date +%s) $1 $2 "$issues" $3


exit $res