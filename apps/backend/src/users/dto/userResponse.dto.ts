import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  createdAt: Date;
}
