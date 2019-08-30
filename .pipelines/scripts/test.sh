#!/bin/bash

out=$(yarn test)
code=$?

node .pipelines/scripts/send-result.js "test" $(date +%s) $(Build.Repository.ID) $(Build.SourceBranchName) "$out" $(SERVER_URL)

exit $code