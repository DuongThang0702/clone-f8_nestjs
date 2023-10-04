import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/user/interface';
import { Routes, Services } from 'src/utils/contants';
import { plainToInstance } from 'class-transformer';
import {
  CurrentDto,
  LoginDto,
  LoginSuccessDto,
  RegisterDto,
  RegisterSuccess,
} from './dtos/';
import { IAuthService } from './interface';
import { JwtAuthGuard } from './guards';
import { AuthenticatedRequest } from 'src/utils/types';
import { ConfigService } from '@nestjs/config';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USER_SERVICE) private userServices: IUserService,
    @Inject(Services.AUTH_SERVICE) private authServices: IAuthService,
    private config: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterDto): Promise<RegisterSuccess> {
    const response = await this.userServices.create(payload);
    return plainToInstance(RegisterSuccess, response, {
      excludeExtraneousValues: true,
    });
  }

  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res) {
    const response = await this.authServices.login(payload);
    res.cookie('refresh_token', response.refresh_token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    return res.status(200).json(
      plainToInstance(LoginSuccessDto, response, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrent(@Req() req: AuthenticatedRequest, @Res() res) {
    const response = await this.authServices.getCurrent(req.user);
    return res.status(200).json(
      plainToInstance(CurrentDto, response, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('refresh-token')
  @UseGuards(JwtAuthGuard)
  async getAccessToken(@Req() req) {
    const cookie = req.cookies;
    if (!cookie || !cookie.refresh_token)
      throw new HttpException('no token on cookie', HttpStatus.BAD_REQUEST);
    const response = await this.authServices.refreshToken(
      req.user,
      cookie.refresh_token,
    );
    return response;
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res) {
    const cookie = req.cookies;
    if (!cookie || !cookie.refresh_token)
      throw new HttpException('no token on cookie', HttpStatus.BAD_REQUEST);
    const response = await this.authServices.logout(
      req.user,
      cookie.refresh_token,
    );
    if (response) {
      res.clearCookie('refresh_token', { httpOnly: true, secure: true });
      res.status(200).json({ mes: 'logout successfully' });
    } else
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
}
