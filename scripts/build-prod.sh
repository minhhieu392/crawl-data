#!/bin/bash

set -euo pipefail

DOCKER_REGISTRY=docker.nhathuocgpp.com.vn

docker build --build-arg node_env=production -t $DOCKER_REGISTRY/syncwebshop-prod:"${1:-latest}" .
docker push $DOCKER_REGISTRY/syncwebshop-prod:"$BUILD_NUMBER"
