import { LessonDocument } from 'src/utils/schema';
import { CreateLessonDto, UpdateLessonDto } from '../Dtos';

export interface ILesson {
  getAll(): Promise<LessonDocument[]>;
  getOneById(id: string): Promise<LessonDocument>;
  create(chapterId: string, data: CreateLessonDto): Promise<LessonDocument>;
  update(id: string, data: UpdateLessonDto): Promise<LessonDocument>;
  delete(id: string, chapterId: string): Promise<LessonDocument>;
}
