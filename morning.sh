#!/bin/bash
git pull 
wait

docker image rm digitalpictureframeserver
wait
docker image prune 
wait

docker build -t digitalpictureframeserver . 
wait

docker run --rm -p 3000:3000 -v /home/BenVeghte/Ansel:/NAS -v /home/BenVeghte/docker/digital_picture_frame/goodbadimgs:/goodbadimgs --name picture-frame-server digitalpictureframeserver &
sleep 15s
export DISPLAY=:0
xset dpms force on
xset s noblank
xset s off
xset -dpms
/usr/bin/chromium-browser --check-for-update-interval=604800 --noerrdialogs --disable-infobars --kiosk http://localhost:3000
unclutter -idle 0.5


