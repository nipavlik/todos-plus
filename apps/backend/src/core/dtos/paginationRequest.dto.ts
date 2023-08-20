import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsNotEmpty({ message: 'PAGE_IS_NOT_EMPTY' })
  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'PAGE_IS_NUMBER' },
  )
  @Min(1, { message: 'PAGE_MIN_1' })
  page: number = 1;

  @Type(() => Number)
  @IsNotEmpty({ message: 'LIMIT_IS_NOT_EMPTY' })
  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'LIMIT_IS_NUMBER' },
  )
  @Min(1, { message: 'LIMIT_MIN_1' })
  @Max(20, { message: 'LIMIT_MAX_20' })
  limit: number = 10;
}
