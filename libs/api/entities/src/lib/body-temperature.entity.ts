import { Entity, Column, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

import { BodyVitalsLog } from './body-vitals-log.entity';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: 'BodyTemperature' })
export class BodyTemperature extends EverfitBaseEntity {
  @Exclude()
  @Column({ name: 'body_vitals_log_id' })
  bodyVitalsLogId: number;

  @Expose()
  @Column()
  temperature: number;

  @Expose()
  @Column({ name: 'measurement_unit_id' })
  measurementUnitId: number;

  @Exclude()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @OneToOne((_type) => BodyVitalsLog)
  @JoinTable({ name: 'BodyVitalsLog' })
  @JoinColumn({ name: 'body_vitals_log_id' })
  bodyVitalsLog: BodyVitalsLog;
}
