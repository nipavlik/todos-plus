import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import * as lodash from 'lodash';

import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';

import { UsersService } from './users.service';
import { JwtUser, User, UserNoPassword } from '../users/types';
import { AuthUser } from '../auth/decorators/authUser.decorator';
import { GetOneParams } from './dto/getOneParams.dto';

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:userId')
  async getOne(
    @AuthUser() currentUser: JwtUser,
    @Param() params: GetOneParams,
  ): Promise<UserNoPassword> {
    const user: User | null = await this.usersService.getOne({
      id: params.userId,
    });

    if (!user) throw new NotFoundException('NOT_FOUND_USER');

    const userNoPassword: UserNoPassword = lodash.omit(user, ['password']);

    return userNoPassword;
  }
}
