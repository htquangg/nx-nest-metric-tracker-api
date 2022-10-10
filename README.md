# Test Exercise Monorepo

## Local Development

1. `yarn` to install all dependencies
2. `yarn start` to run the API (written with [NestJS](https://nestjs.com))

## File Structure

```
everfit (root)
|____apps
|____libs
|____package.json
|____nx.json
|____...
```

### Root

Root directory contains mostly configuration files for the project such as: `package.json`, `tsconfig.json` and`nx.json`. The most important files that
you'd probably touch are `nx.json`.

- `nx.json`: This is the **Nx Workspace** configuration files where it contains information about all the `libs` and `apps` in the workspace along with their internal dependencies (not npm packages)

### `apps`

This folder houses all current `apps` within the `workspace`.

- `api`: **Nest** application with **REST API** and **PostgresSQL**

### `libs`

This folder houses all related `libs` to be used for `apps` (either by a single specific app or shared within apps). Three main top-level libs are:

- `api`: All `libs` to be used by the `api` app. This lib houses all **Feature Modules** with related **Entities**, **Repositories**, **Services**.
- `background`: All `libs` to be used by the `api` application for **Background Tasks**.
- `shared`: All `libs` to be used by both the `api` and `web app` applications(`if have`).

## Environment Variables

The project does use **Environment Variables** provided from `process.env`.You can quickly setup environment via: `cp .env.example .env` (MacOS or Linux).

There are 5 (as of the moment) main configurations whose values can be provided by `process.env`:

### App Configuration

Main application configuration like `host`, `port`, and `env` etc.

| var name      | type   | default               | description                                                                                                                                                              |
| ------------- | ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| APP_HOST      | string | localhost             | The host of the application less the protocol                                                                                                                            |
| APP_PORT      | number | 3001                  | The port of the application                                                                                                                                              |
| APP_DOMAIN    | string | http://localhost:3001 | Full domain of the application                                                                                                                                           |
| NODE_ENV      | string | development           | The environment that the application is running on. Most of the time, the cloud platform that the application is deployed will set `NODE_ENV` to `production` by default |
| CLIENT_DOMAIN | string | http://localhost:3000 | The domain of the frontend application. This is used to setup `CORS` for Cookie Authentication as well as email related (upcoming if needed) operations                  |

### Auth Configuration

This configuration will determine how `nestjs/passport` and `nestjs/jwt` behaves.

| var name          | type   | default    | description                                                                                            |
| ----------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------------ |
| JWT_SECRET        | string | jwtSecret  | The secret (for `accessToken`) that `jsonwebtoken` will use to sign the payload with.                  |
| JWT_EXPIRED       | string | 24h        | The expiration of `accessToken`                                                                        |
| JWT_SALT          | number | 12         | Salt value for `bcrypt`                                                                                |
| SIGN_TOKEN_SECRET | string | signSecret | The secret (for `signSecret`) that will use to hash query param to prevent hacker from relaying attack |
| X_API_KEY         | string | xApiKey    | The secret (for `xApiKey`) that guard will use to authentication in header.                            |

### Postgres Configuration

**PostgresSQL** configuration

| var name             | type   | default                      | description                               |
| -------------------- | ------ | ---------------------------- | ----------------------------------------- |
| POSTGRES_DB_HOST     | string | 127.0.0.1                    | The host that **PostgresSQL** will run on |
| POSTGRES_DB_PORT     | number | 5432                         | The port that **PostgresSQL** will run on |
| POSTGRES_DB_DATABASE | string | ddb-everfit-exercise-dev-001 | The name of the database                  |
| POSTGRES_DB_USERNAME | string | postgres                     | The username of the database              |
| POSTGRES_DB_PASSWORD | string | postgres                     | The username of the database              |

### Redis Configuration

**Redis** configuration that will power `bull-arena`, `nestjs/bull`, and `CachingService`

| var name            | type    | default   | description                                  |
| ------------------- | ------- | --------- | -------------------------------------------- |
| REDIS_CACHE_ENABLED | boolean | true      | Whether **Redis** should be enabled          |
| REDIS_HOST          | string  | 127.0.0.1 | The host that **Redis** will run on          |
| REDIS_PASSWORD      | string  | password  | The password that **Redis** will run on      |
| REDIS_PORT          | number  | 6379      | The port that **Redis** will run on          |
| REDIS_TTL           | number  | 86400     | Time-to-live configuration. Default to 1 day |

### Throttler Configuration

**Throttler** configuration that will power `@nestjs/throttler`

| var name        | type   | default    | description                                                              |
| --------------- | ------ | ---------- | ------------------------------------------------------------------------ |
| THROTTLER_TTL   | number | 900=15\*60 | The amount of seconds of how many requests are allowed within this time. |
| THROTTLER_LIMIT | number | 600        | The amount of requests that are allowed within the ttl's time window.    |

## Tech Stack

- [Nx](https://nx.dev)
- [NestJS](https://nestjs.com)
- [PostgresSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Stay in touch

- Author - [Alex Huynh](https://github.com/htquangg)
- Linkedin - [Alex Huynh](https://www.linkedin.com/in/food-delivery/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE)
