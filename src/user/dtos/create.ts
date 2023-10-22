import { IsNotEmpty } from 'class-validator';

export class CreateUserByAdminDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  role: string;
}
