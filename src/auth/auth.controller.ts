import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IUserService } from 'src/user/interface';
import { Routes, Services } from 'src/utils/contants';
import { RegisterDto } from './dtos/register';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USER_SERVICE) private userServices: IUserService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    const response = this.userServices.create(payload);
    return response;
  }
}
