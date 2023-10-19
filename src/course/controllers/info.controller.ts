import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { IInfoCourse } from '../interfaces';
import { CreateInfoDto, UpdateInfoDto } from '../Dtos';

@Controller(Routes.INFO_COURSE)
export class InfoController {
  constructor(
    @Inject(Services.INFO_SERVICE) private readonly infoService: IInfoCourse,
  ) {}

  @Get()
  async GetAll() {
    return await this.infoService.getAll();
  }

  @Get(':infoId')
  async GetOneBy(@Param() param: { infoId: string }) {
    return await this.infoService.getOneBy(param.infoId);
  }

  @Post()
  async CreateInfo(@Body() data: CreateInfoDto) {
    return await this.infoService.create(data);
  }

  @Patch(':infoId')
  async UpdateInfo(
    @Param() params: { infoId: string },
    @Body() data: UpdateInfoDto,
  ) {
    return await this.infoService.update(params.infoId, data);
  }

  @Delete(':infoId')
  async DeleteInfo(@Param() param: { infoId: string }) {
    return await this.infoService.delete(param.infoId);
  }
}
