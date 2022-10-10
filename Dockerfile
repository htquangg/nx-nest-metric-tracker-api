ARG NODE_VERSION=14.20.1-alpine3.16

FROM node:$NODE_VERSION AS base

FROM base AS build

WORKDIR /app

COPY . .

RUN yarn install && yarn build

FROM base AS server

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env_prod .

RUN yarn install --production=true --no-lockfile

EXPOSE 3001

CMD ["node", "dist/apps/api/main"]
