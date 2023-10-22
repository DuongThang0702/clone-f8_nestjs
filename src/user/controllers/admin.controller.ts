import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { CreateUserByAdminDto } from '../dtos';
import { IUserService } from '../interface';

@Controller(Routes.ADMIN_USER)
export class AdminController {
  constructor(
    @Inject(Services.USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get()
  async GetAllUser() {
    return await this.userService.find();
  }

  @Get(':id')
  async GetUserById(@Param() param: { id: string }) {
    return await this.userService.findById(param.id);
  }

  @Post()
  async CreateUserByAdmin(@Body() data: CreateUserByAdminDto) {
    return await this.userService.create(data);
  }

  @Delete(':id')
  async DeleteUserByAdmin(@Param() param: { id: string }) {
    return await this.userService.delete(param.id);
  }
}
