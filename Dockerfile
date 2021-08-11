FROM node:12-buster-slim

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install --only=production
COPY server.js .
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
USER node
