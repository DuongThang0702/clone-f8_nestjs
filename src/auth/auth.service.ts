import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interface';
import { AuthenticatedDecode, UserLogin } from 'src/utils/types';
import { Services } from 'src/utils/contants';
import { IUserService } from 'src/user/interface';
import { compareSomething, hashSomthing } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(Services.USER_SERVICE) private userServices: IUserService,
  ) {}
  async refreshToken(
    userDecode: AuthenticatedDecode,
    rf: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userServices.findById(userDecode._id);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    else {
      const matchrf = await compareSomething(rf, user.refresh_token);
      if (!matchrf)
        throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
      else {
        const { password, is_blocked, refresh_token, ...other } = user;
        const access_token = await this.generateAccessToken(other);
        return { access_token };
      }
    }
  }
  async login(
    payload: UserLogin,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userServices.findOneBy({
      email: payload.email,
    });
    const checkPassword = await compareSomething(
      payload.password,
      user.password,
    );
    if (!checkPassword)
      throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);

    const { password, is_blocked, refresh_token, ...other } = user;
    const accessToken = await this.generateAccessToken(other);
    const refreshToken = await this.generateRefreshToken({ id: other._id });
    await this.userServices.update(user, await hashSomthing(refreshToken));
    return {
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    };
  }

  async logout(userDecode: AuthenticatedDecode, refresh_token: string) {
    const user = await this.userServices.findById(userDecode._id);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    else {
      const matchRf = await compareSomething(refresh_token, user.refresh_token);
      if (matchRf) {
        await this.userServices.update(user, '');
        return true;
      } else
        throw new HttpException(
          'invalid refresh_token',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async getCurrent(userDecode: AuthenticatedDecode) {
    const user = await this.userServices.findById(userDecode._id);
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    else return user;
  }

  async generateAccessToken(data: object): Promise<string> {
    return await this.jwtService.signAsync(
      { ...data },
      {
        expiresIn: process.env.EXPIRESIN_ACCESSTOKEN,
        secret: process.env.KEY_ACCESSTOKEN,
      },
    );
  }

  async generateRefreshToken(data: object): Promise<string> {
    return await this.jwtService.signAsync(
      { ...data },
      {
        expiresIn: process.env.EXPIRESIN_REFRESHTOKEN,
        secret: process.env.KEY_REFRESHTOKEN,
      },
    );
  }
}
