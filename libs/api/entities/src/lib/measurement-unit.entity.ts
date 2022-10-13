import { Entity, Column } from 'typeorm';
import { Expose } from 'class-transformer';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';

export type MeasurementUnitProps = EntityProps<MeasurementUnit>;

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
  symbol: string;
}
