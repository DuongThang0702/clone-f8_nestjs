import { Exclude, Expose } from 'class-transformer';

export class CurrentDto {
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  fullname: string;

  @Expose()
  is_blocked: boolean;

  @Expose()
  refresh_token: string;

  @Expose()
  role: string;
}
