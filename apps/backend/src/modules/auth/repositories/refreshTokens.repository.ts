import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Prisma, RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokensRepository {
  constructor(private prisma: PrismaService) {}

  async create(params: {
    data: Prisma.RefreshTokenCreateInput;
  }): Promise<RefreshToken> {
    const { data } = params;

    return this.prisma.refreshToken.create({ data });
  }
}
