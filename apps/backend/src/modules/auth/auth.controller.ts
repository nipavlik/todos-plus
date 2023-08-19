import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { FastifyRequest } from 'fastify';

@Controller('/auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: FastifyRequest) {
    return req.user;
  }
}
