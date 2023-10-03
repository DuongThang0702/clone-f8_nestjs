import { UserEntity } from 'src/utils/entity/user.entity';
import { UserDetail } from 'src/utils/types';

export interface IUserService {
  find(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity>;
  update(): Promise<boolean>;
  create(payload: UserDetail): Promise<UserEntity>;
  delete(id: number): Promise<boolean>;
  test(): any;
}
