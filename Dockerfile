
FROM node:17-slim as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

WORKDIR /app

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "npm", "start" ]