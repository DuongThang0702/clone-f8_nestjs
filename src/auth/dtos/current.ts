import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/utils/contants';

export class infoUserDto {
  @Expose()
  dateOfBirth: Date;
  @Expose()
  phoneNumber: number;
  @Expose()
  sex: string;
  @Expose()
  studyTime: Date;
  @Expose()
  fullname: string;
  @Expose()
  graduatedFromSchool: string;
  @Expose()
  major: string;
}

export class CurrentDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  is_blocked: boolean;

  @Exclude()
  refresh_token: string;

  @Expose()
  role: string;

  @Expose()
  info?: infoUserDto;
}

export class AccessTokenDto {
  @Expose()
  email: string;

  @Expose()
  fullname: string;

  @Expose()
  role: UserRole;

  @Expose()
  _id: string;
}
