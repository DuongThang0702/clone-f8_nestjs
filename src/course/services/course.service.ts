import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/utils/schema';
import { IChapter, ICourseService } from '../interfaces';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Services } from 'src/utils/contants';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @Inject(Services.CHAPTER_SERVICE) private readonly chapterService: IChapter,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async getAll(): Promise<CourseDocument[]> {
    const courses = await this.courseModel.find();
    return courses;
  }
  async getOneBy(courseId: string): Promise<CourseDocument> {
    const validObjectId = Types.ObjectId.isValid(courseId);
    if (!validObjectId)
      throw new HttpException('invalid courseId', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel.findById(courseId);
    if (course === null)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    else return course;
  }
  async create(
    data: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<CourseDocument> {
    const matchingCourse = await this.courseModel.findOne({
      title: data.title,
    });
    const updaloadimage = await this.cloudinaryService.uploadFile(file);

    if (matchingCourse && file) {
      await this.cloudinaryService.deleteImage(updaloadimage.public_id);
      throw new HttpException('title has been exsited', HttpStatus.BAD_REQUEST);
    }
    const course = new this.courseModel({
      title: data.title,
      description: data.description,
      promise: data.promise,
      thumbnail: {
        publicId: updaloadimage.public_id,
        path: updaloadimage.url,
      },
    });
    const response = await course.save();
    if (response === null) {
      await this.cloudinaryService.deleteImage(updaloadimage.public_id);
      throw new HttpException('title has been exsited', HttpStatus.BAD_REQUEST);
    }
    return response;
  }

  async patch(
    courseId: string,
    data: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<CourseDocument> {
    const matchingCourseId = Types.ObjectId.isValid(courseId);
    if (!matchingCourseId)
      throw new HttpException('invalid course id', HttpStatus.BAD_REQUEST);
    if (file) {
      const course = await this.courseModel.findById(courseId);
      if (course === null)
        throw new HttpException('courseId not found', HttpStatus.NOT_FOUND);
      await this.cloudinaryService.deleteImage(course.thumbnail.publicId);
      const updaloadimage = await this.cloudinaryService.uploadFile(file);
      course.thumbnail = {
        path: updaloadimage.url,
        publicId: updaloadimage.public_id,
      };
      const response = await course.updateOne();
      if (response === null)
        throw new HttpException(
          'Something went wrong!',
          HttpStatus.BAD_REQUEST,
        );
      else return response;
    } else {
      const course = await this.courseModel.findByIdAndUpdate(
        courseId,
        { ...data },
        { new: true },
      );
      if (course === null)
        throw new HttpException('Course id not found', HttpStatus.NOT_FOUND);
      return course;
    }
  }

  async delete(id: string): Promise<CourseDocument> {
    const validObjectId = Types.ObjectId.isValid(id);
    if (!validObjectId)
      throw new HttpException('invalid course id', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel.findById(id);
    if (course === null)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    await this.cloudinaryService.deleteImage(course.thumbnail.publicId);
    course.chapter.map(
      async (el) => await this.chapterService.delete(el.toString()),
    );
    const result = await course.deleteOne();
    return result;
  }
}
