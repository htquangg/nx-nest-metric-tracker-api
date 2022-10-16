import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Expose } from 'class-transformer';

import { User } from './user.entity';
import { BodyTemperature } from './body-temperature.entity';
import { BodyDistance } from './body-distance.entity';
import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';

export type BodyVitalsLogProps = EntityProps<BodyVitalsLog>;

@Entity({ name: ENTITY_NAME.BODY_VITALS_LOG })
export class BodyVitalsLog extends EverfitBaseEntity {
  @Expose()
  @Column({ name: 'user_id' })
  userId: string;

  @Expose()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @OneToOne(
    (_type) => BodyTemperature,
    (bodyTemperature) => bodyTemperature.bodyVitalsLog,
  )
  bodyTemperature?: BodyTemperature;

  @OneToOne(
    (_type) => BodyDistance,
    (bodyDistance) => bodyDistance.bodyVitalsLog,
  )
  bodyDistance?: BodyDistance;

  @ManyToOne(() => User, (user) => user.bodyVitalLogs)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
