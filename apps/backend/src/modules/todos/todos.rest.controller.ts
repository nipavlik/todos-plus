import { Controller, Post, Get, UseGuards, Body, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { TodosService } from './todos.service';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { JwtUser } from '../users/types';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { Todo } from './types';
import { PaginationRequestDto } from 'src/core/dtos/paginationRequest.dto';
import { PaginationTransformPipe } from 'src/core/pipes/paginationTransform.pipe';
import { ReturnPagination, getPaginationOptions } from 'src/utils/paginations';

@Controller('/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(
    @AuthUser() user: JwtUser,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return await this.todosService.create({
      title: createTodoDto.title,
      content: createTodoDto.content,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAll(
    @AuthUser() user: JwtUser,
    @Query(new PaginationTransformPipe()) pagination: PaginationRequestDto,
  ): Promise<ReturnPagination<Todo>> {
    const paginationOptions = getPaginationOptions(
      pagination.page,
      pagination.limit,
    );

    return await this.todosService.getAll({
      where: {
        userId: user.id,
      },
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
      orderBy: { createdAt: 'desc' },
    });
  }
}
