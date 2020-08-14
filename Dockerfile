FROM node:12
WORKDIR /src/
COPY package*.json ./
RUN npm ci --only=production
COPY index.html .
COPY index.js .
COPY changefolder.html .
COPY badimg.html . 
COPT goodimg.html .
EXPOSE 3000
CMD ["node", "index.js"]