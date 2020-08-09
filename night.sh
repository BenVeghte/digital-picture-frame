#!/bin/bash
docker container stop picture-frame-server &
sleep 15s
pkill chromium &
mkdir /home/BenVeghte/thisworked
xset s blank
xset dpms force off