import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { JwtStrategyService } from './guards';
import { LoggerMiddleware, RequestIdMiddleware } from './middlewares';

@Module({
  controllers: [],
  providers: [RequestIdMiddleware, LoggerMiddleware, JwtStrategyService],
  exports: [],
})
export class ApiCommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
