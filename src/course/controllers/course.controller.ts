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
  Patch,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/contants';
import { ICourseService } from '../interfaces';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(Routes.COURSE)
export class CourseController {
  constructor(
    @Inject(Services.COURSE_SERVICE)
    private readonly courseService: ICourseService,
  ) {}

  @Get()
  async GetAll() {
    return await this.courseService.getAll();
  }

  @Get(':id')
  async GetOneBy(@Param() param: { id: string }) {
    return await this.courseService.getOneBy(param.id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async CreateCourse(
    @Body() data: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.courseService.create(data, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async UpdateCourse(
    @Body() data: UpdateCourseDto,
    @Param() param: { id: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) return await this.courseService.patch(param.id, data, file);
    else return await this.courseService.patch(param.id, data);
  }
  @Delete(':id')
  async DeleteCourse(@Param() params: { id: string }) {
    return await this.courseService.delete(params.id);
  }
}
