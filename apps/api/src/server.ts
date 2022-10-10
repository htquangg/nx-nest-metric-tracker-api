import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

import { AppModule } from './app/app.module';
import {
  appConfiguration,
  authConfiguration,
  postgresConfiguration,
  redisConfiguration,
  mailConfiguration,
  throttlerConfiguration,
} from '@everfit/api/config';
import {
  AppConfig,
  AuthConfig,
  RedisConfig,
  PostgresConfig,
  MailConfig,
  ThrottlerConfig,
} from '@everfit/api/types';
import { TransformInterceptor } from '@everfit/api/common';

export const GLOBAL_PREFIX = 'api/v1';

/**
 * Initialize server instance.
 */
export async function initializeServer() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // write log all environment variables
  logEnvConfig(app);

  // register global prefix routers
  app.setGlobalPrefix(GLOBAL_PREFIX);

  await loadGlobalScopes(app);

  return app;
}

/**
 * Write log configuration when start-up project.
 *
 * @param app Entry (root) application module class.
 *
 * @returns void.
 */
function logEnvConfig<T extends INestApplication = INestApplication>(
  app: T,
): void {
  const config = {
    env: process.env.NODE_ENV,
    [appConfiguration.KEY]: app.get<AppConfig>(appConfiguration.KEY),
    [redisConfiguration.KEY]: app.get<RedisConfig>(redisConfiguration.KEY),
    [authConfiguration.KEY]: app.get<AuthConfig>(authConfiguration.KEY),
    [postgresConfiguration.KEY]: app.get<PostgresConfig>(
      postgresConfiguration.KEY,
    ),
    [mailConfiguration.KEY]: app.get<MailConfig>(mailConfiguration.KEY),
    [throttlerConfiguration.KEY]: app.get<ThrottlerConfig>(
      throttlerConfiguration.KEY,
    ),
  };
  // We don't use Logger (custom Logger) in our package here,
  // it stringtify object so not clearly in development console, inconvinient for debug.
  Logger.log(`🥊 🥊 🥊 Environment configuration 🥊 🥊 🥊`, config);
}

/**
 * A wrapper function around pipes, interceptor, etc.
 *
 * @param  app Entry (root) application module class.
 *
 * @returns {Promise<void>} A promise that, resolve void.
 */
async function loadGlobalScopes<T extends NestExpressApplication>(
  app: T,
): Promise<void> {
  // load middlware
  await loadMiddleware(app);

  // load global scoped pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: false,
    }),
  );

  // load global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
}

/**
 * A wrapper function around middleware.
 *
 * @param  app Entry (root) application module class.
 *
 * @returns {Promise<void>} A promise that, resolve void.
 */
async function loadMiddleware<T extends NestExpressApplication>(
  app: T,
): Promise<void> {
  const appConfig = app.get<AppConfig>(appConfiguration.KEY);
  // TODO: implement middleware for express app
  app.use(json({ limit: '350kb' }));
  app.use(urlencoded({ extended: true, limit: '350kb' }));
  app.disable('x-powered-by');
  app.enableCors({
    origin: '*',
  });
}
