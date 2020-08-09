#!/bin/bash
. /home/BenVeghte/pre-docker-storage/digital-picture-frame/
git pull &
sleep 15s
chmod -x morning.sh
chmod -x night.sh
docker build -t digitalpictureframeserver . &
sleep 30s

docker run --rm -p 3000:3000 -v /home/BenVeghte/Ansel:/NAS --name picture-frame-server digitalpictureframeserver &
sleep 15s

xset s noblank
xset dpms force on
/usr/bin/chromium --noerrdialogs --disable-infobars --kiosk http://localhost:3000 &
