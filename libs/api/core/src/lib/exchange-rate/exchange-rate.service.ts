import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExchangeRate } from '@everfit/api/entities';
import { EverfitBaseService } from '@everfit/api/common';
import { CachingService } from '@everfit/api/services';
import { check, is } from '@everfit/shared/utils';
import { ExchangeRateError } from './exchange-rate.error';

const CACHE_PREFIX_EXCHANGE_RATE = '__exchange_rate_';

@Injectable()
export class ExchangeRateService extends EverfitBaseService<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    protected readonly repository: Repository<ExchangeRate>,
    protected readonly cacheService: CachingService,
  ) {
    super(repository);
  }

  async getRate(source: string, to: string): Promise<number> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_EXCHANGE_RATE}_${source}_${to}`,
      async () => {
        const exchangeRate = await this.findOne({
          where: { source, to },
        });
        check(exchangeRate, is.notNil, new ExchangeRateError(source, to));
        return exchangeRate.rate;
      },
    );
  }
}
