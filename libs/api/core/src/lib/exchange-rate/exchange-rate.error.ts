import { InternalServerErrorException } from '@nestjs/common';

export class ExchangeRateError extends InternalServerErrorException {
  constructor(source: string, to: string) {
    super(`ExchangeRate is not definded: ${source} --> ${to}`);
  }
}
