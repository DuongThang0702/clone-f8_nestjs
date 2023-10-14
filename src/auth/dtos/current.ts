import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/utils/contants';

export class CurrentDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  fullname: string;

  @Expose()
  is_blocked: boolean;

  @Exclude()
  refresh_token: string;

  @Expose()
  role: string;
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
