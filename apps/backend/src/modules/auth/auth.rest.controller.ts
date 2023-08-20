import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';

import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

import { RefreshTokenDto } from './dtos/refreshToken.dto';

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
  async register(@Body() registerDto: RegisterDto): Promise<UserNoPassword> {
    const newUser: User = await this.authService.register(registerDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<PairKey> {
    return await this.authService.refreshToken(refreshTokenDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@AuthUser() user: JwtUser): Promise<UserNoPassword> {
    return await this.authService.me(user.id);
  }
}
