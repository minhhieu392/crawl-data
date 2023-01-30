#!/bin/bash

set -euo pipefail

BUILD_NUMBER=$1
DOCKER_IMAGE=docker.nhathuocgpp.com.vn/syncwebshop-prod:"$BUILD_NUMBER"
ENV_FILE=/data/envproduction/syncwebshop/.env.production
CONTAINER_NAME=syncwebshop-prod

if [ ! -f "$ENV_FILE" ]; then
    echo "$ENV_FILE does not existed. Exit."
    exit 1
fi
PORT=101
containerId=$(docker ps -qa --filter "name=$CONTAINER_NAME")
if [ -n "$containerId" ]; then
  echo "Stop and remove existing container..."
  docker stop $CONTAINER_NAME | xargs docker rm
fi

docker run -d --init --name "$CONTAINER_NAME" \
       --mount type=bind,source="$ENV_FILE",target=/usr/src/app/.env.production \
       --restart always \
       "$DOCKER_IMAGE" npm run start