import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import * as lodash from 'lodash';

import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

import { AuthService } from './auth.service';
import { RegisterBodyDto } from './dto/registerBody.dto';

import { RefreshTokenBodyDto } from './dto/refreshTokenBody.dto';

import { AuthUser } from './decorators/authUser.decorator';

import { JwtUser, User, UserNoPassword } from '../users/types';
import { PairKey } from './types';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login/local')
  async loginLocal(@AuthUser() user: User): Promise<PairKey> {
    return this.authService.login(user);
  }

  @Post('/register')
  async register(
    @Body() registerDto: RegisterBodyDto,
  ): Promise<UserNoPassword> {
    const newUser: User = await this.authService.register(registerDto);

    const userNoPassword: UserNoPassword = lodash.omit(newUser, ['password']);

    return userNoPassword;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenBodyDto,
  ): Promise<PairKey> {
    return await this.authService.refreshToken(refreshTokenDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@AuthUser() user: JwtUser): Promise<UserNoPassword> {
    return await this.authService.me(user.id);
  }
}
