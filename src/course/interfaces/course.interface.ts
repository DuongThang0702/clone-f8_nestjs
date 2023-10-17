import { CourseDocument } from 'src/utils/schema';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos/course.dtos';

export interface ICourseService {
  getAll(): Promise<CourseDocument[]>;
  getOneBy(courseId: string): Promise<CourseDocument>;
  create(
    data: CreateCourseDto,
    file: Express.Multer.File,
  ): Promise<CourseDocument>;
  patch(
    courseId: string,
    data: UpdateCourseDto,
    file?: Express.Multer.File,
  ): Promise<CourseDocument>;
  delete(courseId: string): Promise<CourseDocument>;
}
