import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';

import { BodyTemperature } from './body-temperature.entity';
import { BodyDistance } from './body-distance.entity';
import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';
import { BodyVitalsLog } from './body-vitals-log.entity';

export type BodyVitalsDetailsLogProps = EntityProps<BodyVitalsDetailsLog>;

@Entity({ name: ENTITY_NAME.BODY_VITALS_DETAILS_LOG })
export class BodyVitalsDetailsLog extends EverfitBaseEntity {
  @Expose()
  @Column({ name: 'user_id' })
  userId: string;

  @Expose()
  @Column({ name: 'body_vitals_log_id' })
  bodyVitalsLogId: string;

  @Expose()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @OneToOne(
    (_type) => BodyTemperature,
    (bodyTemperature) => bodyTemperature.bodyVitalsDetailsLog,
  )
  bodyTemperature?: BodyTemperature;

  @OneToOne(
    (_type) => BodyDistance,
    (bodyDistance) => bodyDistance.bodyVitalsDetailsLog,
  )
  bodyDistance?: BodyDistance;

  @ManyToOne(
    () => BodyVitalsLog,
    (bodyVitalsLog) => bodyVitalsLog.bodyVitalDetailsLogs,
  )
  @JoinColumn({ name: 'body_vitals_log_id' })
  bodyVitalsLog?: BodyVitalsLog;
}
