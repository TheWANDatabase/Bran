FROM node:lts-alpine as build

WORKDIR /app

COPY ./src src
COPY ./fb_key.json .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install -ci
RUN npm i -g typescript
RUN npm run build

FROM node:lts-slim

WORKDIR /app

COPY --from=build /app .

CMD ["node", "dist/index.js"]