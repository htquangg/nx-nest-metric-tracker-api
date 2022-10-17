import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';

export type ExchangeRateProps = EntityProps<ExchangeRate>;

@Entity({ name: ENTITY_NAME.EXCHANGE_RATE })
export class ExchangeRate extends EverfitBaseEntity {
  @Exclude()
  @Column()
  source: string;

  @Exclude()
  @Column()
  to: string;

  @Exclude()
  @Column('decimal', { precision: 10, scale: 2 })
  rate: number;
}
