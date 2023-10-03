import { AuthenticatedDecode, UserLogin } from 'src/utils/types';

export interface IAuthService {
  login(
    payload: UserLogin,
  ): Promise<{ access_token: string; refresh_token: string }>;
  getCurrent(userDecode: AuthenticatedDecode): Promise<any>;
}
