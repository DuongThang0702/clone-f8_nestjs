import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LessonDocument, Lesson, ChapterDocument } from 'src/utils/schema';
import { IChapter, ILesson } from '../interfaces';
import { CreateLessonDto, UpdateLessonDto } from '../Dtos';
import { Services } from 'src/utils/contants';

@Injectable()
export class LessonService implements ILesson {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
    @Inject(Services.CHAPTER_SERVICE) private readonly chapterService: IChapter,
  ) {}
  async getAll(): Promise<LessonDocument[]> {
    return await this.lessonModel.find();
  }
  async getOneById(id: string): Promise<LessonDocument> {
    const validId = Types.ObjectId.isValid(id);
    if (!validId) throw new HttpException('invalid id', HttpStatus.BAD_REQUEST);
    const lesson = await this.lessonModel.findById(id);
    if (lesson === null)
      throw new HttpException('lesson not found', HttpStatus.NOT_FOUND);
    else return lesson;
  }
  async create(
    chapterId: string,
    data: CreateLessonDto,
  ): Promise<LessonDocument> {
    const exsitedLesson = await this.lessonModel.findOne({ title: data.title });
    if (exsitedLesson)
      throw new HttpException('title already exited', HttpStatus.BAD_REQUEST);
    const chapter: ChapterDocument =
      await this.chapterService.getOneById(chapterId);
    const newLesson = new this.lessonModel({ title: data.title });
    const response = await newLesson.save();
    if (response === null)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    await chapter.updateOne({}, { $push: { lesson: response._id } });
    return response;
  }
  async update(id: string, data: UpdateLessonDto): Promise<LessonDocument> {
    const exsitedLesson = await this.lessonModel.findById(id);
    if (exsitedLesson)
      throw new HttpException('title already exited', HttpStatus.BAD_REQUEST);
    const response = await this.lessonModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true },
    );
    if (response === null)
      throw new HttpException('lesson not found', HttpStatus.NOT_FOUND);
    else return response;
  }
  async delete(id: string, chapterId: string): Promise<LessonDocument> {
    const exsitedLesson = await this.lessonModel.findById(id);
    if (exsitedLesson)
      throw new HttpException('title already exited', HttpStatus.BAD_REQUEST);
    const chapter = await this.chapterService.getOneById(chapterId);
    const result: LessonDocument = await this.lessonModel.findById(id);
    if (result === null)
      throw new HttpException('lesson not found', HttpStatus.NOT_FOUND);
    await chapter.updateOne({}, { $pop: { lesson: result._id } });
    await result.deleteOne();
    return result;
  }
}
