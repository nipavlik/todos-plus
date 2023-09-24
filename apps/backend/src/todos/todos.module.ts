import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisCacheModule } from '../cache/redisCache.module';

import { TodosController } from './todos.rest.controller';

import { TodosService } from './todos.service';
import { TodosCacheService } from './todosCache.service';

import { Todo } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), RedisCacheModule],
  controllers: [TodosController],
  providers: [TodosService, TodosCacheService],
})
export class TodosModule {}
