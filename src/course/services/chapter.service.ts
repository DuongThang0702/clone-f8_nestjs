import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter, ChapterDocument, Course } from 'src/utils/schema';
import { IChapter, ILesson } from '../interfaces';
import { Services } from 'src/utils/contants';
import { CreateChapterDto, UpdateChapterDto } from '../Dtos';

@Injectable()
export class ChapterService implements IChapter {
  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    @InjectModel(Course.name) private readonly CourseModel: Model<Course>,
    @Inject(forwardRef(() => Services.LESSON_SERVICE))
    private readonly lessonService: ILesson,
  ) {}
  async getAll(): Promise<ChapterDocument[]> {
    return await this.chapterModel.find();
  }
  async getOneById(ChapterId: string): Promise<ChapterDocument> {
    const validateID = Types.ObjectId.isValid(ChapterId);
    if (!validateID)
      throw new HttpException('invalid chapter id', HttpStatus.BAD_REQUEST);
    const chapter = await this.chapterModel.findById(ChapterId);
    if (chapter === null)
      throw new HttpException('chapter not found', HttpStatus.NOT_FOUND);
    else return chapter;
  }
  async create(
    courseId: string,
    data: CreateChapterDto,
  ): Promise<ChapterDocument> {
    const validateId = Types.ObjectId.isValid(courseId);
    if (!validateId)
      throw new HttpException('invalid courseId', HttpStatus.BAD_REQUEST);
    const matchChapter = await this.chapterModel.findOne({ title: data.title });
    if (matchChapter)
      throw new HttpException('chapter has been exist', HttpStatus.BAD_REQUEST);
    const chapter = new this.chapterModel({
      title: data.title,
    });
    const result: ChapterDocument = await chapter.save();
    if (result === null)
      throw new HttpException('something went wrong!', HttpStatus.BAD_REQUEST);

    if (data.lesson) {
      data.lesson.map(async (rs) => {
        await this.lessonService.create(result, { title: rs });
      });
    }

    await this.CourseModel.findByIdAndUpdate(courseId, {
      $push: { chapter: result._id },
    });
    return result;
  }
  async update(id: string, data: UpdateChapterDto): Promise<ChapterDocument> {
    const validateId = Types.ObjectId.isValid(id);
    if (!validateId)
      throw new HttpException('invalid courseId', HttpStatus.BAD_REQUEST);
    const chapter = await this.chapterModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true },
    );
    if (chapter === null)
      throw new HttpException('chapter not found', HttpStatus.NOT_FOUND);
    else return chapter;
  }
  async delete(chapterId: string): Promise<ChapterDocument> {
    const validateID = Types.ObjectId.isValid(chapterId);
    if (!validateID)
      throw new HttpException('invalid chapter id', HttpStatus.BAD_REQUEST);
    const chapter: ChapterDocument =
      await this.chapterModel.findById(chapterId);
    if (!chapter)
      throw new HttpException('chapter id not found', HttpStatus.NOT_FOUND);
    else {
      chapter.lesson.map(
        async (el) =>
          await this.lessonService.delete(
            el._id.toString(),
            chapter._id.toString(),
          ),
      );
      const response = await chapter.deleteOne();
      return response;
    }
  }
}
