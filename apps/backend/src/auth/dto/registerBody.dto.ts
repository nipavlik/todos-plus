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

  @IsNotEmpty({ message: 'NICKNAME_IS_NOT_EMPTY' })
  @IsString({ message: 'NICKNAME_IS_STRING' })
  @MaxLength(255, { message: 'FNICKNAME_MAX_LENGTH_255' })
  @MinLength(5, { message: 'FNICKNAME_MIN_LENGTH_5' })
  nickname: string;

  @IsNotEmpty({ message: 'PASSWORD_IS_NOT_EMPTY' })
  @IsString({ message: 'PASSWORD_IS_STRING' })
  @MaxLength(64, { message: 'PASSWORD_MAX_LssENGTH_64' })
  password: string;
}
