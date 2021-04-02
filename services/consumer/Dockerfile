FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --global typescript 

RUN npm install -y 

RUN apk add --no-cache --upgrade bash

COPY . .

EXPOSE 4000

CMD [ "npm" , "run" , "dev" ]