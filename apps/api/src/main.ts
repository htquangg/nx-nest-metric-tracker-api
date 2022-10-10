import { Logger } from '@nestjs/common';

import { initializeServer } from './server';

import { appConfiguration } from '@everfit/api/config';
import { AppConfig } from '@everfit/api/types';

/**
 * Entrypoint project.
 */
(async function bootstrap() {
  const server = await initializeServer();

  const appConfig = server.get<AppConfig>(appConfiguration.KEY);

  // starts the project
  await server.listen(appConfig.port);

  Logger.log(`🚀 Application is running on: ${await server.getUrl()}`);
})();
