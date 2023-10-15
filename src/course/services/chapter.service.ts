import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { Chapter, ChapterDocument } from 'src/utils/schema';
import { IChapter } from '../interfaces';

@Injectable()
export class ChapterService implements IChapter {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
  ) {}
  async getAll(): Promise<ChapterDocument[]> {
    return await this.chapterModel.find();
  }
  async getOneById(ChapterId: string): Promise<ChapterDocument> {
    const validateID = Types.ObjectId.isValid(ChapterId);
    if (!validateID)
      throw new HttpException('invalid chapter id', HttpStatus.BAD_REQUEST);
    const chapter = await this.chapterModel.findById(ChapterId);
    return chapter;
  }
  async create(): Promise<ChapterDocument> {
    throw new Error('Method not implemented.');
  }
  async patch(): Promise<ChapterDocument> {
    throw new Error('Method not implemented.');
  }
  async delete(chapterId: string): Promise<ChapterDocument> {
    const validateID = Types.ObjectId.isValid(chapterId);
    if (!validateID)
      throw new HttpException('invalid chapter id', HttpStatus.BAD_REQUEST);
    const result = await this.chapterModel.findByIdAndDelete(chapterId);
    if (!result)
      throw new HttpException('chapter id not found', HttpStatus.NOT_FOUND);
    else return result;
  }
}
