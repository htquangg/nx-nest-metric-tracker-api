import {
  Repository,
  DeepPartial,
  SaveOptions,
  RemoveOptions,
  InsertResult,
  ObjectID,
  FindOptionsWhere,
  DeleteResult,
  UpdateResult,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { EverfitBaseEntity } from './base.entity';

/**
 * Base Service is supposed to work with your repository. Find entities, insert, update, delete, etc.
 */
export class EverfitBaseService<
  TEntity extends EverfitBaseEntity = EverfitBaseEntity,
> {
  protected constructor(
    @InjectRepository(EverfitBaseEntity)
    protected repository: Repository<TEntity>,
  ) {}

  /**
   * Creates a new entity instance or instances.
   * Can copy properties from the given object into new entities.
   */
  create(
    plainEntityLikeOrPlainEntityLikes?:
      | DeepPartial<TEntity>
      | DeepPartial<TEntity>[],
  ): TEntity | TEntity[] {
    if (!plainEntityLikeOrPlainEntityLikes) {
      return this.repository.create();
    }
    if (Array.isArray(plainEntityLikeOrPlainEntityLikes)) {
      return this.repository.create(plainEntityLikeOrPlainEntityLikes);
    }
    return this.repository.create(plainEntityLikeOrPlainEntityLikes);
  }

  /**
   * Saves a given entity in the database.
   */
  async save<T extends DeepPartial<TEntity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      return await this.repository.save(entityOrEntities, options);
    }
    return await this.repository.save(entityOrEntities, options);
  }

  /**
   * Removes a given entity from the database.
   */
  async remove(
    entityOrEntities: TEntity | TEntity[],
    options?: RemoveOptions,
  ): Promise<TEntity | TEntity[]> {
    if (Array.isArray(entityOrEntities)) {
      return this.repository.remove(entityOrEntities, options);
    }
    return await this.repository.remove(entityOrEntities, options);
  }

  /**
   * Records the delete date of one or many given entities.
   */
  async softRemove<T extends DeepPartial<TEntity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      return await this.repository.softRemove(entityOrEntities, options);
    }
    return await this.repository.softRemove(entityOrEntities, options);
  }

  /**
   * Recovers one or many given entities.
   */
  async recover<T extends DeepPartial<TEntity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      return await this.repository.recover(entityOrEntities, options);
    }
    return await this.repository.recover(entityOrEntities, options);
  }

  /**
   * Inserts a given entity into the database.
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient INSERT query.
   * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
   * You can execute bulk inserts using this method.
   */
  async insert(
    entity: QueryDeepPartialEntity<TEntity> | QueryDeepPartialEntity<TEntity>[],
  ): Promise<InsertResult> {
    return await this.repository.insert(entity);
  }

  /**
   * Updates entity partially. Entity can be found by a given condition(s).
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient UPDATE query.
   * Does not check if entity exist in the database.
   * Condition(s) cannot be empty.
   */
  async update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<TEntity>,
    partialEntity: QueryDeepPartialEntity<TEntity>,
  ): Promise<UpdateResult> {
    return await this.repository.update(criteria, partialEntity);
  }

  /**
   * Deletes entities by a given condition(s).
   * Unlike save method executes a primitive operation without cascades, relations and other operations included.
   * Executes fast and efficient DELETE query.
   * Does not check if entity exist in the database.
   * Condition(s) cannot be empty.
   */
  async delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindOptionsWhere<TEntity>,
  ): Promise<DeleteResult> {
    return await this.repository.delete(criteria);
  }

  /**
   * Finds entities that match given find options.
   */
  async find(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return await this.repository.find(options);
  }

  /**
   * Finds entities that match given find options.
   */
  async findBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<TEntity[]> {
    return await this.repository.findBy(where);
  }

  /**
   * Finds first entity by a given find options.
   * If entity was not found in the database - returns null.
   */
  async findOne(options: FindOneOptions<TEntity>): Promise<TEntity | null> {
    return await this.repository.findOne(options);
  }

  /**
   * Finds first entity that matches given where condition.
   * If entity was not found in the database - returns null.
   */
  async findOneBy(
    where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[],
  ): Promise<TEntity | null> {
    return await this.repository.findOneBy(where);
  }
}
