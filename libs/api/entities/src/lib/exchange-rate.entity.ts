import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: 'ExchangeRate' })
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
