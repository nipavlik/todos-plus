import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AuthUser } from './decorators/authUser.decorator';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

import { AuthService } from './auth.service';

import { RegisterBodyDto } from './dto/registerBody.dto';
import { RefreshTokenBodyDto } from './dto/refreshTokenBody.dto';
import { UserResponseDto } from '../users/dto/userResponse.dto';

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
  async register(
    @Body() registerDto: RegisterBodyDto,
  ): Promise<UserResponseDto> {
    const newUser: User = await this.authService.register(registerDto);

    return plainToClass(UserResponseDto, newUser);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenBodyDto,
  ): Promise<PairKey> {
    return await this.authService.refreshToken(refreshTokenDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@AuthUser() user: any): Promise<UserResponseDto> {
    const me = await this.authService.me(user.id);

    return plainToClass(UserResponseDto, me);
  }
}
