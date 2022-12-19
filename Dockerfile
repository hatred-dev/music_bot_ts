FROM node:current-alpine as builder
WORKDIR /app
RUN apk update
RUN apk add opus-dev make gcc g++ automake libtool autoconf python3
COPY src src
COPY types types
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install --verbose
RUN yarn run build

FROM node:current-alpine
RUN apk update
RUN apk add ffmpeg
WORKDIR /app
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prod prod
COPY package.json .env ./
ENTRYPOINT ["yarn","start"]