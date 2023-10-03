import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/utils/entity/user.entity';
import { Repository } from 'typeorm';
import { IUserService } from './interface';
import { UserDetail } from 'src/utils/types';
import { hashSomthing } from 'src/utils/helper';
import { Providers } from 'src/utils/contants';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(Providers.USER_REPOSITORY)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async find(): Promise<UserEntity[]> {
    return await this.userRepo.find();
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ id });
    if (user) return user;
    else throw new HttpException('user notfound', HttpStatus.BAD_REQUEST);
  }

  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ email });
    if (user) return user;
    else throw new HttpException('email not found', HttpStatus.BAD_REQUEST);
  }

  async update(
    userData: UserEntity,
    refresh_token: string,
  ): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ id: userData.id });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    else {
      user.refresh_token = refresh_token;
      return await this.userRepo.save(user);
    }
  }

  async create(payload: UserDetail): Promise<UserEntity> {
    const existingUser = await this.userRepo.findOneBy({
      email: payload.email,
    });
    if (existingUser)
      throw new HttpException('user already existed', HttpStatus.BAD_REQUEST);
    const hashPassword = await hashSomthing(payload.password);
    const user = this.userRepo.create({ ...payload, password: hashPassword });
    const response = await this.userRepo.save(user);
    return response;
  }

  async delete(id: number): Promise<any> {
    const user = await this.userRepo.findOneBy({ id });
    if (user) {
      await this.userRepo.delete(user);
      throw new HttpException('deleted successfully', HttpStatus.OK);
    } else throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
  }
}
