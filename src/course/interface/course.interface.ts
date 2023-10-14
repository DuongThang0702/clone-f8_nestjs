import { CourseDocument } from 'src/utils/schema';
import { CreateCourseDto } from '../Dtos/course.dtos';

export interface ICourseService {
  getAll(): Promise<CourseDocument[]>;
  getOneBy(idCourse: string): Promise<CourseDocument>;
  create(data: CreateCourseDto, file: Express.Multer.File): Promise<any>;
  patch(): Promise<boolean>;
  delete(idCourse: string): Promise<boolean>;
}
