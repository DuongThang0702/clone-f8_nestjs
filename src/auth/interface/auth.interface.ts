import { UserEntity } from 'src/utils/entity/user.entity';
import { AuthenticatedDecode, UserLogin } from 'src/utils/types';

export interface IAuthService {
  login(
    payload: UserLogin,
  ): Promise<{ access_token: string; refresh_token: string }>;
  logout(
    userDecode: AuthenticatedDecode,
    refresh_token: string,
  ): Promise<boolean>;
  getCurrent(userDecode: AuthenticatedDecode): Promise<UserEntity>;
  refreshToken(
    userDecode: AuthenticatedDecode,
    refresh_token: string,
  ): Promise<{ access_token: string }>;
}
