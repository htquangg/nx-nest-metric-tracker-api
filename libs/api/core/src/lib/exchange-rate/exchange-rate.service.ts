import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExchangeRate } from '@everfit/api/entities';

@Injectable()
export class ExchangeRateService {
  constructor(
    @InjectRepository(ExchangeRateService)
    protected readonly repository: Repository<ExchangeRate>,
  ) {}
}
