import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';

import { EverfitBaseEntity } from '@everfit/api/common';

@Entity({ name: 'User' })
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
