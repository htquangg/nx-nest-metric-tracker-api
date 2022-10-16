import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRateService } from './exchange-rate.service';

import { ExchangeRate } from '@everfit/api/entities';
import { ApiCachingModule } from '@everfit/api/services';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate]), ApiCachingModule],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
