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
import { IChapter } from '../interfaces';
import { CreateChapterDto, UpdateChapterDto } from '../Dtos';

@Controller(Routes.CHAPTER)
export class ChapterController {
  constructor(
    @Inject(Services.CHAPTER_SERVICE) private readonly chapterService: IChapter,
  ) {}

  @Get()
  async GetAll() {
    return await this.chapterService.getAll();
  }

  @Get(':cid')
  async GetOneBy(@Param() param: { cid: string }) {
    return await this.chapterService.getOneById(param.cid);
  }

  @Post(':courseId')
  async CreateChapter(
    @Param() param: { courseId: string },
    @Body() data: CreateChapterDto,
  ) {
    return await this.chapterService.create(param.courseId, data);
  }

  @Patch(':chapterId')
  async UpdateChapter(
    @Param() params: { chapterId: string },
    @Body() data: UpdateChapterDto,
  ) {
    return await this.chapterService.update(params.chapterId, data);
  }

  @Delete(':chapterId')
  async DeleteChapter(@Param() param: { chapterId: string }) {
    return await this.chapterService.delete(param.chapterId);
  }
}
