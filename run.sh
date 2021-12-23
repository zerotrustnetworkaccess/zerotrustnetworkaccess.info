#!/bin/sh

docker build -t jekyll .
docker run --rm -it -p 8080:8080 -v ${PWD}/src:/home jekyll