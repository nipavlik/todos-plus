import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserBodyDto {
  @IsNotEmpty({ message: 'FIRST_NAME_IS_NOT_EMPTY' })
  @IsString({ message: 'FIRST_NAME_IS_STRING' })
  @MaxLength(255, { message: 'FIRST_NAME_MAX_LENGTH_255' })
  firstName: string;

  @IsNotEmpty({ message: 'LAST_NAME_IS_NOT_EMPTY' })
  @IsString({ message: 'LAST_NAME_IS_STRING' })
  @MaxLength(255, { message: 'LAST_NAME_MAX_LENGTH_255' })
  lastName: string;

  @IsOptional()
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MaxLength(64, { message: 'PASSWORD_MAX_LENGTH_64' })
  password: string;
}
