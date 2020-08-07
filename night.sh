#!/bin/bash
docker container stop picture-frame-server &
sleep 15s
pkill chromium &

xset s blank
xset dpms force off