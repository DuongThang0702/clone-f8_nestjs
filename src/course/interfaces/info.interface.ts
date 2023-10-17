import { InfoCourseDocument } from 'src/utils/schema';
import { CreateInfoDto, UpdateInfoDto } from '../Dtos/';

export interface IInfoCourse {
  create(data: CreateInfoDto): Promise<InfoCourseDocument>;
  getAll(): Promise<InfoCourseDocument[]>;
  getOneBy(infoId: string): Promise<InfoCourseDocument>;
  update(infoId: string, data: UpdateInfoDto): Promise<InfoCourseDocument>;
  delete(infoId: string): Promise<boolean>;
}
