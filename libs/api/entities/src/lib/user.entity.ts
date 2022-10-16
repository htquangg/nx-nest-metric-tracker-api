import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';

import { BodyVitalsLog } from './body-vitals-log.entity';
import { ENTITY_NAME } from '../constants';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: ENTITY_NAME.USER })
export class User extends EverfitBaseEntity {
  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Exclude()
  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Expose()
  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Expose()
  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Expose()
  @Column({ nullable: true })
  about?: string;

  @Expose()
  @Column({ nullable: true })
  avatar?: string;

  @Expose()
  @Column({ nullable: true })
  phone?: string;

  @Exclude()
  @Column({ name: 'last_sign_on', nullable: true })
  lastSignOn?: Date;

  @Exclude()
  @Column({ name: 'last_vitals_log_one_month', nullable: true })
  lastVitalsLogOneMonth?: string;

  @Exclude()
  @Column({ name: 'last_vitals_log_two_months', nullable: true })
  lastVitalsLogTwoMonths?: string;

  @OneToMany(() => BodyVitalsLog, (bodyVitalsLog) => bodyVitalsLog.user)
  bodyVitalLogs: BodyVitalsLog[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword(): void {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
