#!/bin/bash

docker container stop picture-frame-server
wait
docker container rm picture-frame-server
wait

git pull 
wait

docker build -t digitalpictureframeserver . 
wait

docker run --restart on-failure -p 3000:3000 -v /home/BenVeghte/Ansel:/NAS -v /home/BenVeghte/docker/digital_picture_frame/goodbadimgs:/goodbadimgs --name picture-frame-server digitalpictureframeserver &
wait

docker container stop picture-frame-server

