import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/utils/schema';
import { ICourseService } from '../interfaces';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
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
  async create(data: CreateCourseDto, file: Express.Multer.File): Promise<any> {
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
  ): Promise<CourseDocument> {
    const matchingCourseId = Types.ObjectId.isValid(courseId);
    if (!matchingCourseId)
      throw new HttpException('invalid course id', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel.findByIdAndUpdate(
      courseId,
      { ...data },
      { new: true },
    );
    return course;
  }

  async delete(id: string): Promise<CourseDocument> {
    const validObjectId = Types.ObjectId.isValid(id);
    if (!validObjectId)
      throw new HttpException('invalid course id', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel.findById(id);
    if (course === null)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    await this.cloudinaryService.deleteImage(course.thumbnail.publicId);
    const result = await course.deleteOne();
    return result;
  }
}
