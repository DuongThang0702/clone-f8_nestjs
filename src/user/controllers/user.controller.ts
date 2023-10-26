import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { CreateUserByAdminDto } from '../dtos';
import { IUserService } from '../interface';
import { TQueryGetAll } from 'src/utils/types';

@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER_SERVICE) private readonly userService: IUserService,
  ) {}

  @Get()
  async GetAllUser(@Query() req: TQueryGetAll) {
    return await this.userService.find(req);
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
