import { Entity, Column } from 'typeorm';
import { Expose } from 'class-transformer';

import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';

export type MeasurementUnitProps = EntityProps<MeasurementUnit>;

@Entity({ name: ENTITY_NAME.MEASUREMENT_UNIT })
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
