#!/bin/bash

git clone https://github.com/ajinabraham/NodeJsScan scan
cd scan
docker build -t nodejsscan-cli -f cli.dockerfile  .
cd ..
docker run -v $(pwd):/src nodejsscan-cli -d /src/bin -o /src/results.json

res=$(cat results.json| jq '.total_count.sec')

cat results.json

# exit with the amount of errors. 0 errors means an ok exit code!

exit $res