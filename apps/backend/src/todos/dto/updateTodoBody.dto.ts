import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateTodoBodyDto {
  @IsNotEmpty({ message: 'TITLE_IS_NOT_EMPTY' })
  @IsString({ message: 'TITLE_IS_STRING' })
  @MaxLength(255, { message: 'TITLE_MAX_LENGTH_255' })
  title: string;

  @IsNotEmpty({ message: 'CONTENT_IS_NOT_EMPTY' })
  @IsString({ message: 'CONTENT_IS_STRING' })
  @MaxLength(255, { message: 'CONTENT_MAX_LENGTH_255' })
  content: string;

  @Type(() => Boolean)
  @IsBoolean({ message: 'DONE_IS_BOOLEAN' })
  @IsNotEmpty({ message: 'DONE_IS_NOT_EMPTY' })
  done: boolean;
}
