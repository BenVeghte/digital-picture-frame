#!/bin/bash
touch itexecuted.txt
git pull &
sleep 15s
chmod -x morning.sh
chmod -x night.sh

docker image rm digitalpictureframeserver &
docker image prune &
sleep 5s

docker build -t digitalpictureframeserver . &
sleep 30s

docker run --rm -p 3000:3000 -v /home/BenVeghte/Ansel:/NAS --name picture-frame-server digitalpictureframeserver &
sleep 15s

/usr/bin/chromium --noerrdialogs --disable-infobars --kiosk http://localhost:3000 &
xset dpms force on


