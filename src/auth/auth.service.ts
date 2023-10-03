import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interface';
import { AuthenticatedDecode, UserLogin } from 'src/utils/types';
import { Services } from 'src/utils/contants';
import { IUserService } from 'src/user/interface';
import { compareSomething } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(Services.USER_SERVICE) private userServices: IUserService,
  ) {}
  async login(
    payload: UserLogin,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userServices.findOneByEmail(payload.email);
    const checkPassword = await compareSomething(
      payload.password,
      user.password,
    );
    if (!checkPassword)
      throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);

    const {
      password,
      is_blocked,
      createdAt,
      deletedAt,
      refresh_token,
      updatedAt,
      ...other
    } = user;
    const accessToken = await this.generateAccessToken(other);
    const refreshToken = await this.generateAccessToken({ id: other.id });
    await this.userServices.update(user, refreshToken);
    return {
      access_token: `Bearer ${accessToken}`,
      refresh_token: refreshToken,
    };
  }

  async getCurrent(userDecode: AuthenticatedDecode) {
    const user = await this.userServices.findById(userDecode.id);
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
