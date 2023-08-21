import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DeleteParams {
  @Type(() => Number)
  @IsNotEmpty({ message: 'TODO_ID_IS_NOT_EMPTY' })
  @IsNumber(
    { allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'TODO_ID_IS_NUMBER' },
  )
  @Min(1, { message: 'TODO_ID_MIN_1' })
  todoId: number;
}
