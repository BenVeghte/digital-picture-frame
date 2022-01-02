#!/bin/bash

pidof python | kill
wait

git pull
wait

python main.py

