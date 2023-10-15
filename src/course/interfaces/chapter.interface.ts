import { ChapterDocument } from 'src/utils/schema';

export interface IChapter {
  getAll(): Promise<ChapterDocument[]>;
  getOneById(ChapterId: string): Promise<ChapterDocument>;
  create(): Promise<ChapterDocument>;
  patch(): Promise<ChapterDocument>;
  delete(chapterId: string): Promise<ChapterDocument>;
}
