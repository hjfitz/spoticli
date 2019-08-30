#!/bin/bash

out=$(yarn lint)
code=$?

node .pipelines/scripts/send-result.js "lint" $(date +%s) $(Build.Repository.ID) $(Build.SourceBranchName) "$out" $(SERVER_URL)

exit $code