#!/bin/sh

docker build -t ztna-microsite .
docker run --rm -it -p 8080:8080 -v ${PWD}:/home ztna-microsite