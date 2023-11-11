import { IsNotEmpty } from 'class-validator';

export class CreateUserByAdminDto {
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
