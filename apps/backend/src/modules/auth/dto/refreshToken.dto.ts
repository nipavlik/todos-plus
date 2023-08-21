import { IsNotEmpty, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'TOKEN_IS_NOT_EMPTY' })
  @IsUUID(4, { message: 'TOKEN_IS_UUID' })
  token: string;
}
