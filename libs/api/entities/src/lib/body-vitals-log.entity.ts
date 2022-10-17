import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { User } from './user.entity';
import { ENTITY_NAME } from '../constants';

import { EntityProps, EverfitBaseEntity } from '@everfit/api/common';
import { BodyVitalsDetailsLog } from './body-vitals-details-log.entity';

export type BodyVitalsLogProps = EntityProps<BodyVitalsLog>;

@Entity({ name: ENTITY_NAME.BODY_VITALS_LOG })
export class BodyVitalsLog extends EverfitBaseEntity {
  @Expose()
  @Column({ name: 'user_id' })
  userId: string;

  @Exclude()
  @Column({ name: 'json_data', nullable: true })
  jsonData?: string;

  @ManyToOne(() => User, (user) => user.bodyVitalLogs)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(
    () => BodyVitalsDetailsLog,
    (bodyVitalsDetailsLog) => bodyVitalsDetailsLog.bodyVitalsLog,
  )
  bodyVitalDetailsLogs: BodyVitalsDetailsLog[];
}
