FROM node:alpine

ENV PORT 3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./ ./

ENV NODE_ENV production

RUN npm run build:prod

CMD ["npm", "run", "start:prod"]
