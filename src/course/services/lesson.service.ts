import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
  LessonDocument,
  Lesson,
  ChapterDocument,
  Chapter,
} from 'src/utils/schema';
import { ILesson } from '../interfaces';
import { CreateLessonDto, UpdateLessonDto } from '../Dtos';

@Injectable()
export class LessonService implements ILesson {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
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
    chapterId: ChapterDocument,
    data: { title: string },
  ): Promise<LessonDocument> {
    const exsitedLesson = await this.lessonModel.findOne({ title: data.title });
    if (exsitedLesson)
      throw new HttpException('title already exited', HttpStatus.BAD_REQUEST);
    const newLesson = new this.lessonModel({ title: data.title });
    const response = await newLesson.save();
    if (response === null)
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    await chapterId.updateOne({
      $push: { lesson: response },
    });
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
    const result: LessonDocument = await this.lessonModel.findById(id);
    if (result === null)
      throw new HttpException('lesson not found', HttpStatus.NOT_FOUND);
    await this.chapterModel.findByIdAndUpdate(chapterId, {
      $pop: { lesson: result },
    });
    await result.deleteOne();
    return result;
  }
}
