import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { UsersController } from './users.rest.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
