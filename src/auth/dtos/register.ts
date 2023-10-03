import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(6)
  password: string;

  @Expose()
  @IsNotEmpty()
  fullname: string;
}
