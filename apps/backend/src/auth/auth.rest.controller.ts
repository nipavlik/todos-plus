import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Throttle } from '@nestjs/throttler';

import { ThrottlerIpGuard } from '../rateLimit/guards/throttlerIp.guard';
import { ThrottlerUserGuard } from '../rateLimit/guards/throttlerUser.guard';

import { AuthUser } from './decorators/authUser.decorator';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

import { AuthService } from './auth.service';

import { RegisterBodyDto } from './dto/registerBody.dto';
import { RefreshTokenBodyDto } from './dto/refreshTokenBody.dto';
import { UserResponseDto } from '../users/dto/userResponse.dto';

import { PairKey } from './types';
import { JwtUser } from '../users/types';

import { User } from '../users/entities/user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 20, ttl: 60 * 1000 } })
  @UseGuards(ThrottlerIpGuard, LocalAuthGuard)
  @Post('/login/local')
  async loginLocal(@AuthUser() user: User): Promise<PairKey> {
    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 20, ttl: 60 * 1000 } })
  @UseGuards(ThrottlerIpGuard)
  @Post('/register')
  async register(
    @Body() registerDto: RegisterBodyDto,
  ): Promise<UserResponseDto> {
    const newUser: User = await this.authService.register(registerDto);

    return plainToClass(UserResponseDto, newUser);
  }

  @Throttle({ default: { limit: 20, ttl: 60 * 1000 } })
  @UseGuards(ThrottlerIpGuard)
  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenBodyDto,
  ): Promise<PairKey> {
    return await this.authService.refreshToken(refreshTokenDto.token);
  }

  @Throttle({ default: { limit: 100, ttl: 60 * 1000 } })
  @UseGuards(JwtAuthGuard, ThrottlerUserGuard)
  @Get('/me')
  async me(@AuthUser() user: JwtUser): Promise<UserResponseDto> {
    const me = await this.authService.me(user.id);

    return plainToClass(UserResponseDto, me);
  }
}
