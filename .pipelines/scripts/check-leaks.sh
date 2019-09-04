#!/bin/bash

## script args: 
# $1 repo
# $2 branch
# $3 url


docker pull zricethezav/gitleaks
docker run --rm --name=gitleaks -v $(pwd):/code/ zricethezav/gitleaks -v --repo-path=/code
