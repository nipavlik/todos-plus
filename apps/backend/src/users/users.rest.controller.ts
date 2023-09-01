import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import * as lodash from 'lodash';

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
  async getOne(
    @AuthUser() currentUser: JwtUser,
    @Param() params: GetUserParams,
  ): Promise<UserNoPassword> {
    const user: User | null = await this.usersService.getOne({
      id: params.userId,
    });

    if (!user) throw new NotFoundException('NOT_FOUND_USER');

    const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return userNoPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:userId')
  async update(
    @AuthUser() user: JwtUser,
    @Param() params: UpdateUserParams,
    @Body() updateUserDto: UpdateUserBodyDto,
  ): Promise<UserNoPassword> {
    return await this.usersService.update(params.userId, updateUserDto);
  }
}
