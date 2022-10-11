import { Entity, Column } from 'typeorm';
import { Expose } from 'class-transformer';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: 'MeasurementUnit' })
export class MeasurementUnit extends EverfitBaseEntity {
  @Expose()
  @Column()
  parameter: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  symbol: number;
}
