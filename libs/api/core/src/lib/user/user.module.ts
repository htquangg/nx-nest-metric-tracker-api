import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '@everfit/api/entities';
import { ApiCachingModule } from '@everfit/api/services';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ApiCachingModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
