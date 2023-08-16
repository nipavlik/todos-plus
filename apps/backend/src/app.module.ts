import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './core/config/app.config';
import { validate } from './core/config/env.validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
