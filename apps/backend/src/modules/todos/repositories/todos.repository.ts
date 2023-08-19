import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class TodosRepository {
  constructor(private prisma: PrismaService) {}
}
