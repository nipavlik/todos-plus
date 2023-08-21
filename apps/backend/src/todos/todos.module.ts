import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { TodosRepository } from './repositories/todos.repository';
import { TodosController } from './todos.rest.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [PrismaModule],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
