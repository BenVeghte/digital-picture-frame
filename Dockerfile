FROM node:12
WORKDIR /home/BenVeghte/docker/digital_picture_frame/
COPY package*.json ./
RUN npm ci --only=production
COPY index.html .
COPY index.js .
COPY changefolder.html .
EXPOSE 3000
CMD ["node", "index.js"]