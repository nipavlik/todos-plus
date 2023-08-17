import { Injectable } from '@nestjs/common';
import { PrismaService } from './core/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!2';
  }

  async test(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
