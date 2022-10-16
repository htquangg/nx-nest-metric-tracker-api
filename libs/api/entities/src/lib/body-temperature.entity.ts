import { Entity, Column, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

import { BodyVitalsDetailsLog } from './body-vitals-details-log.entity';
import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';

export type BodyTemperatureProps = EntityProps<BodyTemperature>;

@Entity({ name: ENTITY_NAME.BODY_TEMPERATURE })
export class BodyTemperature extends EverfitBaseEntity {
  @Exclude()
  @Column({ name: 'body_vitals_details_log_id' })
  bodyVitalsDetailsLogId: string;

  @Expose()
  @Column()
  temperature: number;

  @Expose()
  @Column({ name: 'measurement_unit_id' })
  measurementUnitId: string;

  @Exclude()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @OneToOne((_type) => BodyVitalsDetailsLog)
  @JoinTable({ name: ENTITY_NAME.BODY_VITALS_DETAILS_LOG })
  @JoinColumn({ name: 'body_vitals_details_log_id' })
  bodyVitalsDetailsLog?: BodyVitalsDetailsLog;
}
