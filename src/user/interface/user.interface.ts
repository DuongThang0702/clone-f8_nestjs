import { User, UserDocument } from 'src/utils/schema/user/user.schema';
import { TQueryGetAll, UserDetail } from 'src/utils/types';

export interface IUserService {
  find(req: TQueryGetAll): Promise<{
    counts: number;
    users: UserDocument[];
  }>;
  findById(id: string): Promise<UserDocument>;
  update(payload: UserDocument, newdata: object): Promise<UserDocument>;
  create(payload: UserDetail): Promise<UserDocument>;
  delete(id: string): Promise<boolean>;
  findOneBy(data: object): Promise<UserDocument>;
}
