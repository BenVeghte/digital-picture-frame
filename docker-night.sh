#!/bin/bash
docker container stop picture-frame-server &

pkill chromium

DISPLAY=:0 xset dpms force off