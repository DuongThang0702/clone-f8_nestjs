import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/utils/schema';
import { ICourseService } from './interface';
import { CreateCourseDto } from './Dtos';
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
  async getOneBy(idCourse: string): Promise<CourseDocument> {
    const validObjectId = Types.ObjectId.isValid(idCourse);
    if (!validObjectId)
      throw new HttpException('invalid idCourse', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel.findById(idCourse);
    if (course === null)
      throw new HttpException('course not found', HttpStatus.NOT_FOUND);
    else return course;
  }
  async create(data: CreateCourseDto, file: Express.Multer.File): Promise<any> {
    const matchingCourse = await this.courseModel.findOne({
      title: data.title,
    });
    if (matchingCourse)
      throw new HttpException('title has been exsited', HttpStatus.BAD_REQUEST);
    const updaloadimage = await this.cloudinaryService.uploadFile(file);
    const course = new this.courseModel({
      title: data.title,
      description: data.description,
      promise: data.promise,
      thumbnail: {
        publicId: updaloadimage.public_id,
        path: updaloadimage.path,
      },
    });
    const response = await course.save();
    return response;
  }
  patch(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    const validObjectId = Types.ObjectId.isValid(id);
    if (!validObjectId)
      throw new HttpException('invalid idCourse', HttpStatus.BAD_REQUEST);
    const result: boolean = await this.courseModel.findByIdAndDelete(id);
    if (!result)
      throw new HttpException('course id not found', HttpStatus.NOT_FOUND);
    else throw new HttpException('deleted course successfully', HttpStatus.OK);
  }
}
