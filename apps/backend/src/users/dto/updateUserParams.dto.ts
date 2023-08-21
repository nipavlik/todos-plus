import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateUserParams {
  @Type(() => Number)
  @IsNotEmpty({ message: 'USER_ID_IS_NOT_EMPTY' })
  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'USER_ID_IS_NUMBER' },
  )
  @Min(1, { message: 'USER_ID_MIN_1' })
  userId: number;
}
