import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

import { User } from './user.entity';
import { BodyTemperature } from './body-temperature.entity';
import { BodyDistance } from './body-distance.entity';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: 'BodyVitalsLog' })
export class BodyVitalsLog extends EverfitBaseEntity {
  @Exclude()
  @Column({ name: 'user_id' })
  userId: number;

  @Exclude()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @Expose()
  @OneToOne(
    (_type) => BodyTemperature,
    (bodyTemperature) => bodyTemperature.bodyVitalsLog,
  )
  bodyTemperature: BodyTemperature;

  @Expose()
  @OneToOne(
    (_type) => BodyDistance,
    (bodyDistance) => bodyDistance.bodyVitalsLog,
  )
  bodyDistance: BodyDistance;

  @ManyToOne(() => User, (user) => user.bodyVitalLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
