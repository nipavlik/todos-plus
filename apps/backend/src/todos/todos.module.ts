import { Module } from '@nestjs/common';

import { TodosController } from './todos.rest.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
