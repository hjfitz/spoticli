#!/bin/bash

docker pull zricethezav/gitleaks
docker run --rm --name=gitleaks -v $(pwd):/code/ zricethezav/gitleaks -v --repo-path=/code