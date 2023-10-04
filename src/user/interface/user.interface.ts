import { UserEntity } from 'src/utils/entity/user.entity';
import { UserDetail } from 'src/utils/types';

export interface IUserService {
  find(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity>;
  update(payload: UserEntity, refresh_token: string): Promise<UserEntity>;
  create(payload: UserDetail): Promise<UserEntity>;
  delete(id: number): Promise<boolean>;
  findOneBy(data: object): Promise<UserEntity>;
}
