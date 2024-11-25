FROM node:20-slim

WORKDIR /app

COPY server/package**.json server/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY server/. .

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "run", "start:prod" ]