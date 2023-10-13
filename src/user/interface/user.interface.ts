import { User, UserDocument } from 'src/utils/schema/user.schema';
import { UserDetail } from 'src/utils/types';

export interface IUserService {
  find(): Promise<UserDocument[]>;
  findById(id: string): Promise<UserDocument>;
  update(payload: UserDocument, refresh_token: string): Promise<UserDocument>;
  create(payload: UserDetail): Promise<User>;
  delete(id: string): Promise<boolean>;
  findOneBy(data: object): Promise<UserDocument>;
}
