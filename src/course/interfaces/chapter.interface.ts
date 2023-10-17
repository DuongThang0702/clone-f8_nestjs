import { ChapterDocument } from 'src/utils/schema';
import { CreateChapterDto, UpdateChapterDto } from '../Dtos';

export interface IChapter {
  getAll(): Promise<ChapterDocument[]>;
  getOneById(ChapterId: string): Promise<ChapterDocument>;
  create(courseId: string, data: CreateChapterDto): Promise<ChapterDocument>;
  update(chapterId: string, data: UpdateChapterDto): Promise<ChapterDocument>;
  delete(chapterId: string): Promise<ChapterDocument>;
}
