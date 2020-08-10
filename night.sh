#!/bin/bash
docker container stop picture-frame-server &
sleep 15s
pkill chromium &
export DISPLAY=:0
xset dpms force off