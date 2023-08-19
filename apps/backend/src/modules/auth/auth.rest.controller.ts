import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { FastifyRequest } from 'fastify';
import { AuthService, PairKey } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { UserNoPassword } from '../users/types/user.type';
import { User } from '@prisma/client';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login/local')
  async loginLocal(@Request() req: FastifyRequest): Promise<PairKey> {
    // @ts-ignore
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto): Promise<UserNoPassword> {
    const newUser: User = await this.authService.register(registerDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }
}
