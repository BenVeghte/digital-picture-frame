#!/bin/bash

docker container start picture-frame-server
wait

DISPLAY=:0 xset dpms force on
DISPLAY=:0 xset s noblank
DISPLAY=:0 xset s off
DISPLAY=:0 xset -dpms
DISPLAY=:0 /usr/bin/chromium-browser --check-for-update-interval=604800 --noerrdialogs --disable-infobars --kiosk http://localhost:3000 &
unclutter -idle 0.5 &


