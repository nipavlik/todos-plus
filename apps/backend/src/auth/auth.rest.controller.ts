import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
// import * as lodash from 'lodash';

import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

import { AuthService } from './auth.service';
import { RegisterBodyDto } from './dto/registerBody.dto';

import { RefreshTokenBodyDto } from './dto/refreshTokenBody.dto';

import { AuthUser } from './decorators/authUser.decorator';

// import {  } from '../users/types';
import { PairKey } from './types';
import { User } from '../users/entities/user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login/local')
  async loginLocal(@AuthUser() user: any): Promise<PairKey> {
    return this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterBodyDto) {
    const newUser: User = await this.authService.register(registerDto);

    // const userNoPassword = lodash.omit(newUser, ['password']);

    // return userNoPassword;

    return newUser;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenBodyDto,
  ): Promise<PairKey> {
    return await this.authService.refreshToken(refreshTokenDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@AuthUser() user: any) {
    return await this.authService.me(user.id);
  }
}
