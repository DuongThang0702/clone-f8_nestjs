import {
  Controller,
  Inject,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { ICourseService } from '../interfaces';
import { CreateCourseDto } from '../Dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(Routes.COURSE)
export class CourseController {
  constructor(
    @Inject(Services.COURSE_SERVICE)
    private readonly courseService: ICourseService,
  ) {}

  @Get()
  async GetAll() {
    const response = await this.courseService.getAll();
    return response;
  }

  @Get(':id')
  async GetOneBy(@Param() param: { id: string }) {
    const response = await this.courseService.getOneBy(param.id);
    return response;
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async CreateCourse(
    @Body() data: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.courseService.create(data, file);
  }

  @Delete(':id')
  async DeleteCourse(@Param() params: { id: string }) {
    const response = await this.courseService.delete(params.id);
    return response;
  }
}
