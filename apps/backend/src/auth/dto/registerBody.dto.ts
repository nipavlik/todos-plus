import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterBodyDto {
  @IsNotEmpty({ message: 'FIRST_NAME_IS_NOT_EMPTY' })
  @IsString({ message: 'FIRST_NAME_IS_STRING' })
  @MaxLength(255, { message: 'FIRST_NAME_MAX_LENGTH_255' })
  firstName: string;

  @IsNotEmpty({ message: 'LAST_NAME_IS_NOT_EMPTY' })
  @IsString({ message: 'LAST_NAME_IS_STRING' })
  @MaxLength(255, { message: 'LAST_NAME_MAX_LENGTH_255' })
  lastName: string;

  @IsNotEmpty({ message: 'USERNAME_IS_NOT_EMPTY' })
  @IsString({ message: 'USERNAME_IS_STRING' })
  @MaxLength(255, { message: 'USERNAME_MAX_LENGTH_255' })
  @MinLength(5, { message: 'USERNAME_MIN_LENGTH_5' })
  username: string;

  @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MaxLength(64, { message: 'PASSWORD_MAX_LENGTH_64' })
  password: string;
}
