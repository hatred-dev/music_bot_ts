FROM node:current-alpine as builder
WORKDIR /app
RUN apk update
RUN apk add opus-dev make gcc g++ automake libtool autoconf python3 libsodium-static
COPY src src
COPY types types
COPY package.json pnpm-lock.yaml tsconfig.json ./
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm add node-gyp-build
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