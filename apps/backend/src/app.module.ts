import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configModuleOptions } from './core/config/options';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodosModule } from './modules/todos/todos.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TodosModule,
    ConfigModule.forRoot(configModuleOptions),
  ],
})
export class AppModule {}
