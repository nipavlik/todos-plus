import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './core/config/app.config';
import { validate } from './core/config/env.validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './core/prisma/prisma.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      validate,
    }),
    // End Config
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
