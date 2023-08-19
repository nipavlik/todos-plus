import { ConfigModuleOptions } from '@nestjs/config';

import { validate } from './env.validation';

import appConfig from './app.config';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  load: [appConfig],
  validate,
};
