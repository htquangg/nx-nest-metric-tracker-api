import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

export abstract class EverfitBaseEntity extends BaseEntity {
  @Expose()
  @PrimaryColumn()
  id: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  signedUpAt?: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt?: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
