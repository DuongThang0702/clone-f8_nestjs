import { ChapterDocument, LessonDocument } from 'src/utils/schema';
import { CreateLessonDto, UpdateLessonDto } from '../Dtos';
import { ObjectId, Types } from 'mongoose';

export interface ILesson {
  getAll(): Promise<LessonDocument[]>;
  getOneById(id: string): Promise<LessonDocument>;
  create(
    chapterId: ChapterDocument,
    data: { title: string },
  ): Promise<LessonDocument>;
  update(id: string, data: UpdateLessonDto): Promise<LessonDocument>;
  delete(id: string, chapterId: string): Promise<LessonDocument>;
}
