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

  async getOne(options: {
    where: Prisma.RefreshTokenWhereInput;
  }): Promise<RefreshToken | null> {
    const { where } = options;
    return await this.prisma.refreshToken.findFirst({ where });
  }

  async update(params: {
    where: Prisma.RefreshTokenWhereUniqueInput;
    data: Prisma.RefreshTokenUpdateInput;
  }): Promise<RefreshToken> {
    const { where, data } = params;
    return this.prisma.refreshToken.update({ where, data });
  }
}
