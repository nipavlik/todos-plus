// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecsFormat = require('@elastic/ecs-winston-format');

import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

export const winstonLogger = {
  logger: WinstonModule.createLogger({
    transports: [
      new transports.File({
        filename: `logs/logs.json`,
        format: ecsFormat(),
      }),
      new transports.Console({
        format: format.combine(
          format.cli(),
          format.splat(),
          format.timestamp(),
          format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }),
        ),
      }),
    ],
  }),
};
