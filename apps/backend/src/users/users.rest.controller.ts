import { Controller, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
// import * as lodash from 'lodash';

import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { GetUserParams } from './dto/getUserParams.dto';
import { UpdateUserParams } from './dto/updateUserParams.dto';
import { UpdateUserBodyDto } from './dto/updateUserBody.dto';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getOne(@AuthUser() currentUser: any, @Param() params: GetUserParams) {
    const user = await this.usersService.getOneByIdOrFail(params.userId);

    // const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  async update(
    @AuthUser() user: any,
    @Param() params: UpdateUserParams,
    @Body() updateUserDto: UpdateUserBodyDto,
  ) {
    return await this.usersService.update(params.userId, updateUserDto);
  }
}
