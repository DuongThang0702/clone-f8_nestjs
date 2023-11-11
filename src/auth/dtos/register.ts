import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  role: string;
  @IsNotEmpty()
  phoneNumber: number;
  @IsNotEmpty()
  dateOfBirth: Date;
}

export class RegisterSuccess {
  @Expose()
  email: string;

  @Expose()
  id: string;

  @Expose()
  fullname: string;

  @Exclude()
  password: string;

  @Exclude()
  role: string;

  @Exclude()
  refresh_token: string;

  @Exclude()
  is_blocked: boolean;

  @Exclude()
  createdAt: string;

  @Exclude()
  deletedAt: string;

  @Exclude()
  updatedAt: string;
}
