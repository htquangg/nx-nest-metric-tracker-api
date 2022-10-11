import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

export abstract class EverfitBaseEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt?: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
