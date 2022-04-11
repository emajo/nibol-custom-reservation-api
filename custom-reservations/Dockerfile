FROM node:16

WORKDIR /custom-reservations
COPY package.json .
RUN npm install
COPY . .
CMD npm run watch
