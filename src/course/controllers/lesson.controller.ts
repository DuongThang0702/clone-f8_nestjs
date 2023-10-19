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
import { ILesson } from '../interfaces';
import { CreateLessonDto, UpdateLessonDto } from '../Dtos';

@Controller(Routes.LESSON)
export class LessonController {
  constructor(
    @Inject(Services.LESSON_SERVICE) private readonly lessonService: ILesson,
  ) {}

  @Get()
  async GetAll() {
    return await this.lessonService.getAll();
  }

  @Get(':lessonId')
  async GetOneBy(@Param() param: { lessonId: string }) {
    return await this.lessonService.getOneById(param.lessonId);
  }

  @Post(':chapterId')
  async CreateLesson(
    @Body() data: CreateLessonDto,
    @Param() param: { chapterId: string },
  ) {
    return await this.lessonService.create(param.chapterId, data);
  }

  @Patch(':lessonId')
  async UpdateLesson(
    @Param() params: { lessonId: string },
    @Body() data: UpdateLessonDto,
  ) {
    return await this.lessonService.update(params.lessonId, data);
  }

  //   @Delete(':lessonId')
  //   async DeleteInfo(@Param() param: { lessonId: string }) {
  //     return await this.lessonService.delete(param.lessonId);
  //   }
}
