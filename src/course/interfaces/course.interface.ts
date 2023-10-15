import { CourseDocument } from 'src/utils/schema';
import { CreateCourseDto, UpdateCourseDto } from '../Dtos/course.dtos';

export interface ICourseService {
  getAll(): Promise<CourseDocument[]>;
  getOneBy(courseId: string): Promise<CourseDocument>;
  create(data: CreateCourseDto, file: Express.Multer.File): Promise<any>;
  patch(courseId, data: UpdateCourseDto): Promise<CourseDocument>;
  delete(courseId: string): Promise<CourseDocument>;
}
