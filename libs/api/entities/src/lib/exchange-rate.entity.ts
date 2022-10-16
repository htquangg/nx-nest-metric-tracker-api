import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { ENTITY_NAME } from '../constants';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: ENTITY_NAME.EXCHANGE_RATE })
export class ExchangeRate extends EverfitBaseEntity {
  @Exclude()
  @Column()
  source: string;

  @Exclude()
  @Column()
  to: string;

  @Exclude()
  @Column()
  rate: number;
}
