import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course, CourseDocument } from 'src/utils/schema';
import { IChapter, ICourseService, IInfoCourse } from '../interfaces';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Services } from 'src/utils/contants';
import { TQueryGetAll } from 'src/utils/types';

@Injectable()
export class CourseService implements ICourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @Inject(Services.CHAPTER_SERVICE) private readonly chapterService: IChapter,
    @Inject(Services.INFO_SERVICE) private readonly infoService: IInfoCourse,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async getAll(req: TQueryGetAll): Promise<{
    courses: CourseDocument[];
    counts: number;
  }> {
    const queries = { ...req };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const formatedQueries = JSON.parse(queryString);
    let queryObject = {};

    //Filtering
    if (queries?.title)
      formatedQueries.title = { $regex: queries.title, $options: 'i' };

    const queryCommand = this.courseModel.find({
      ...formatedQueries,
      ...queryObject,
    });

    //fields
    if (req?.fields) {
      const fields = req.fields.split(',').join(' ');
      queryCommand.select(fields);
    }

    //Sorting
    if (req?.sort) {
      const sortBy = req.sort.split(',').join(' ');
      queryCommand.sort(sortBy);
    }

    //pagination
    const page = parseInt(req.page) || 1;
    const limit = parseInt(req.limit) || parseInt(process.env.LIMIT);
    const skip = (page - 1) * limit;
    queryCommand.limit(limit).skip(skip).populate('info');

    return queryCommand
      .exec()
      .then(async (rs) => {
        const counts = await this.courseModel
          .find({
            ...formatedQueries,
            ...queryObject,
          })
          .countDocuments();
        return {
          counts: counts,
          courses: rs,
        };
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  async getOneBy(courseId: string): Promise<CourseDocument> {
    const validObjectId = Types.ObjectId.isValid(courseId);
    if (!validObjectId)
      throw new HttpException('invalid courseId', HttpStatus.BAD_REQUEST);
    const course = await this.courseModel
      .findById(courseId)
      .populate('info')
      .populate({
        path: 'chapter',
        populate: {
          path: 'lesson',
        },
      });
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
    const promise = data.promise.split(',');

    if (matchingCourse && file) {
      await this.cloudinaryService.deleteImage(updaloadimage.public_id);
      throw new HttpException('title has been exsited', HttpStatus.BAD_REQUEST);
    }
    const { area, duration, openingDay, schedule, slot } = data;
    const info = await this.infoService.create({
      area,
      duration,
      openingDay,
      schedule,
      slot,
    });
    const course = new this.courseModel({
      info: info,
      title: data.title,
      description: data.description,
      promise: promise,
      thumbnail: {
        publicId: updaloadimage.public_id,
        path: updaloadimage.secure_url,
      },
    });

    const response = await course.save();
    if (response === null) {
      await this.cloudinaryService.deleteImage(updaloadimage.public_id);
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
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
    const promise = data.promise.split(',');
    const { area, duration, openingDay, schedule, slot } = data;
    if (file) {
      const course = await this.courseModel.findById(courseId);
      if (course === null)
        throw new HttpException('courseId not found', HttpStatus.NOT_FOUND);
      await this.infoService.update(course.info.toString(), {
        area,
        duration,
        openingDay,
        schedule,
        slot,
      });
      await this.cloudinaryService.deleteImage(course.thumbnail.publicId);
      const updaloadimage = await this.cloudinaryService.uploadFile(file);
      course.thumbnail = {
        path: updaloadimage.url,
        publicId: updaloadimage.public_id,
      };
      course.promise = promise;
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
        { ...data, promise },
        { new: true },
      );
      await this.infoService.update(course.info.toString(), {
        area,
        duration,
        openingDay,
        schedule,
        slot,
      });
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
    await this.infoService.delete(course.info.toString());
    const result = await course.deleteOne();
    return result;
  }
}
