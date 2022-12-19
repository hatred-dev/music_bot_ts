FROM node:current-alpine as builder
WORKDIR /app
RUN apk update
RUN apk add opus-dev make gcc g++ automake libtool autoconf python3 libsodium curl
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm; chmod +x /bin/pnpm;
COPY src src
COPY types types
COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install
RUN pnpm run build

FROM node:current-alpine
RUN apk update
RUN apk add ffmpeg
WORKDIR /app
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prod prod
COPY package.json .env ./
ENTRYPOINT ["yarn", "start"]