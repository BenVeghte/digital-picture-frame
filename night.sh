#!/bin/bash
docker container stop picture-frame-server 
wait
pkill chromium
wait
export DISPLAY=:0
xset dpms force off