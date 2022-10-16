import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExchangeRate } from '@everfit/api/entities';
import { EverfitBaseService } from '@everfit/api/common';

@Injectable()
export class ExchangeRateService extends EverfitBaseService<ExchangeRate> {
  constructor(
    @InjectRepository(ExchangeRate)
    protected readonly repository: Repository<ExchangeRate>,
  ) {
    super(repository);
  }
}
