import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configModuleOptions } from './core/config/options';

import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(configModuleOptions),
  ],
})
export class AppModule {}
