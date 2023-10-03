import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from 'src/user/interface';
import { Routes, Services } from 'src/utils/contants';
import { plainToInstance } from 'class-transformer';
import { CurrentDto, LoginDto, RegisterDto, RegisterSuccess } from './dtos/';
import { IAuthService } from './interface';
import { JwtAuthGuard } from './guards';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USER_SERVICE) private userServices: IUserService,
    @Inject(Services.AUTH_SERVICE) private authServices: IAuthService,
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
      expires: process.env.EXPIRESIN_ACCESSTOKEN,
      httpOnly: true,
    });
    return res.status(200).json(response);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCurrent(@Req() req: AuthenticatedRequest, @Res() res) {
    const response = await this.authServices.getCurrent(req.user);

    return res.status(200).json(
      plainToInstance(CurrentDto, response, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
