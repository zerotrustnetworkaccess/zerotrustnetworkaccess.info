#!/bin/sh

sudo docker build -t ztna-microsite .
sudo docker run --rm -it -p 8080:8080 -v ${PWD}:/home ztna-microsite