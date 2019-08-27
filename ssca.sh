#!/bin/bash

git clone https://github.com/ajinabraham/NodeJsScan scan
cd scan
docker build -t nodejsscan-cli -f cli.dockerfile  .
cd ..
docker run -v $(echo $(pwd)):/src nodejsscan-cli -d /src/bin -o /src/results.json

echo $(cat results.json)