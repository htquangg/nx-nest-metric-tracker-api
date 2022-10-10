import { Module } from '@nestjs/common';
import { ApiCachingModule } from './caching';

@Module({
  imports: [ApiCachingModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiServicesModule {}
