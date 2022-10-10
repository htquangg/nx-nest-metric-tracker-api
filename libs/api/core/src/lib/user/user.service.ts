import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthUserDto } from '../auth';

import { EverfitBaseService } from '@everfit/api/common';
import { CachingService } from '@everfit/api/services';
import { User } from '@everfit/api/entities';
import { createUID } from '@everfit/shared/utils';

@Injectable()
export class UserService extends EverfitBaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    protected readonly cacheService: CachingService,
  ) {
    super(repository);
  }

  /**
   * Return the user specified by its email without caching.
   *
   **/
  async findByEmail(email: string): Promise<User> {
    return await this.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * Return the user specified by its email with caching.
   *
   **/
  async getUserByEmail(email: string): Promise<User> {
    return await this.cacheService.get(`user_${email}`, () =>
      this.findOne({
        where: {
          email,
        },
      }),
    );
  }

  /**
   * Return the user specified by its identification with caching.
   *
   **/
  async getUserById(id: string): Promise<User> {
    return await this.cacheService.get(`user_${id}`, () =>
      this.findOne({
        where: {
          id,
        },
      }),
    );
  }

  async createUser(params: Partial<User>) {
    const user = {
      ...params,
      id: createUID(),
    };
    return (await this.save(this.create(user))) as User;
  }

  async getUserInformation(currentUser: AuthUserDto): Promise<User> {
    return await this.getUserById(currentUser.id);
  }
}
