#!/bin/bash
git pull 
wait
chmod +x morning.sh
chmod +x night.sh

docker image rm digitalpictureframeserver
wait
docker image prune 
wait

docker build -t digitalpictureframeserver . 
wait

docker run --rm -p 3000:3000 -v /home/BenVeghte/Ansel:/NAS --name picture-frame-server digitalpictureframeserver &
export DISPLAY=:0
xset s noblank
wait
xset dpms force on
wait
/usr/bin/chromium --noerrdialogs --disable-infobars --kiosk http://localhost:3000



