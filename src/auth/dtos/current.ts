import { Exclude, Expose } from 'class-transformer';

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
