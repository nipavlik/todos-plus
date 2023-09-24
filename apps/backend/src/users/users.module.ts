import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheModule } from '../cache/redisCache.module';

import { UsersController } from './users.rest.controller';

import { UsersService } from './users.service';
import { UsersCacheService } from './usersCache.service';

import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisCacheModule],
  controllers: [UsersController],
  providers: [UsersService, UsersCacheService],
  exports: [UsersService],
})
export class UsersModule {}
